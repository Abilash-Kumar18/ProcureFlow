import { db, runInTransaction } from '../db/database.js';
import { PaymentRecord, PaymentState } from '../../../shared/src/types.js';
import { sseService } from './sseService.js';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
  /**
   * Update payment status (e.g. simulated DBT bank webhook or manual operator reconcile)
   */
  public updatePaymentStatus(params: {
    payment_id: string;
    new_status: PaymentState;
    actor_name: string;
    failure_reason?: string;
  }) {
    return runInTransaction(() => {
      const payment = db.prepare(`
        SELECT pay.*, pr.booking_id, pr.receipt_ref, b.farmer_id, f.name as farmer_name, f.mobile as farmer_mobile, cd.centre_id
        FROM payment_records pay
        JOIN procurement_records pr ON pay.procurement_id = pr.id
        JOIN bookings b ON pr.booking_id = b.id
        JOIN farmer_profiles f ON b.farmer_id = f.id
        JOIN centre_days cd ON b.centre_day_id = cd.id
        WHERE pay.id = ?
      `).get(params.payment_id) as any;

      if (!payment) throw new Error('Payment record not found');

      const processedAt = params.new_status === 'PAID' ? "DATETIME('now')" : "NULL";

      db.prepare(`
        UPDATE payment_records
        SET status = ?,
            processed_at = CASE WHEN ? = 'PAID' THEN DATETIME('now') ELSE processed_at END,
            failure_reason = ?,
            last_updated_by = ?,
            updated_at = DATETIME('now')
        WHERE id = ?
      `).run(params.new_status, params.new_status, params.failure_reason || null, params.actor_name, params.payment_id);

      // Business audit event
      db.prepare(`
        INSERT INTO business_events (id, event_type, entity_type, entity_id, actor_name, actor_role, summary)
        VALUES (?, 'PAYMENT_STATUS_UPDATED', 'PAYMENT', ?, ?, 'OPERATOR', ?)
      `).run(
        `evt-${uuidv4().slice(0, 8)}`,
        params.payment_id,
        params.actor_name,
        `Payment ${payment.payment_ref_masked} updated to ${params.new_status}. Amount: ₹${payment.amount}`
      );

      // Notification to farmer
      let notifTitle = 'Payment Status Update';
      let notifMsg = `ProcureFlow DBT Update: Payment for Receipt ${payment.receipt_ref} status is now ${params.new_status}.`;

      if (params.new_status === 'PAID') {
        notifTitle = 'Payment Credited! 💰';
        notifMsg = `ProcureFlow: ₹${payment.amount.toLocaleString('en-IN')} has been CREDITED to your ${payment.bank_name} (${payment.account_masked}) via PFMS DBT. Ref: ${payment.payment_ref_masked}.`;
      } else if (params.new_status === 'FAILED') {
        notifTitle = 'Payment Action Required ⚠️';
        notifMsg = `ProcureFlow Alert: Payout for Receipt ${payment.receipt_ref} failed due to bank KYC/NPCI mismatch. Please contact centre operator.`;
      }

      db.prepare(`
        INSERT INTO notification_jobs (id, farmer_id, recipient_mobile, channel, title, message, status, sent_at)
        VALUES (?, ?, ?, 'SMS', ?, ?, 'DELIVERED', DATETIME('now'))
      `).run(
        `notif-${uuidv4().slice(0, 8)}`,
        payment.farmer_id,
        payment.farmer_mobile,
        notifTitle,
        notifMsg
      );

      const updatedPayment = (db.prepare(`SELECT * FROM payment_records WHERE id = ?`).get(params.payment_id) as unknown) as PaymentRecord;

      sseService.broadcast(`booking:${payment.booking_id}`, 'payment_updated', { payment: updatedPayment });
      sseService.broadcast('global', 'payment_status_changed', { payment: updatedPayment });

      return updatedPayment;
    });
  }

  /**
   * Get payments for farmer
   */
  public getFarmerPayments(farmerId: string) {
    return db.prepare(`
      SELECT pay.*, pr.receipt_ref, pr.final_payable_quantity, pr.net_amount, pr.recorded_at,
             comm.name as commodity_name, c.name as centre_name, b.token_no
      FROM payment_records pay
      JOIN procurement_records pr ON pay.procurement_id = pr.id
      JOIN bookings b ON pr.booking_id = b.id
      JOIN commodities comm ON pr.commodity_id = comm.id
      JOIN centre_days cd ON b.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      WHERE b.farmer_id = ?
      ORDER BY pay.updated_at DESC
    `).all(farmerId);
  }
}

export const paymentService = new PaymentService();
