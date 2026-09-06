import { db, initDatabase, runInTransaction } from './database.js';

export function seedData() {
  console.log('🌱 Seeding ProcureFlow synthetic demonstration dataset...');
  initDatabase();

  runInTransaction(() => {
    // Clear existing data cleanly in reverse dependency order
    db.prepare('DELETE FROM business_events').run();
    db.prepare('DELETE FROM notification_jobs').run();
    db.prepare('DELETE FROM payment_records').run();
    db.prepare('DELETE FROM procurement_records').run();
    db.prepare('DELETE FROM service_counters').run();
    db.prepare('DELETE FROM queue_entries').run();
    db.prepare('DELETE FROM bookings').run();
    db.prepare('DELETE FROM slot_windows').run();
    db.prepare('DELETE FROM centre_days').run();
    db.prepare('DELETE FROM farmer_eligibilities').run();
    db.prepare('DELETE FROM commodities').run();
    db.prepare('DELETE FROM procurement_seasons').run();
    db.prepare('DELETE FROM centres').run();
    db.prepare('DELETE FROM districts').run();
    db.prepare('DELETE FROM farmer_profiles').run();
    db.prepare('DELETE FROM users').run();

    // 1. Districts
    const districtId = 'dist-thanjavur';
    db.prepare(`
      INSERT INTO districts (id, name, state_code, active)
      VALUES (?, ?, ?, 1)
    `).run(districtId, 'Thanjavur Agri District', 'TN');

    // 2. Commodities
    const commPaddyA = 'comm-paddy-a';
    const commWheat = 'comm-wheat';
    db.prepare(`
      INSERT INTO commodities (id, code, name, variety, unit, msp_rate, active) VALUES
      (?, 'PADDY_A', 'Paddy (Grade A)', 'BPT-5204 (Samba)', 'Quintal', 2320.0, 1),
      (?, 'WHEAT_COMM', 'Wheat', 'HD-2967', 'Quintal', 2275.0, 1)
    `).run(commPaddyA, commWheat);

    // 3. Procurement Seasons
    const seasonKharif = 'season-kms-2026';
    db.prepare(`
      INSERT INTO procurement_seasons (id, name, kms_year, season_type, start_date, end_date, status)
      VALUES (?, 'Kharif Marketing Season 2026', '2026-27', 'KHARIF', '2026-09-01', '2026-11-30', 'ACTIVE')
    `).run(seasonKharif);

    // 4. Procurement Centres
    const c1 = 'centre-pillaiyarpatti';
    const c2 = 'centre-vallam';
    const c3 = 'centre-budalur';
    const c4 = 'centre-thiruvaiyaru';

    db.prepare(`
      INSERT INTO centres (id, district_id, code, name, address, latitude, longitude, centre_type, opening_time, closing_time, status, active_counters, contact_number) VALUES
      (?, ?, 'PPC-01', 'Pillaiyarpatti Primary Procurement Centre', 'Main Road, Pillaiyarpatti, Thanjavur - 613403', 10.7482, 79.0821, 'PPC', '08:00', '18:00', 'OPEN', 3, '+91 4362 221001'),
      (?, ?, 'APMC-02', 'Vallam Regulated Mandi Complex', 'Trichy Road, Vallam, Thanjavur - 613405', 10.7167, 79.0500, 'APMC', '08:00', '18:00', 'CONGESTED', 2, '+91 4362 221002'),
      (?, ?, 'SOC-03', 'Budalur Primary Agri Co-op Society', 'Station Road, Budalur, Thanjavur - 613602', 10.7933, 78.9882, 'SOCIETY', '08:30', '17:30', 'OPEN', 2, '+91 4362 221003'),
      (?, ?, 'DEP-04', 'Thiruvaiyaru Direct Purchase Depot', 'Cauvery Bank Road, Thiruvaiyaru - 613204', 10.8800, 79.1000, 'DIRECT_DEPOT', '08:30', '17:30', 'OPEN', 2, '+91 4362 221004')
    `).run(
      c1, districtId,
      c2, districtId,
      c3, districtId,
      c4, districtId
    );

    // 5. Service Counters for Pillaiyarpatti & Vallam
    db.prepare(`
      INSERT INTO service_counters (id, centre_id, counter_code, counter_type, status, current_queue_entry_id, operator_name) VALUES
      ('cnt-c1-1', ?, 'Counter 1 (Weighbridge)', 'WEIGHING', 'ACTIVE', NULL, 'Suresh Patel'),
      ('cnt-c1-2', ?, 'Counter 2 (Quality & Moisture)', 'QUALITY_CHECK', 'ACTIVE', NULL, 'Kavitha R.'),
      ('cnt-c1-3', ?, 'Counter 3 (Express Verification)', 'EXPRESS', 'ACTIVE', NULL, 'Dinesh K.'),
      ('cnt-c2-1', ?, 'Counter 1 (Heavy Weighbridge)', 'WEIGHING', 'ACTIVE', NULL, 'Venkatesh S.')
    `).run(c1, c1, c1, c2);

    // 6. Centre-Days (Operational Dates: 2026-09-07, 2026-09-08)
    const today = '2026-09-07';
    const tomorrow = '2026-09-08';

    const cdPillaiyarToday = 'cd-pillaiyar-today';
    const cdVallamToday = 'cd-vallam-today';
    const cdBudalurToday = 'cd-budalur-today';

    db.prepare(`
      INSERT INTO centre_days (id, centre_id, season_id, commodity_id, service_date, status, planned_capacity_qty, planned_farmer_count, booked_qty, booked_farmer_count, arrived_farmer_count, served_farmer_count) VALUES
      (?, ?, ?, ?, ?, 'OPEN', 500.0, 25, 240.0, 12, 7, 3),
      (?, ?, ?, ?, ?, 'CONGESTED', 300.0, 15, 290.0, 15, 12, 2),
      (?, ?, ?, ?, ?, 'OPEN', 400.0, 20, 120.0, 6, 2, 1)
    `).run(
      cdPillaiyarToday, c1, seasonKharif, commPaddyA, today,
      cdVallamToday, c2, seasonKharif, commPaddyA, today,
      cdBudalurToday, c3, seasonKharif, commPaddyA, today
    );

    // 7. Slot Windows for Pillaiyarpatti
    const slotP1 = 'slot-c1-w1'; // 09:00 - 11:00
    const slotP2 = 'slot-c1-w2'; // 11:00 - 13:00
    const slotP3 = 'slot-c1-w3'; // 14:00 - 16:00
    const slotP4 = 'slot-c1-w4'; // 16:00 - 18:00

    db.prepare(`
      INSERT INTO slot_windows (id, centre_day_id, start_time, end_time, capacity_qty, capacity_farmer_count, booked_qty, booked_farmer_count, status) VALUES
      (?, ?, '09:00', '11:00', 120.0, 6, 120.0, 6, 'FULL'),
      (?, ?, '11:00', '13:00', 140.0, 7, 80.0, 4, 'AVAILABLE'),
      (?, ?, '14:00', '16:00', 120.0, 6, 40.0, 2, 'AVAILABLE'),
      (?, ?, '16:00', '18:00', 120.0, 6, 0.0, 0, 'AVAILABLE')
    `).run(
      slotP1, cdPillaiyarToday,
      slotP2, cdPillaiyarToday,
      slotP3, cdPillaiyarToday,
      slotP4, cdPillaiyarToday
    );

    // Slot Windows for Vallam (Near full / congested)
    const slotV1 = 'slot-c2-w1';
    const slotV2 = 'slot-c2-w2';
    db.prepare(`
      INSERT INTO slot_windows (id, centre_day_id, start_time, end_time, capacity_qty, capacity_farmer_count, booked_qty, booked_farmer_count, status) VALUES
      (?, ?, '09:00', '12:00', 150.0, 8, 150.0, 8, 'FULL'),
      (?, ?, '13:00', '16:00', 150.0, 7, 140.0, 7, 'FULL')
    `).run(
      slotV1, cdVallamToday,
      slotV2, cdVallamToday
    );

    // 8. Key Demonstration Users
    // 8a. Primary Farmer: Ramesh Kumar
    const uFarmer = 'user-ramesh';
    const pFarmer = 'profile-ramesh';
    db.prepare(`
      INSERT INTO users (id, role, name, mobile, email, status, district_id)
      VALUES (?, 'FARMER', 'Ramesh Kumar', '9876543210', 'ramesh.farmer@demo.in', 'ACTIVE', ?)
    `).run(uFarmer, districtId);

    db.prepare(`
      INSERT INTO farmer_profiles (id, user_id, farmer_ref, name, mobile, preferred_language, village, district_id, masked_aadhaar, masked_payment_ref, bank_name, verification_status)
      VALUES (?, ?, 'FMR-TN-2026-0812', 'Ramesh Kumar', '9876543210', 'en', 'Pillaiyarpatti South', ?, 'XXXXXXXX8291', 'SBIN*****4821', 'State Bank of India', 'VERIFIED')
    `).run(pFarmer, uFarmer, districtId);

    db.prepare(`
      INSERT INTO farmer_eligibilities (id, farmer_id, season_id, commodity_id, allocated_quota_quintals, utilized_quota_quintals, status)
      VALUES ('el-ramesh-1', ?, ?, ?, 100.0, 20.0, 'ELIGIBLE')
    `).run(pFarmer, seasonKharif, commPaddyA);

    // 8b. Operator: Suresh Patel
    const uOperator = 'user-suresh-op';
    db.prepare(`
      INSERT INTO users (id, role, name, mobile, email, status, district_id, centre_id)
      VALUES (?, 'OPERATOR', 'Suresh Patel', '9876500001', 'suresh.operator@demo.in', 'ACTIVE', ?, ?)
    `).run(uOperator, districtId, c1);

    // 8c. District Admin: P. Sundaram (IAS / Collector)
    const uAdmin = 'user-admin-sundaram';
    db.prepare(`
      INSERT INTO users (id, role, name, mobile, email, status, district_id)
      VALUES (?, 'DISTRICT_ADMIN', 'P. Sundaram, IAS', '9876500002', 'collector.thanjavur@demo.in', 'ACTIVE', ?)
    `).run(uAdmin, districtId);

    // 9. Additional Synthetic Farmers & Live Queue Population for Pillaiyarpatti
    const demoFarmers = [
      { id: 'f-1', name: 'Murugan Shanmugam', mobile: '9876543211', village: 'Vallam Pudur', qty: 25.0, token: 'TK-001', state: 'COMPLETED', counter: 'Counter 1' },
      { id: 'f-2', name: 'Lakshmi Narayanan', mobile: '9876543212', village: 'Mariammankoil', qty: 20.0, token: 'TK-002', state: 'COMPLETED', counter: 'Counter 1' },
      { id: 'f-3', name: 'Arumugam C.', mobile: '9876543213', village: 'Nanjikottai', qty: 30.0, token: 'TK-003', state: 'IN_SERVICE', counter: 'Counter 1' },
      { id: 'f-4', name: 'K. Meenakshi Ammal', mobile: '9876543214', village: 'Pillaiyarpatti', qty: 15.0, token: 'TK-004', state: 'CALLED', counter: 'Counter 2' },
      { id: 'f-5', name: 'Selvam Periyasamy', mobile: '9876543215', village: 'Vilar', qty: 20.0, token: 'TK-005', state: 'WAITING', counter: null },
      { id: 'f-6', name: 'Balamurugan T.', mobile: '9876543216', village: 'Alakkudi', qty: 18.0, token: 'TK-006', state: 'WAITING', counter: null },
      { id: 'f-7', name: 'A. Dhanasekaran', mobile: '9876543217', village: 'Kandiyur', qty: 22.0, token: 'TK-007', state: 'CHECKED_IN', counter: null },
      { id: 'f-8', name: 'M. Sangeetha', mobile: '9876543218', village: 'Thiruvaiyaru', qty: 16.0, token: 'TK-008', state: 'NO_SHOW', counter: null }
    ];

    demoFarmers.forEach((df, idx) => {
      const uId = `u-${df.id}`;
      const profId = `prof-${df.id}`;
      const bkId = `bk-${df.id}`;
      const qId = `q-${df.id}`;

      db.prepare(`
        INSERT INTO users (id, role, name, mobile, status, district_id)
        VALUES (?, 'FARMER', ?, ?, 'ACTIVE', ?)
      `).run(uId, df.name, df.mobile, districtId);

      db.prepare(`
        INSERT INTO farmer_profiles (id, user_id, farmer_ref, name, mobile, preferred_language, village, district_id, masked_aadhaar, masked_payment_ref, bank_name, verification_status)
        VALUES (?, ?, ?, ?, ?, 'en', ?, ?, 'XXXXXXXX9123', 'SBIN*****7782', 'Indian Overseas Bank', 'VERIFIED')
      `).run(profId, uId, `FMR-TN-2026-${1000 + idx}`, df.name, df.mobile, df.village, districtId);

      db.prepare(`
        INSERT INTO bookings (id, booking_ref, farmer_id, centre_day_id, slot_window_id, commodity_id, expected_qty, token_no, status, idempotency_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
      `).run(
        bkId,
        `BK-2026-${1000 + idx}`,
        profId,
        cdPillaiyarToday,
        slotP1,
        commPaddyA,
        df.qty,
        df.token,
        `idem-seed-${df.id}`
      );

      const peopleAhead = df.state === 'WAITING' ? (idx - 3) : (df.state === 'CHECKED_IN' ? (idx - 2) : 0);
      const eta = peopleAhead * 12;

      db.prepare(`
        INSERT INTO queue_entries (id, booking_id, centre_day_id, priority_class, position_snapshot, people_ahead, eta_minutes, state, assigned_counter_id, checked_in_at, called_at, service_started_at)
        VALUES (?, ?, ?, 'GENERAL', ?, ?, ?, ?, ?, DATETIME('now', '-1 hour'), DATETIME('now', '-30 minutes'), DATETIME('now', '-10 minutes'))
      `).run(
        qId,
        bkId,
        cdPillaiyarToday,
        idx + 1,
        Math.max(0, peopleAhead),
        Math.max(0, eta),
        df.state,
        df.counter ? 'cnt-c1-1' : null
      );

      // Add completed procurement records for Murugan and Lakshmi
      if (df.state === 'COMPLETED') {
        const gross = df.qty + 1.2;
        const tare = 1.2;
        const net = df.qty;
        const rate = 2320.0;
        const grossAmt = net * rate;
        const dedAmt = 0.0;
        const netAmt = grossAmt - dedAmt;
        const rcpId = `rcp-${df.id}`;

        db.prepare(`
          INSERT INTO procurement_records (id, booking_id, receipt_ref, commodity_id, gross_weight_quintals, tare_weight_quintals, net_quantity_quintals, moisture_percentage, moisture_deduction_quintals, final_payable_quantity, rate_per_quintal, gross_amount, deduction_amount, net_amount, quality_grade, outcome, recorded_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, 13.5, 0.0, ?, ?, ?, ?, ?, 'GRADE_A', 'ACCEPTED', 'Suresh Patel')
        `).run(
          rcpId,
          bkId,
          `RCP-2026-${5000 + idx}`,
          commPaddyA,
          gross,
          tare,
          net,
          net,
          rate,
          grossAmt,
          dedAmt,
          netAmt
        );

        // Add payment record: one PAID, one PROCESSING
        const payStatus = idx === 0 ? 'PAID' : 'PROCESSING';
        db.prepare(`
          INSERT INTO payment_records (id, procurement_id, payment_ref_masked, bank_name, account_masked, amount, status, expected_at, processed_at, last_updated_by)
          VALUES (?, ?, ?, 'Indian Overseas Bank', '*******7782', ?, ?, '2026-09-09', ?, 'Suresh Patel')
        `).run(
          `pay-${df.id}`,
          rcpId,
          `DBT-PFMS-TN-${90000 + idx}`,
          netAmt,
          payStatus,
          payStatus === 'PAID' ? '2026-09-07 14:30:00' : null
        );
      }
    });

    // 10. Ramesh Kumar's Active Upcoming Booking (Token TK-009)
    const rameshBkId = 'bk-ramesh-main';
    db.prepare(`
      INSERT INTO bookings (id, booking_ref, farmer_id, centre_day_id, slot_window_id, commodity_id, expected_qty, token_no, status, idempotency_key)
      VALUES (?, 'BK-2026-0009', ?, ?, ?, ?, 20.0, 'TK-009', 'CONFIRMED', 'idem-ramesh-0009')
    `).run(
      rameshBkId,
      pFarmer,
      cdPillaiyarToday,
      slotP2, // 11:00 - 13:00 window
      commPaddyA
    );

    // Queue entry for Ramesh: Checked in, waiting, 3 people ahead, ETA 35 mins
    db.prepare(`
      INSERT INTO queue_entries (id, booking_id, centre_day_id, priority_class, position_snapshot, people_ahead, eta_minutes, state, checked_in_at)
      VALUES ('q-ramesh-main', ?, ?, 'GENERAL', 9, 3, 35, 'WAITING', DATETIME('now', '-20 minutes'))
    `).run(
      rameshBkId,
      cdPillaiyarToday
    );

    // 11. Initial Notification Logs for Ramesh
    db.prepare(`
      INSERT INTO notification_jobs (id, farmer_id, recipient_mobile, channel, title, message, language, status, sent_at) VALUES
      ('notif-1', ?, '9876543210', 'SMS', 'Booking Confirmed', 'ProcureFlow: Your slot for 20 Quintals Paddy at Pillaiyarpatti PPC is CONFIRMED. Token: TK-009, Window: 11:00-13:00.', 'en', 'DELIVERED', DATETIME('now', '-2 hours')),
      ('notif-2', ?, '9876543210', 'IN_APP', 'Arrival Reminder', 'Please arrive at Pillaiyarpatti PPC between 10:45 AM and 11:15 AM with land certificate and identity proof.', 'en', 'DELIVERED', DATETIME('now', '-45 minutes')),
      ('notif-3', ?, '9876543210', 'PUSH', 'Check-in Verified', 'Check-in confirmed! You are at Position 9 (3 farmers ahead). Estimated wait: ~35 mins. Watch screen for Counter call.', 'en', 'DELIVERED', DATETIME('now', '-20 minutes'))
    `).run(pFarmer, pFarmer, pFarmer);

    // 12. Audit Business Events
    db.prepare(`
      INSERT INTO business_events (id, event_type, entity_type, entity_id, actor_name, actor_role, centre_id, summary) VALUES
      ('evt-1', 'SEASON_OPENED', 'CENTRE_DAY', 'cd-pillaiyar-today', 'P. Sundaram, IAS', 'DISTRICT_ADMIN', ?, 'Kharif Marketing Season 2026 configured and opened for district procurement.'),
      ('evt-2', 'CENTRE_DAY_OPENED', 'CENTRE_DAY', 'cd-pillaiyar-today', 'Suresh Patel', 'OPERATOR', ?, 'Pillaiyarpatti PPC operational day opened with 500 Quintals planned capacity.'),
      ('evt-3', 'BOOKING_CREATED', 'BOOKING', 'bk-ramesh-main', 'Ramesh Kumar', 'FARMER', ?, 'Farmer Ramesh Kumar booked 20.0 Qtl slot at Pillaiyarpatti PPC. Token: TK-009.'),
      ('evt-4', 'FARMER_CHECKIN', 'QUEUE', 'q-ramesh-main', 'Ramesh Kumar', 'FARMER', ?, 'Farmer checked in at Pillaiyarpatti PPC. Assigned queue position: 9.')
    `).run(c1, c1, c1, c1);

    console.log('✅ Synthetic seed dataset created successfully!');
  });
}

seedData();

