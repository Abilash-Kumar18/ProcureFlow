import { db, runInTransaction } from '../db/database.js';
import { Booking, SlotWindow, Centre } from '../../../shared/src/types.js';
import { sseService } from './sseService.js';
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
  /**
   * Search available centres with remaining capacity and alternative suggestions
   */
  public searchCentres(districtId: string, commodityId?: string, date?: string) {
    const centres = (db.prepare(`
      SELECT c.*, d.name as district_name
      FROM centres c
      JOIN districts d ON c.district_id = d.id
      WHERE c.district_id = ? AND c.status != 'CLOSED'
    `).all(districtId) as unknown) as (Centre & { district_name: string })[];

    const result = centres.map(centre => {
      // Get today or requested date's capacity
      const centreDay = db.prepare(`
        SELECT * FROM centre_days
        WHERE centre_id = ? AND (service_date = ? OR ? IS NULL)
        ORDER BY service_date ASC
        LIMIT 1
      `).get(centre.id, date || null, date || null) as any;

      return {
        ...centre,
        centre_day: centreDay || null,
        is_congested: centre.status === 'CONGESTED' || (centreDay && (centreDay.booked_qty / centreDay.planned_capacity_qty >= 0.85))
      };
    });

    return result;
  }

  /**
   * Get availability for a specific centre-day
   */
  public getCentreDayAvailability(centreDayId: string) {
    const centreDay = db.prepare(`
      SELECT cd.*, c.name as centre_name, c.address, comm.name as commodity_name, comm.msp_rate
      FROM centre_days cd
      JOIN centres c ON cd.centre_id = c.id
      JOIN commodities comm ON cd.commodity_id = comm.id
      WHERE cd.id = ?
    `).get(centreDayId) as any;

    if (!centreDay) {
      throw new Error('Centre-day not found');
    }

    const slotWindows = (db.prepare(`
      SELECT * FROM slot_windows
      WHERE centre_day_id = ?
      ORDER BY start_time ASC
    `).all(centreDayId) as unknown) as SlotWindow[];

    return {
      centre_day: centreDay,
      slot_windows: slotWindows
    };
  }

  /**
   * Atomic slot booking with transaction, duplicate prevention, and token allocation
   */
  public createBooking(params: {
    farmer_id: string;
    centre_day_id: string;
    slot_window_id: string;
    commodity_id: string;
    expected_qty: number;
    idempotency_key: string;
  }): { booking: Booking; token_no: string; alternatives?: any[] } {
    return runInTransaction(() => {
      // 1. Idempotency Check
      const existingBooking = db.prepare(`
        SELECT * FROM bookings WHERE idempotency_key = ?
      `).get(params.idempotency_key) as Booking | undefined;

      if (existingBooking) {
        return { booking: existingBooking, token_no: existingBooking.token_no };
      }

      // 2. Prevent duplicate active booking for the same farmer & centre-day
      const duplicateBooking = db.prepare(`
        SELECT * FROM bookings
        WHERE farmer_id = ? AND centre_day_id = ? AND status = 'CONFIRMED'
      `).get(params.farmer_id, params.centre_day_id) as Booking | undefined;

      if (duplicateBooking) {
        throw new Error('You already have an active confirmed booking for this centre and date.');
      }

      // 3. Verify farmer profile
      const farmer = db.prepare(`
        SELECT * FROM farmer_profiles WHERE id = ?
      `).get(params.farmer_id) as any;

      if (!farmer) {
        throw new Error('Farmer profile not found.');
      }

      // 4. Verify slot capacity
      const slot = db.prepare(`
        SELECT * FROM slot_windows WHERE id = ?
      `).get(params.slot_window_id) as SlotWindow | undefined;

      if (!slot) {
        throw new Error('Slot window not found.');
      }

      const projectedQty = slot.booked_qty + params.expected_qty;
      const projectedCount = slot.booked_farmer_count + 1;

      if (projectedQty > slot.capacity_qty || projectedCount > slot.capacity_farmer_count) {
        // Slot is full! Find alternative slot windows in the same or nearby centres
        const alternatives = db.prepare(`
          SELECT sw.*, cd.service_date, c.name as centre_name
          FROM slot_windows sw
          JOIN centre_days cd ON sw.centre_day_id = cd.id
          JOIN centres c ON cd.centre_id = c.id
          WHERE sw.status = 'AVAILABLE' AND (sw.capacity_qty - sw.booked_qty) >= ?
          ORDER BY cd.service_date ASC, sw.start_time ASC
          LIMIT 3
        `).all(params.expected_qty);

        const err: any = new Error('Selected time window has reached full capacity.');
        err.statusCode = 409;
        err.alternatives = alternatives;
        throw err;
      }

      // 5. Allocate Sequential Token for the centre-day
      const tokenCountResult = db.prepare(`
        SELECT COUNT(*) as count FROM bookings WHERE centre_day_id = ?
      `).get(params.centre_day_id) as { count: number };

      const nextTokenNum = tokenCountResult.count + 1;
      const token_no = `TK-${String(nextTokenNum).padStart(3, '0')}`;
      const bookingId = `bk-${uuidv4().slice(0, 8)}`;
      const bookingRef = `BK-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

      // 6. Insert Booking Record
      db.prepare(`
        INSERT INTO bookings (
          id, booking_ref, farmer_id, centre_day_id, slot_window_id,
          commodity_id, expected_qty, token_no, status, idempotency_key
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
      `).run(
        bookingId,
        bookingRef,
        params.farmer_id,
        params.centre_day_id,
        params.slot_window_id,
        params.commodity_id,
        params.expected_qty,
        token_no,
        params.idempotency_key
      );

      // 7. Update Slot Capacity
      const newStatus = projectedCount >= slot.capacity_farmer_count || projectedQty >= slot.capacity_qty
        ? 'FULL'
        : (projectedQty / slot.capacity_qty >= 0.75 ? 'ALMOST_FULL' : 'AVAILABLE');

      db.prepare(`
        UPDATE slot_windows
        SET booked_qty = booked_qty + ?, booked_farmer_count = booked_farmer_count + 1, status = ?
        WHERE id = ?
      `).run(params.expected_qty, newStatus, params.slot_window_id);

      // Update Centre Day booked total
      db.prepare(`
        UPDATE centre_days
        SET booked_qty = booked_qty + ?, booked_farmer_count = booked_farmer_count + 1
        WHERE id = ?
      `).run(params.expected_qty, params.centre_day_id);

      // 8. Create Initial Queue Entry in BOOKED state
      const queueId = `q-${uuidv4().slice(0, 8)}`;
      db.prepare(`
        INSERT INTO queue_entries (
          id, booking_id, centre_day_id, priority_class, position_snapshot,
          people_ahead, eta_minutes, state
        ) VALUES (?, ?, ?, 'GENERAL', ?, ?, ?, 'BOOKED')
      `).run(queueId, bookingId, params.centre_day_id, nextTokenNum, 0, 0);

      // 9. Create Notification
      db.prepare(`
        INSERT INTO notification_jobs (
          id, farmer_id, recipient_mobile, channel, title, message, status, sent_at
        ) VALUES (?, ?, ?, 'SMS', 'Booking Confirmed', ?, 'DELIVERED', DATETIME('now'))
      `).run(
        `notif-${uuidv4().slice(0, 8)}`,
        params.farmer_id,
        farmer.mobile,
        `ProcureFlow: Confirmed! Token: ${token_no}, Ref: ${bookingRef}. Slot: ${slot.start_time}-${slot.end_time}. Please arrive 15m early.`
      );

      // 10. Record Business Event in Audit
      db.prepare(`
        INSERT INTO business_events (
          id, event_type, entity_type, entity_id, actor_name, actor_role, centre_id, summary
        ) VALUES (?, 'BOOKING_CREATED', 'BOOKING', ?, ?, 'FARMER', ?, ?)
      `).run(
        `evt-${uuidv4().slice(0, 8)}`,
        bookingId,
        farmer.name,
        params.centre_day_id,
        `Farmer ${farmer.name} booked ${params.expected_qty} Qtl. Token ${token_no} allocated.`
      );

      const createdBooking = (db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(bookingId) as unknown) as Booking;

      // Broadcast update to operator channel
      sseService.broadcast(`centre:${params.centre_day_id}`, 'booking_created', {
        booking: createdBooking,
        token_no
      });

      return { booking: createdBooking, token_no };
    });
  }

  /**
   * Cancel booking and release slot capacity
   */
  public cancelBooking(bookingId: string, reason: string, actorName: string) {
    return runInTransaction(() => {
      const booking = db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(bookingId) as Booking | undefined;
      if (!booking) throw new Error('Booking not found');
      if (booking.status !== 'CONFIRMED') throw new Error(`Cannot cancel booking in ${booking.status} status.`);

      db.prepare(`UPDATE bookings SET status = 'CANCELLED', updated_at = DATETIME('now') WHERE id = ?`).run(bookingId);
      db.prepare(`UPDATE queue_entries SET state = 'CANCELLED', action_reason = ? WHERE booking_id = ?`).run(reason, bookingId);

      // Release slot capacity
      db.prepare(`
        UPDATE slot_windows
        SET booked_qty = MAX(0, booked_qty - ?), booked_farmer_count = MAX(0, booked_farmer_count - 1), status = 'AVAILABLE'
        WHERE id = ?
      `).run(booking.expected_qty, booking.slot_window_id);

      db.prepare(`
        UPDATE centre_days
        SET booked_qty = MAX(0, booked_qty - ?), booked_farmer_count = MAX(0, booked_farmer_count - 1)
        WHERE id = ?
      `).run(booking.expected_qty, booking.centre_day_id);

      db.prepare(`
        INSERT INTO business_events (id, event_type, entity_type, entity_id, actor_name, actor_role, summary)
        VALUES (?, 'BOOKING_CANCELLED', 'BOOKING', ?, ?, 'FARMER', ?)
      `).run(`evt-${uuidv4().slice(0, 8)}`, bookingId, actorName, `Booking ${booking.booking_ref} cancelled. Reason: ${reason}`);

      sseService.broadcast(`centre:${booking.centre_day_id}`, 'booking_cancelled', { bookingId });
      return { success: true, message: 'Booking cancelled and capacity released.' };
    });
  }

  /**
   * List bookings for a farmer or centre-day
   */
  public getFarmerBookings(farmerId: string) {
    return db.prepare(`
      SELECT b.*, c.name as centre_name, c.address as centre_address,
             cd.service_date, sw.start_time as slot_start_time, sw.end_time as slot_end_time,
             comm.name as commodity_name, comm.msp_rate,
             q.id as queue_id, q.state as queue_state, q.people_ahead, q.eta_minutes, q.assigned_counter_id,
             p.id as procurement_id, p.receipt_ref, p.net_amount, p.outcome as procurement_outcome,
             pay.status as payment_status
      FROM bookings b
      JOIN centre_days cd ON b.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      JOIN commodities comm ON b.commodity_id = comm.id
      JOIN slot_windows sw ON b.slot_window_id = sw.id
      LEFT JOIN queue_entries q ON b.id = q.booking_id
      LEFT JOIN procurement_records p ON b.id = p.booking_id
      LEFT JOIN payment_records pay ON p.id = pay.procurement_id
      WHERE b.farmer_id = ?
      ORDER BY b.created_at DESC
    `).all(farmerId);
  }
}

export const bookingService = new BookingService();
