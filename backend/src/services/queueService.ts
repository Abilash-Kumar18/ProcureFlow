import { db, runInTransaction } from '../db/database.js';
import { QueueEntry, QueueState, CentreMetrics } from '../../../shared/src/types.js';
import { sseService } from './sseService.js';
import { v4 as uuidv4 } from 'uuid';

export class QueueService {
  /**
   * Farmer Check-in at the centre
   */
  public checkIn(bookingId: string, arrivalMethod: string = 'SELF_APP') {
    return runInTransaction(() => {
      const booking = db.prepare(`
        SELECT b.*, f.name as farmer_name, f.mobile as farmer_mobile, c.name as centre_name
        FROM bookings b
        JOIN farmer_profiles f ON b.farmer_id = f.id
        JOIN centre_days cd ON b.centre_day_id = cd.id
        JOIN centres c ON cd.centre_id = c.id
        WHERE b.id = ?
      `).get(bookingId) as any;

      if (!booking) throw new Error('Booking not found');
      if (booking.status !== 'CONFIRMED') throw new Error(`Cannot check in booking in ${booking.status} status.`);

      const queueEntry = db.prepare(`
        SELECT * FROM queue_entries WHERE booking_id = ?
      `).get(bookingId) as QueueEntry | undefined;

      if (!queueEntry) throw new Error('Queue entry not found');
      if (queueEntry.state !== 'BOOKED' && queueEntry.state !== 'REMINDER_SENT') {
        return { success: true, message: 'Already checked in', queue_entry: queueEntry };
      }

      // Count currently waiting or checked-in farmers ahead in this centre-day
      const aheadCountResult = db.prepare(`
        SELECT COUNT(*) as count FROM queue_entries
        WHERE centre_day_id = ? AND state IN ('CHECKED_IN', 'WAITING', 'CALLED', 'IN_SERVICE')
      `).get(booking.centre_day_id) as { count: number };

      const peopleAhead = aheadCountResult.count;
      const etaMinutes = Math.max(10, peopleAhead * 12); // ~12 mins average per load

      // Transition queue state to CHECKED_IN
      db.prepare(`
        UPDATE queue_entries
        SET state = 'WAITING', checked_in_at = DATETIME('now'), people_ahead = ?, eta_minutes = ?, updated_at = DATETIME('now')
        WHERE id = ?
      `).run(peopleAhead, etaMinutes, queueEntry.id);

      // Increment arrived count on centre_day
      db.prepare(`
        UPDATE centre_days
        SET arrived_farmer_count = arrived_farmer_count + 1
        WHERE id = ?
      `).run(booking.centre_day_id);

      // Log business event
      db.prepare(`
        INSERT INTO business_events (id, event_type, entity_type, entity_id, actor_name, actor_role, centre_id, summary)
        VALUES (?, 'FARMER_CHECKIN', 'QUEUE', ?, ?, 'FARMER', ?, ?)
      `).run(
        `evt-${uuidv4().slice(0, 8)}`,
        queueEntry.id,
        booking.farmer_name,
        booking.centre_day_id,
        `Token ${booking.token_no} checked in via ${arrivalMethod}. Assigned ${peopleAhead} ahead, ETA ~${etaMinutes} mins.`
      );

      // Notification
      db.prepare(`
        INSERT INTO notification_jobs (id, farmer_id, recipient_mobile, channel, title, message, status, sent_at)
        VALUES (?, ?, ?, 'PUSH', 'Checked In Successfully', ?, 'DELIVERED', DATETIME('now'))
      `).run(
        `notif-${uuidv4().slice(0, 8)}`,
        booking.farmer_id,
        booking.farmer_mobile,
        `Check-in verified! Token: ${booking.token_no}. Farmers ahead: ${peopleAhead}. Please be near the weighing bay.`
      );

      const updatedEntry = db.prepare(`SELECT * FROM queue_entries WHERE id = ?`).get(queueEntry.id) as QueueEntry;

      // Broadcast to both centre operator and farmer's private stream
      sseService.broadcast(`centre:${booking.centre_day_id}`, 'queue_updated', { queue_entry: updatedEntry });
      sseService.broadcast(`booking:${bookingId}`, 'queue_state_changed', { queue_entry: updatedEntry });

      return {
        success: true,
        message: 'Checked in successfully',
        queue_entry: {
          ...updatedEntry,
          token_no: booking.token_no,
          farmer_name: booking.farmer_name
        }
      };
    });
  }

  /**
   * Operator calls next waiting token to a counter
   */
  public callNextToken(centreDayId: string, counterId: string, operatorName: string) {
    return runInTransaction(() => {
      // Find counter
      const counter = db.prepare(`SELECT * FROM service_counters WHERE id = ?`).get(counterId) as any;
      if (!counter) throw new Error('Counter not found');

      // Find next waiting queue entry (FIFO, prioritizing priority classes if any)
      const nextEntry = db.prepare(`
        SELECT q.*, b.token_no, b.farmer_id, f.name as farmer_name, f.mobile as farmer_mobile, b.expected_qty
        FROM queue_entries q
        JOIN bookings b ON q.booking_id = b.id
        JOIN farmer_profiles f ON b.farmer_id = f.id
        WHERE q.centre_day_id = ? AND q.state IN ('WAITING', 'CHECKED_IN')
        ORDER BY
          CASE q.priority_class
            WHEN 'SPECIAL_ASSISTANCE' THEN 1
            WHEN 'ELDERLY' THEN 2
            WHEN 'WOMAN_FARMER' THEN 3
            ELSE 4
          END ASC,
          q.position_snapshot ASC
        LIMIT 1
      `).get(centreDayId) as any;

      if (!nextEntry) {
        throw new Error('No waiting farmers in queue for this centre-day.');
      }

      // Update queue entry state to CALLED
      db.prepare(`
        UPDATE queue_entries
        SET state = 'CALLED', assigned_counter_id = ?, called_at = DATETIME('now'), people_ahead = 0, eta_minutes = 0, updated_at = DATETIME('now')
        WHERE id = ?
      `).run(counterId, nextEntry.id);

      // Link counter to this entry
      db.prepare(`
        UPDATE service_counters
        SET current_queue_entry_id = ?
        WHERE id = ?
      `).run(nextEntry.id, counterId);

      // Recalculate remaining people_ahead for waiting entries
      this.recalculateQueuePositions(centreDayId);

      // Audit log
      db.prepare(`
        INSERT INTO business_events (id, event_type, entity_type, entity_id, actor_name, actor_role, summary)
        VALUES (?, 'TOKEN_CALLED', 'QUEUE', ?, ?, 'OPERATOR', ?)
      `).run(
        `evt-${uuidv4().slice(0, 8)}`,
        nextEntry.id,
        operatorName,
        `Token ${nextEntry.token_no} (${nextEntry.farmer_name}) called to ${counter.counter_code}`
      );

      // High priority alert notification for farmer
      db.prepare(`
        INSERT INTO notification_jobs (id, farmer_id, recipient_mobile, channel, title, message, status, sent_at)
        VALUES (?, ?, ?, 'SMS', 'Token Called!', ?, 'DELIVERED', DATETIME('now'))
      `).run(
        `notif-${uuidv4().slice(0, 8)}`,
        nextEntry.farmer_id,
        nextEntry.farmer_mobile,
        `🚨 ProcureFlow Alert: Token ${nextEntry.token_no} is CALLED now to ${counter.counter_code}! Please proceed immediately.`
      );

      const calledEntry = {
        ...nextEntry,
        state: 'CALLED',
        assigned_counter_id: counterId,
        assigned_counter_code: counter.counter_code
      };

      // Realtime push
      sseService.broadcast(`centre:${centreDayId}`, 'token_called', { entry: calledEntry, counter });
      sseService.broadcast(`booking:${nextEntry.booking_id}`, 'token_called', { entry: calledEntry, counter });

      return calledEntry;
    });
  }

  /**
   * Operator starts weighing / service
   */
  public startService(queueEntryId: string, counterId: string, operatorName: string) {
    return runInTransaction(() => {
      db.prepare(`
        UPDATE queue_entries
        SET state = 'IN_SERVICE', service_started_at = DATETIME('now'), updated_at = DATETIME('now')
        WHERE id = ?
      `).run(queueEntryId);

      const entry = db.prepare(`SELECT * FROM queue_entries WHERE id = ?`).get(queueEntryId) as QueueEntry;

      sseService.broadcast(`centre:${entry.centre_day_id}`, 'service_started', { queueEntryId });
      sseService.broadcast(`booking:${entry.booking_id}`, 'service_started', { queueEntryId });

      return entry;
    });
  }

  /**
   * Operator marks token as No-Show
   */
  public markNoShow(queueEntryId: string, reason: string = 'Farmer not present when called', operatorName: string) {
    return runInTransaction(() => {
      const entry = db.prepare(`
        SELECT q.*, b.token_no, b.centre_day_id, b.booking_id
        FROM queue_entries q
        JOIN bookings b ON q.booking_id = b.id
        WHERE q.id = ?
      `).get(queueEntryId) as any;

      if (!entry) throw new Error('Queue entry not found');

      db.prepare(`
        UPDATE queue_entries
        SET state = 'NO_SHOW', action_reason = ?, updated_at = DATETIME('now')
        WHERE id = ?
      `).run(reason, queueEntryId);

      db.prepare(`
        UPDATE bookings SET status = 'NO_SHOW', updated_at = DATETIME('now') WHERE id = ?
      `).run(entry.booking_id);

      // Clear counter if assigned
      db.prepare(`
        UPDATE service_counters SET current_queue_entry_id = NULL WHERE current_queue_entry_id = ?
      `).run(queueEntryId);

      this.recalculateQueuePositions(entry.centre_day_id);

      sseService.broadcast(`centre:${entry.centre_day_id}`, 'queue_updated', { queueEntryId, state: 'NO_SHOW' });
      return { success: true, message: 'Token marked as No-Show' };
    });
  }

  /**
   * Defer token (allows farmer to be recalled later without losing spot permanently)
   */
  public deferToken(queueEntryId: string, reason: string = 'Vehicle breakdown / brief delay', operatorName: string) {
    return runInTransaction(() => {
      const entry = db.prepare(`SELECT * FROM queue_entries WHERE id = ?`).get(queueEntryId) as any;
      if (!entry) throw new Error('Queue entry not found');

      db.prepare(`
        UPDATE queue_entries
        SET state = 'DEFERRED', action_reason = ?, updated_at = DATETIME('now')
        WHERE id = ?
      `).run(reason, queueEntryId);

      db.prepare(`
        UPDATE service_counters SET current_queue_entry_id = NULL WHERE current_queue_entry_id = ?
      `).run(queueEntryId);

      this.recalculateQueuePositions(entry.centre_day_id);
      sseService.broadcast(`centre:${entry.centre_day_id}`, 'queue_updated', { queueEntryId, state: 'DEFERRED' });
      return { success: true, message: 'Token deferred with audit reason' };
    });
  }

  /**
   * Helper to keep people_ahead accurate as queue moves
   */
  private recalculateQueuePositions(centreDayId: string) {
    const activeEntries = db.prepare(`
      SELECT id FROM queue_entries
      WHERE centre_day_id = ? AND state IN ('CHECKED_IN', 'WAITING')
      ORDER BY position_snapshot ASC
    `).all(centreDayId) as { id: string }[];

    activeEntries.forEach((e, idx) => {
      const eta = (idx + 1) * 12;
      db.prepare(`
        UPDATE queue_entries
        SET people_ahead = ?, eta_minutes = ?
        WHERE id = ?
      `).run(idx, eta, e.id);
    });
  }

  /**
   * Get full live queue console for operator
   */
  public getOperatorLiveQueue(centreDayId: string) {
    const queueList = db.prepare(`
      SELECT q.*, b.booking_ref, b.token_no, b.expected_qty,
             f.name as farmer_name, f.mobile as farmer_mobile, f.village,
             sc.counter_code as assigned_counter_code
      FROM queue_entries q
      JOIN bookings b ON q.booking_id = b.id
      JOIN farmer_profiles f ON b.farmer_id = f.id
      LEFT JOIN service_counters sc ON q.assigned_counter_id = sc.id
      WHERE q.centre_day_id = ?
      ORDER BY
        CASE q.state
          WHEN 'IN_SERVICE' THEN 1
          WHEN 'CALLED' THEN 2
          WHEN 'WAITING' THEN 3
          WHEN 'CHECKED_IN' THEN 4
          WHEN 'DEFERRED' THEN 5
          WHEN 'COMPLETED' THEN 6
          WHEN 'NO_SHOW' THEN 7
          ELSE 8
        END ASC,
        q.position_snapshot ASC
    `).all(centreDayId);

    const counters = db.prepare(`
      SELECT sc.*, q.id as queue_id, b.token_no as current_token_no, f.name as current_farmer_name
      FROM service_counters sc
      LEFT JOIN queue_entries q ON sc.current_queue_entry_id = q.id
      LEFT JOIN bookings b ON q.booking_id = b.id
      LEFT JOIN farmer_profiles f ON b.farmer_id = f.id
      WHERE sc.centre_id = (SELECT centre_id FROM centre_days WHERE id = ?)
    `).all(centreDayId);

    const centreDay = db.prepare(`
      SELECT cd.*, c.name as centre_name, comm.name as commodity_name
      FROM centre_days cd
      JOIN centres c ON cd.centre_id = c.id
      JOIN commodities comm ON cd.commodity_id = comm.id
      WHERE cd.id = ?
    `).get(centreDayId);

    return { centre_day: centreDay, queue: queueList, counters };
  }

  /**
   * Get metrics for centre/district dashboard
   */
  public getCentreMetrics(centreId: string): CentreMetrics {
    const centre = db.prepare(`SELECT * FROM centres WHERE id = ?`).get(centreId) as any;
    const stats = db.prepare(`
      SELECT
        COUNT(CASE WHEN q.state = 'WAITING' THEN 1 END) as waiting_count,
        COUNT(CASE WHEN q.state = 'COMPLETED' THEN 1 END) as served_count,
        COUNT(CASE WHEN q.state = 'NO_SHOW' THEN 1 END) as no_show_count,
        COUNT(CASE WHEN q.state IN ('WAITING', 'CALLED', 'IN_SERVICE', 'CHECKED_IN') THEN 1 END) as active_count,
        COALESCE(AVG(q.eta_minutes), 15) as avg_wait
      FROM queue_entries q
      JOIN centre_days cd ON q.centre_day_id = cd.id
      WHERE cd.centre_id = ?
    `).get(centreId) as any;

    const todayDay = db.prepare(`
      SELECT * FROM centre_days WHERE centre_id = ? ORDER BY service_date DESC LIMIT 1
    `).get(centreId) as any;

    const plannedCap = todayDay ? todayDay.planned_capacity_qty : 400;
    const bookedVol = todayDay ? todayDay.booked_qty : 200;
    const ratio = bookedVol / plannedCap;

    let congestion: 'LOW' | 'OPTIMAL' | 'CONGESTED' | 'CRITICAL' = 'OPTIMAL';
    if (ratio > 0.95 || stats.waiting_count > 10) congestion = 'CRITICAL';
    else if (ratio > 0.8 || stats.waiting_count > 5) congestion = 'CONGESTED';
    else if (ratio < 0.4) congestion = 'LOW';

    return {
      centre_id: centreId,
      centre_name: centre.name,
      planned_capacity: plannedCap,
      booked_volume: bookedVol,
      arrived_count: todayDay ? todayDay.arrived_farmer_count : 0,
      served_count: stats.served_count,
      waiting_count: stats.waiting_count,
      no_show_count: stats.no_show_count,
      average_wait_minutes: Math.round(stats.avg_wait),
      active_counters: centre.active_counters,
      congestion_level: congestion
    };
  }
}

export const queueService = new QueueService();
