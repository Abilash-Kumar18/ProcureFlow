import { Router } from 'express';
import { bookingService } from '../services/bookingService.js';
import { db } from '../db/database.js';

export const centreRouter = Router();

// Search centres
centreRouter.get('/', (req, res) => {
  try {
    const districtId = (req.query.district_id as string) || 'dist-thanjavur';
    const commodityId = req.query.commodity_id as string;
    const date = req.query.date as string;

    const centres = bookingService.searchCentres(districtId, commodityId, date);
    res.json({ data: centres });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get centre details with operational days
centreRouter.get('/:id', (req, res) => {
  try {
    const centre = db.prepare(`SELECT * FROM centres WHERE id = ?`).get(req.params.id) as any;
    if (!centre) return res.status(404).json({ error: 'Centre not found' });

    const centreDays = db.prepare(`
      SELECT cd.*, comm.name as commodity_name, comm.msp_rate
      FROM centre_days cd
      JOIN commodities comm ON cd.commodity_id = comm.id
      WHERE cd.centre_id = ?
      ORDER BY cd.service_date ASC
    `).all(centre.id);

    res.json({ data: { ...centre, centre_days: centreDays } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get slot windows availability for a centre-day
centreRouter.get('/centre-days/:id/availability', (req, res) => {
  try {
    const availability = bookingService.getCentreDayAvailability(req.params.id);
    res.json({ data: availability });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});
