import { Router } from 'express';
import { db } from '../db/database.js';

export const notificationRouter = Router();

// Get notification feed for a farmer
notificationRouter.get('/farmer/:farmerId', (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT * FROM notification_jobs
      WHERE farmer_id = ?
      ORDER BY created_at DESC
      LIMIT 30
    `).all(req.params.farmerId);

    res.json({ data: notifications });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin view of all outbox notifications
notificationRouter.get('/outbox', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT nj.*, f.name as farmer_name
      FROM notification_jobs nj
      JOIN farmer_profiles f ON nj.farmer_id = f.id
      ORDER BY nj.created_at DESC
      LIMIT 100
    `).all();

    res.json({ data: logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
