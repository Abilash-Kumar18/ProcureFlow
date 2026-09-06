import { db, runInTransaction } from '../db/database.js';
import { ProcurementRecord, ProcurementOutcome } from '../../../shared/src/types.js';
import { sseService } from './sseService.js';
import { v4 as uuidv4 } from 'uuid';

export class ProcurementService {
  /**
   * Record weighbridge and quality assessment, generate official receipt, and queue payment
   */
  public recordProcurement(params: {
    booking_id: string;
    gross_weight_quintals: number;
    tare_weight_quintals: number;
    moisture_percentage: number;
    quality_grade: 'GRADE_A' | 'COMMON' | 'REJECTED';
    outcome: ProcurementOutcome;
    outcome_reason?: string;
    recorded_by: string;
  }) {
    return runInTransaction(() => {
      // 1. Fetch booking & commodity details
      const booking = db.prepare(`
        SELECT b.*, f.name as farmer_name, f.mobile as farmer_mobile, f.masked_payment_ref, f.bank_name,
               c.name as centre_name, comm.name as commodity_name, comm.msp_rate
        FROM bookings b
        JOIN farmer_profiles f ON b.farmer_id = f.id
        JOIN centre_days cd ON b.centre_day_id = cd.id
        JOIN centres c ON cd.centre_id = c.id
        JOIN commodities comm ON b.commodity_id = comm.id
        WHERE b.id = ?
      `).get(params.booking_id) as any;

      if (!booking) throw new Error('Booking not found');

      // Check if procurement already exists
      const existing = db.prepare(`SELECT * FROM procurement_records WHERE booking_id = ?`).get(params.booking_id);
      if (existing) {
        throw new Error('Procurement already recorded for this booking.');
      }

      // 2. Calculations
      const netQuantity = Math.max(0, params.gross_weight_quintals - params.tare_weight_quintals);

      // Moisture standard deduction (allowable: 14% for paddy)
      let moistureDeduction = 0.0;
      if (params.moisture_percentage > 14.0) {
        const excessPercentage = params.moisture_percentage - 14.0;
        moistureDeduction = Number(((netQuantity * excessPercentage) / 100).toFixed(2));
      }

      const finalPayableQty = Math.max(0, netQuantity - moistureDeduction);
      const rate = booking.msp_rate; // per quintal
      const grossAmount = Number((finalPayableQty * rate).toFixed(2));
      const deductionAmount = 0.0;
      const netAmount = Number((grossAmount - deductionAmount).toFixed(2));

      const receiptRef = `RCP-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
      const procurementId = `prc-${uuidv4().slice(0, 8)}`;

      // 3. Save procurement record
      db.prepare(`
        INSERT INTO procurement_records (
          id, booking_id, receipt_ref, commodity_id, gross_weight_quintals,
          tare_weight_quintals, net_quantity_quintals, moisture_percentage,
          moisture_deduction_quintals, final_payable_quantity, rate_per_quintal,
          gross_amount, deduction_amount, net_amount, quality_grade,
          outcome, outcome_reason, recorded_by, recorded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
      `).run(
        procurementId,
        params.booking_id,
        receiptRef,
        booking.commodity_id,
        params.gross_weight_quintals,
        params.tare_weight_quintals,
        netQuantity,
        params.moisture_percentage,
        moistureDeduction,
        finalPayableQty,
        rate,
        grossAmount,
        deductionAmount,
        netAmount,
        params.quality_grade,
        params.outcome,
        params.outcome_reason || null,
        params.recorded_by
      );

      // 4. Update queue entry to COMPLETED and free counter
      db.prepare(`
        UPDATE queue_entries
        SET state = 'COMPLETED', completed_at = DATETIME('now'), updated_at = DATETIME('now')
        WHERE booking_id = ?
      `).run(params.booking_id);

      db.prepare(`
        UPDATE service_counters
        SET current_queue_entry_id = NULL
        WHERE current_queue_entry_id = (SELECT id FROM queue_entries WHERE booking_id = ?)
      `).run(params.booking_id);

      // Update centre day served count
      db.prepare(`
        UPDATE centre_days
        SET served_farmer_count = served_farmer_count + 1
        WHERE id = ?
      `).run(booking.centre_day_id);

      // 5. Create initial payment record
      const paymentId = `pay-${uuidv4().slice(0, 8)}`;
      const paymentRef = `DBT-PFMS-${Math.floor(100000 + Math.random() * 900000)}`;

      db.prepare(`
        INSERT INTO payment_records (
          id, procurement_id, payment_ref_masked, bank_name, account_masked,
          amount, status, expected_at, last_updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, 'INITIATED', DATE('now', '+2 days'), ?)
      `).run(
        paymentId,
        procurementId,
        paymentRef,
        booking.bank_name || 'State Bank of India',
        booking.masked_payment_ref || 'SBIN*****4821',
        netAmount,
        params.recorded_by
      );

      // 6. Record Business Audit Event
      db.prepare(`
        INSERT INTO business_events (id, event_type, entity_type, entity_id, actor_name, actor_role, centre_id, summary)
        VALUES (?, 'PROCUREMENT_COMPLETED', 'PROCUREMENT', ?, ?, 'OPERATOR', ?, ?)
      `).run(
        `evt-${uuidv4().slice(0, 8)}`,
        procurementId,
        params.recorded_by,
        booking.centre_day_id,
        `Procurement recorded for ${booking.farmer_name}. Net: ${finalPayableQty} Qtl, Net Amount: ₹${netAmount.toLocaleString('en-IN')}. Receipt ${receiptRef}.`
      );

      // 7. SMS / Push Notification to Farmer
      db.prepare(`
        INSERT INTO notification_jobs (id, farmer_id, recipient_mobile, channel, title, message, status, sent_at)
        VALUES (?, ?, ?, 'SMS', 'Procurement Receipt Issued', ?, 'DELIVERED', DATETIME('now'))
      `).run(
        `notif-${uuidv4().slice(0, 8)}`,
        booking.farmer_id,
        booking.farmer_mobile,
        `🌾 ProcureFlow Receipt: ${receiptRef}. Net Weight: ${finalPayableQty} Qtl @ ₹${rate}/Qtl. Payable: ₹${netAmount.toLocaleString('en-IN')}. Direct Benefit Transfer initiated to ${booking.masked_payment_ref}.`
      );

      const record = (db.prepare(`SELECT * FROM procurement_records WHERE id = ?`).get(procurementId) as unknown) as ProcurementRecord;

      // Real-time broadcast
      sseService.broadcast(`centre:${booking.centre_day_id}`, 'procurement_completed', { record, receiptRef });
      sseService.broadcast(`booking:${params.booking_id}`, 'procurement_completed', { record, receiptRef });

      return {
        success: true,
        procurement: record,
        receipt_ref: receiptRef,
        net_amount: netAmount,
        payment_id: paymentId
      };
    });
  }

  /**
   * Get procurement receipt details for printable/modal display
   */
  public getProcurementReceipt(receiptRef: string) {
    return db.prepare(`
      SELECT p.*, b.booking_ref, b.token_no,
             f.name as farmer_name, f.mobile as farmer_mobile, f.village, f.masked_aadhaar, f.masked_payment_ref, f.bank_name,
             c.name as centre_name, c.address as centre_address, c.code as centre_code,
             comm.name as commodity_name, comm.variety as commodity_variety,
             pay.status as payment_status, pay.payment_ref_masked, pay.expected_at as payment_expected_at
      FROM procurement_records p
      JOIN bookings b ON p.booking_id = b.id
      JOIN farmer_profiles f ON b.farmer_id = f.id
      JOIN centre_days cd ON b.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      JOIN commodities comm ON p.commodity_id = comm.id
      LEFT JOIN payment_records pay ON p.id = pay.procurement_id
      WHERE p.receipt_ref = ? OR p.id = ?
    `).get(receiptRef, receiptRef);
  }
}

export const procurementService = new ProcurementService();
