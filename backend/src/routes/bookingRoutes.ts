import { Router } from 'express';
import { bookingService } from '../services/bookingService.js';
import { db } from '../db/database.js';

export const bookingRouter = Router();

// Create booking / allocate virtual token
bookingRouter.post('/', (req, res) => {
  try {
    const { farmer_id, centre_day_id, slot_window_id, commodity_id, expected_qty, idempotency_key } = req.body;

    if (!farmer_id || !centre_day_id || !slot_window_id || !expected_qty) {
      return res.status(400).json({ error: 'Missing required booking parameters' });
    }

    const key = idempotency_key || req.headers['idempotency-key'] || `idem-${Date.now()}-${Math.random()}`;

    const result = bookingService.createBooking({
      farmer_id,
      centre_day_id,
      slot_window_id,
      commodity_id: commodity_id || 'comm-paddy-a',
      expected_qty: Number(expected_qty),
      idempotency_key: String(key)
    });

    res.status(201).json({ data: result, message: 'Slot booked successfully!' });
  } catch (err: any) {
    if (err.statusCode === 409) {
      return res.status(409).json({
        error: err.message,
        alternatives: err.alternatives
      });
    }
    res.status(400).json({ error: err.message });
  }
});

// Get farmer bookings
bookingRouter.get('/farmer/:farmerId', (req, res) => {
  try {
    const bookings = bookingService.getFarmerBookings(req.params.farmerId);
    res.json({ data: bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel booking
bookingRouter.post('/:id/cancel', (req, res) => {
  try {
    const { reason, actor_name } = req.body;
    const result = bookingService.cancelBooking(req.params.id, reason || 'Cancelled by farmer', actor_name || 'Farmer');
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get single booking timeline details
bookingRouter.get('/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT b.*,
             f.name as farmer_name, f.mobile as farmer_mobile, f.village, f.masked_payment_ref, f.bank_name,
             c.name as centre_name, c.address as centre_address, c.code as centre_code, c.contact_number as centre_contact,
             cd.service_date, sw.start_time as slot_start_time, sw.end_time as slot_end_time,
             comm.name as commodity_name, comm.msp_rate,
             q.id as queue_id, q.state as queue_state, q.people_ahead, q.eta_minutes, q.assigned_counter_id,
             p.id as procurement_id, p.receipt_ref, p.final_payable_quantity, p.rate_per_quintal, p.net_amount, p.outcome as procurement_outcome,
             pay.id as payment_id, pay.status as payment_status, pay.payment_ref_masked, pay.expected_at as payment_expected_at, pay.processed_at as payment_processed_at
      FROM bookings b
      JOIN farmer_profiles f ON b.farmer_id = f.id
      JOIN centre_days cd ON b.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      JOIN commodities comm ON b.commodity_id = comm.id
      JOIN slot_windows sw ON b.slot_window_id = sw.id
      LEFT JOIN queue_entries q ON b.id = q.booking_id
      LEFT JOIN procurement_records p ON b.id = p.booking_id
      LEFT JOIN payment_records pay ON p.id = pay.procurement_id
      WHERE b.id = ? OR b.booking_ref = ?
    `).get(req.params.id, req.params.id);

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ data: booking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
