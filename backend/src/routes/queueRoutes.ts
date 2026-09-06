import { Router } from 'express';
import { queueService } from '../services/queueService.js';
import { db } from '../db/database.js';

export const queueRouter = Router();

// Farmer Check-in
queueRouter.post('/:bookingId/check-in', (req, res) => {
  try {
    const { arrival_method } = req.body;
    const result = queueService.checkIn(req.params.bookingId, arrival_method || 'SELF_APP');
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Farmer Queue status
queueRouter.get('/status/:bookingId', (req, res) => {
  try {
    const queueEntry = db.prepare(`
      SELECT q.*, b.booking_ref, b.token_no, b.expected_qty,
             f.name as farmer_name, f.mobile as farmer_mobile,
             c.name as centre_name, c.status as centre_status,
             sc.counter_code as assigned_counter_code
      FROM queue_entries q
      JOIN bookings b ON q.booking_id = b.id
      JOIN farmer_profiles f ON b.farmer_id = f.id
      JOIN centre_days cd ON q.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      LEFT JOIN service_counters sc ON q.assigned_counter_id = sc.id
      WHERE q.booking_id = ?
    `).get(req.params.bookingId);

    if (!queueEntry) return res.status(404).json({ error: 'Queue entry not found' });
    res.json({ data: queueEntry });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Operator live queue view
queueRouter.get('/centre-days/:centreDayId', (req, res) => {
  try {
    const liveQueue = queueService.getOperatorLiveQueue(req.params.centreDayId);
    res.json({ data: liveQueue });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Operator action: Call next token
queueRouter.post('/call-next', (req, res) => {
  try {
    const { centre_day_id, counter_id, operator_name } = req.body;
    if (!centre_day_id || !counter_id) {
      return res.status(400).json({ error: 'centre_day_id and counter_id are required' });
    }

    const called = queueService.callNextToken(centre_day_id, counter_id, operator_name || 'Operator');
    res.json({ data: called, message: `Token ${called.token_no} called to counter!` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Operator action: Start service
queueRouter.post('/start-service', (req, res) => {
  try {
    const { queue_entry_id, counter_id, operator_name } = req.body;
    const entry = queueService.startService(queue_entry_id, counter_id, operator_name || 'Operator');
    res.json({ data: entry, message: 'Service started at counter' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Operator action: Skip / Mark No-Show
queueRouter.post('/skip', (req, res) => {
  try {
    const { queue_entry_id, reason, operator_name } = req.body;
    const result = queueService.markNoShow(queue_entry_id, reason, operator_name || 'Operator');
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Operator action: Defer token
queueRouter.post('/defer', (req, res) => {
  try {
    const { queue_entry_id, reason, operator_name } = req.body;
    const result = queueService.deferToken(queue_entry_id, reason, operator_name || 'Operator');
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Centre metrics
queueRouter.get('/metrics/:centreId', (req, res) => {
  try {
    const metrics = queueService.getCentreMetrics(req.params.centreId);
    res.json({ data: metrics });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
