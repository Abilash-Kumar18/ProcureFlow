import { Router } from 'express';
import { db } from '../db/database.js';

export const authRouter = Router();

// Get list of demo personas for 1-click evaluation
authRouter.get('/personas', (req, res) => {
  const users = db.prepare(`
    SELECT u.*,
           fp.id as farmer_profile_id, fp.farmer_ref, fp.village, fp.preferred_language, fp.masked_payment_ref,
           c.name as centre_name
    FROM users u
    LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
    LEFT JOIN centres c ON u.centre_id = c.id
    ORDER BY
      CASE u.role
        WHEN 'FARMER' THEN 1
        WHEN 'OPERATOR' THEN 2
        WHEN 'DISTRICT_ADMIN' THEN 3
        ELSE 4
      END
  `).all();

  res.json({ data: users });
});

// Demo switch login by user id
authRouter.post('/login', (req, res) => {
  const { user_id } = req.body;
  const user = db.prepare(`
    SELECT u.*,
           fp.id as farmer_profile_id, fp.farmer_ref, fp.village, fp.preferred_language, fp.masked_payment_ref,
           c.name as centre_name
    FROM users u
    LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
    LEFT JOIN centres c ON u.centre_id = c.id
    WHERE u.id = ?
  `).get(user_id) as any;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    data: {
      user,
      token: `demo-token-${user.id}`
    }
  });
});

// Farmer assisted or self registration
authRouter.post('/register-farmer', (req, res) => {
  try {
    const { name, mobile, village, district_id, language, assisted_by } = req.body;

    if (!name || !mobile || !village) {
      return res.status(400).json({ error: 'Name, mobile, and village are required.' });
    }

    const userId = `u-${Date.now()}`;
    const profId = `prof-${Date.now()}`;
    const farmerRef = `FMR-TN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    db.prepare(`
      INSERT INTO users (id, role, name, mobile, status, district_id)
      VALUES (?, 'FARMER', ?, ?, 'ACTIVE', ?)
    `).run(userId, name, mobile, district_id || 'dist-thanjavur');

    db.prepare(`
      INSERT INTO farmer_profiles (
        id, user_id, farmer_ref, name, mobile, preferred_language, village, district_id,
        masked_aadhaar, masked_payment_ref, bank_name, verification_status, assisted_by_user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'XXXXXXXX1234', 'SBIN*****8821', 'State Bank of India', 'VERIFIED', ?)
    `).run(
      profId, userId, farmerRef, name, mobile, language || 'en', village, district_id || 'dist-thanjavur', assisted_by || null
    );

    // Grant season quota
    db.prepare(`
      INSERT INTO farmer_eligibilities (id, farmer_id, season_id, commodity_id, allocated_quota_quintals, status)
      VALUES (?, ?, 'season-kms-2026', 'comm-paddy-a', 80.0, 'ELIGIBLE')
    `).run(`el-${Date.now()}`, profId);

    const createdFarmer = db.prepare(`
      SELECT u.*, fp.id as farmer_profile_id, fp.farmer_ref, fp.village, fp.preferred_language
      FROM users u
      JOIN farmer_profiles fp ON u.id = fp.user_id
      WHERE u.id = ?
    `).get(userId);

    res.json({ data: createdFarmer, message: 'Farmer registered successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
