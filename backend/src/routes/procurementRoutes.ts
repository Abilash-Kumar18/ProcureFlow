import { Router } from 'express';
import { procurementService } from '../services/procurementService.js';
import { db } from '../db/database.js';

export const procurementRouter = Router();

// Record procurement result
procurementRouter.post('/', (req, res) => {
  try {
    const {
      booking_id,
      gross_weight_quintals,
      tare_weight_quintals,
      moisture_percentage,
      quality_grade,
      outcome,
      outcome_reason,
      recorded_by
    } = req.body;

    if (!booking_id || gross_weight_quintals == null || tare_weight_quintals == null) {
      return res.status(400).json({ error: 'Missing required measurement fields' });
    }

    const result = procurementService.recordProcurement({
      booking_id,
      gross_weight_quintals: Number(gross_weight_quintals),
      tare_weight_quintals: Number(tare_weight_quintals),
      moisture_percentage: Number(moisture_percentage || 13.5),
      quality_grade: quality_grade || 'GRADE_A',
      outcome: outcome || 'ACCEPTED',
      outcome_reason,
      recorded_by: recorded_by || 'Procurement Officer'
    });

    res.status(201).json({ data: result, message: 'Procurement recorded successfully!' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get digital receipt
procurementRouter.get('/receipt/:receiptRef', (req, res) => {
  try {
    const receipt = procurementService.getProcurementReceipt(req.params.receiptRef);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json({ data: receipt });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// List recent procurements for centre or admin
procurementRouter.get('/', (req, res) => {
  try {
    const records = db.prepare(`
      SELECT p.*, b.booking_ref, b.token_no, f.name as farmer_name, comm.name as commodity_name, c.name as centre_name
      FROM procurement_records p
      JOIN bookings b ON p.booking_id = b.id
      JOIN farmer_profiles f ON b.farmer_id = f.id
      JOIN centre_days cd ON b.centre_day_id = cd.id
      JOIN centres c ON cd.centre_id = c.id
      JOIN commodities comm ON p.commodity_id = comm.id
      ORDER BY p.recorded_at DESC
      LIMIT 50
    `).all();

    res.json({ data: records });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
