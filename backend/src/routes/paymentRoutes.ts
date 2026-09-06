import { Router } from 'express';
import { paymentService } from '../services/paymentService.js';
import { db } from '../db/database.js';

export const paymentRouter = Router();

// Get farmer payments
paymentRouter.get('/farmer/:farmerId', (req, res) => {
  try {
    const payments = paymentService.getFarmerPayments(req.params.farmerId);
    res.json({ data: payments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment status (operator reconcile / PFMS DBT simulator)
paymentRouter.post('/:paymentId/status', (req, res) => {
  try {
    const { new_status, actor_name, failure_reason } = req.body;
    if (!new_status) return res.status(400).json({ error: 'new_status is required' });

    const updated = paymentService.updatePaymentStatus({
      payment_id: req.params.paymentId,
      new_status,
      actor_name: actor_name || 'Accounts Officer',
      failure_reason
    });

    res.json({ data: updated, message: `Payment updated to ${new_status}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// List all payments for operator / admin reconciliation
paymentRouter.get('/', (req, res) => {
  try {
    const payments = db.prepare(`
      SELECT pay.*, pr.receipt_ref, pr.final_payable_quantity, pr.net_amount,
             f.name as farmer_name, f.mobile as farmer_mobile,
             comm.name as commodity_name, c.name as centre_name, b.token_no
      FROM payment_records pay
      JOIN procurement_records pr ON pay.procurement_id = pr.id
      JOIN bookings b ON pr.booking_id = b.id
      JOIN farmer_profiles f ON b.farmer_id = f.id
      JOIN commodities comm ON pr.commodity_id = comm.id
      JOIN centre_days cd ON b.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      ORDER BY pay.updated_at DESC
      LIMIT 50
    `).all();

    res.json({ data: payments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
