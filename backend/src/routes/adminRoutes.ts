import { Router } from 'express';
import { db } from '../db/database.js';
import { queueService } from '../services/queueService.js';
import { seedData } from '../db/seed.js';

export const adminRouter = Router();

// District-wide congestion heatmap & overview
adminRouter.get('/dashboard', (req, res) => {
  try {
    const centres = db.prepare(`SELECT * FROM centres WHERE active_counters > 0`).all() as any[];

    const centreMetrics = centres.map(c => queueService.getCentreMetrics(c.id));

    const totalPlannedCap = centreMetrics.reduce((sum, c) => sum + c.planned_capacity, 0);
    const totalBookedVol = centreMetrics.reduce((sum, c) => sum + c.booked_volume, 0);
    const totalServed = centreMetrics.reduce((sum, c) => sum + c.served_count, 0);
    const totalWaiting = centreMetrics.reduce((sum, c) => sum + c.waiting_count, 0);

    const commodities = db.prepare(`SELECT * FROM commodities`).all();
    const seasons = db.prepare(`SELECT * FROM procurement_seasons`).all();

    res.json({
      data: {
        summary: {
          total_centres: centres.length,
          total_planned_capacity: totalPlannedCap,
          total_booked_volume: totalBookedVol,
          total_served: totalServed,
          total_waiting: totalWaiting,
          congestion_distribution: {
            low: centreMetrics.filter(c => c.congestion_level === 'LOW').length,
            optimal: centreMetrics.filter(c => c.congestion_level === 'OPTIMAL').length,
            congested: centreMetrics.filter(c => c.congestion_level === 'CONGESTED').length,
            critical: centreMetrics.filter(c => c.congestion_level === 'CRITICAL').length
          }
        },
        centre_metrics: centreMetrics,
        commodities,
        seasons
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Log Explorer
adminRouter.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT be.*, c.name as centre_name
      FROM business_events be
      LEFT JOIN centres c ON be.centre_id = c.id
      ORDER BY be.occurred_at DESC
      LIMIT 100
    `).all();

    res.json({ data: logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export CSV report of daily procurement
adminRouter.get('/export-procurements-csv', (req, res) => {
  try {
    const records = db.prepare(`
      SELECT p.receipt_ref, b.token_no, f.name as farmer_name, f.mobile, f.village,
             comm.name as commodity, p.gross_weight_quintals, p.tare_weight_quintals,
             p.final_payable_quantity, p.rate_per_quintal, p.net_amount, p.quality_grade,
             p.outcome, pay.status as payment_status, p.recorded_at
      FROM procurement_records p
      JOIN bookings b ON p.booking_id = b.id
      JOIN farmer_profiles f ON b.farmer_id = f.id
      JOIN commodities comm ON p.commodity_id = comm.id
      LEFT JOIN payment_records pay ON p.id = pay.procurement_id
      ORDER BY p.recorded_at DESC
    `).all() as any[];

    const headers = [
      'Receipt Ref', 'Token', 'Farmer Name', 'Mobile', 'Village',
      'Commodity', 'Gross (Qtl)', 'Tare (Qtl)', 'Net (Qtl)', 'MSP Rate',
      'Payable (INR)', 'Grade', 'Outcome', 'Payment Status', 'Timestamp'
    ];

    const csvRows = [
      headers.join(','),
      ...records.map(r => [
        r.receipt_ref,
        r.token_no,
        `"${r.farmer_name}"`,
        r.mobile,
        `"${r.village}"`,
        `"${r.commodity}"`,
        r.gross_weight_quintals,
        r.tare_weight_quintals,
        r.final_payable_quantity,
        r.rate_per_quintal,
        r.net_amount,
        r.quality_grade,
        r.outcome,
        r.payment_status || 'INITIATED',
        `"${r.recorded_at}"`
      ].join(','))
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="procureflow-report.csv"');
    res.send(csvRows.join('\n'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 1-Click Demo Reset to pristine seed dataset
adminRouter.post('/reset-demo-data', (req, res) => {
  try {
    seedData();
    res.json({ message: 'ProcureFlow demo database reset to pristine state successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
