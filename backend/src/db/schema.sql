-- ProcureFlow Database Schema (Relational DDL)
-- Enforces ACID properties, strict foreign keys, and indexes for concurrency & idempotency

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK(role IN ('FARMER', 'OPERATOR', 'CENTRE_MANAGER', 'DISTRICT_ADMIN')),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE')),
  district_id TEXT NOT NULL,
  centre_id TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  farmer_ref TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK(preferred_language IN ('en', 'hi', 'ta')),
  village TEXT NOT NULL,
  district_id TEXT NOT NULL,
  masked_aadhaar TEXT NOT NULL,
  masked_payment_ref TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK(verification_status IN ('VERIFIED', 'PENDING', 'REJECTED')),
  assisted_by_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS districts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state_code TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS centres (
  id TEXT PRIMARY KEY,
  district_id TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  centre_type TEXT NOT NULL DEFAULT 'PPC' CHECK(centre_type IN ('PPC', 'APMC', 'SOCIETY', 'DIRECT_DEPOT')),
  opening_time TEXT NOT NULL DEFAULT '08:00',
  closing_time TEXT NOT NULL DEFAULT '18:00',
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'CONGESTED', 'DELAYED', 'CLOSED')),
  active_counters INTEGER NOT NULL DEFAULT 2,
  contact_number TEXT NOT NULL,
  FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE IF NOT EXISTS commodities (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  variety TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Quintal',
  msp_rate REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS procurement_seasons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kms_year TEXT NOT NULL,
  season_type TEXT NOT NULL CHECK(season_type IN ('KHARIF', 'RABI')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'UPCOMING', 'CLOSED'))
);

CREATE TABLE IF NOT EXISTS farmer_eligibilities (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  season_id TEXT NOT NULL,
  commodity_id TEXT NOT NULL,
  allocated_quota_quintals REAL NOT NULL,
  utilized_quota_quintals REAL NOT NULL DEFAULT 0.0,
  status TEXT NOT NULL DEFAULT 'ELIGIBLE' CHECK(status IN ('ELIGIBLE', 'EXHAUSTED', 'PENDING_VERIFICATION')),
  UNIQUE(farmer_id, season_id, commodity_id),
  FOREIGN KEY (farmer_id) REFERENCES farmer_profiles(id),
  FOREIGN KEY (season_id) REFERENCES procurement_seasons(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS centre_days (
  id TEXT PRIMARY KEY,
  centre_id TEXT NOT NULL,
  season_id TEXT NOT NULL,
  commodity_id TEXT NOT NULL,
  service_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'CONGESTED', 'DELAYED', 'CLOSED')),
  planned_capacity_qty REAL NOT NULL,
  planned_farmer_count INTEGER NOT NULL,
  booked_qty REAL NOT NULL DEFAULT 0.0,
  booked_farmer_count INTEGER NOT NULL DEFAULT 0,
  arrived_farmer_count INTEGER NOT NULL DEFAULT 0,
  served_farmer_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(centre_id, season_id, commodity_id, service_date),
  FOREIGN KEY (centre_id) REFERENCES centres(id),
  FOREIGN KEY (season_id) REFERENCES procurement_seasons(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS slot_windows (
  id TEXT PRIMARY KEY,
  centre_day_id TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  capacity_qty REAL NOT NULL,
  capacity_farmer_count INTEGER NOT NULL,
  booked_qty REAL NOT NULL DEFAULT 0.0,
  booked_farmer_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'ALMOST_FULL', 'FULL')),
  FOREIGN KEY (centre_day_id) REFERENCES centre_days(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_ref TEXT NOT NULL UNIQUE,
  farmer_id TEXT NOT NULL,
  centre_day_id TEXT NOT NULL,
  slot_window_id TEXT NOT NULL,
  commodity_id TEXT NOT NULL,
  expected_qty REAL NOT NULL,
  token_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK(status IN ('CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW')),
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (farmer_id) REFERENCES farmer_profiles(id),
  FOREIGN KEY (centre_day_id) REFERENCES centre_days(id),
  FOREIGN KEY (slot_window_id) REFERENCES slot_windows(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS queue_entries (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  centre_day_id TEXT NOT NULL,
  priority_class TEXT NOT NULL DEFAULT 'GENERAL' CHECK(priority_class IN ('GENERAL', 'ELDERLY', 'WOMAN_FARMER', 'SPECIAL_ASSISTANCE')),
  position_snapshot INTEGER NOT NULL DEFAULT 0,
  people_ahead INTEGER NOT NULL DEFAULT 0,
  eta_minutes INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL DEFAULT 'BOOKED' CHECK(state IN (
    'BOOKED', 'REMINDER_SENT', 'CHECKED_IN', 'WAITING', 'CALLED',
    'IN_SERVICE', 'MEASUREMENT_PENDING', 'COMPLETED', 'NO_SHOW',
    'CANCELLED', 'DEFERRED', 'EXCEPTION'
  )),
  assigned_counter_id TEXT,
  checked_in_at TEXT,
  called_at TEXT,
  service_started_at TEXT,
  completed_at TEXT,
  action_reason TEXT,
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (centre_day_id) REFERENCES centre_days(id)
);

CREATE TABLE IF NOT EXISTS service_counters (
  id TEXT PRIMARY KEY,
  centre_id TEXT NOT NULL,
  counter_code TEXT NOT NULL,
  counter_type TEXT NOT NULL DEFAULT 'WEIGHING' CHECK(counter_type IN ('WEIGHING', 'QUALITY_CHECK', 'EXPRESS')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'PAUSED', 'OFFLINE')),
  current_queue_entry_id TEXT,
  operator_name TEXT,
  FOREIGN KEY (centre_id) REFERENCES centres(id)
);

CREATE TABLE IF NOT EXISTS procurement_records (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  receipt_ref TEXT NOT NULL UNIQUE,
  commodity_id TEXT NOT NULL,
  gross_weight_quintals REAL NOT NULL,
  tare_weight_quintals REAL NOT NULL,
  net_quantity_quintals REAL NOT NULL,
  moisture_percentage REAL NOT NULL,
  moisture_deduction_quintals REAL NOT NULL DEFAULT 0.0,
  final_payable_quantity REAL NOT NULL,
  rate_per_quintal REAL NOT NULL,
  gross_amount REAL NOT NULL,
  deduction_amount REAL NOT NULL DEFAULT 0.0,
  net_amount REAL NOT NULL,
  quality_grade TEXT NOT NULL DEFAULT 'GRADE_A' CHECK(quality_grade IN ('GRADE_A', 'COMMON', 'REJECTED')),
  outcome TEXT NOT NULL DEFAULT 'ACCEPTED' CHECK(outcome IN ('ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'PENDING_REVIEW')),
  outcome_reason TEXT,
  recorded_by TEXT NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE IF NOT EXISTS payment_records (
  id TEXT PRIMARY KEY,
  procurement_id TEXT NOT NULL UNIQUE,
  payment_ref_masked TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_masked TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'INITIATED' CHECK(status IN ('NOT_INITIATED', 'INITIATED', 'PROCESSING', 'PAID', 'FAILED', 'ON_HOLD', 'DISPUTED')),
  expected_at TEXT NOT NULL,
  processed_at TEXT,
  failure_reason TEXT,
  last_updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (procurement_id) REFERENCES procurement_records(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notification_jobs (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  recipient_mobile TEXT NOT NULL,
  channel TEXT NOT NULL CHECK(channel IN ('SMS', 'PUSH', 'IN_APP')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'SENT' CHECK(status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED')),
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  sent_at TEXT,
  FOREIGN KEY (farmer_id) REFERENCES farmer_profiles(id)
);

CREATE TABLE IF NOT EXISTS business_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('BOOKING', 'QUEUE', 'PROCUREMENT', 'PAYMENT', 'CENTRE_DAY')),
  entity_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  centre_id TEXT,
  summary TEXT NOT NULL,
  payload_snapshot TEXT,
  occurred_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- Essential Performance & Integrity Indexes
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_farmers_user ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_centre_days_date ON centre_days(service_date, status);
CREATE INDEX IF NOT EXISTS idx_slot_windows_day ON slot_windows(centre_day_id);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_centre_day ON bookings(centre_day_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_centre_day ON queue_entries(centre_day_id, state);
CREATE INDEX IF NOT EXISTS idx_events_occurred ON business_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_farmer ON notification_jobs(farmer_id, created_at DESC);
