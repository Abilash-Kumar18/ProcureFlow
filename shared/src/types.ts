export type UserRole = 'FARMER' | 'OPERATOR' | 'CENTRE_MANAGER' | 'DISTRICT_ADMIN';

export type QueueState =
  | 'BOOKED'
  | 'REMINDER_SENT'
  | 'CHECKED_IN'
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'MEASUREMENT_PENDING'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED'
  | 'DEFERRED'
  | 'EXCEPTION';

export type ProcurementOutcome =
  | 'ACCEPTED'
  | 'PARTIALLY_ACCEPTED'
  | 'REJECTED'
  | 'PENDING_REVIEW';

export type PaymentState =
  | 'NOT_INITIATED'
  | 'INITIATED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'ON_HOLD'
  | 'DISPUTED';

export type LanguageCode = 'en' | 'hi' | 'ta';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  mobile: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';
  district_id: string;
  centre_id?: string;
  created_at: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  farmer_ref: string;
  name: string;
  mobile: string;
  preferred_language: LanguageCode;
  village: string;
  district_id: string;
  masked_aadhaar: string;
  masked_payment_ref: string; // e.g. SBIN*****4821
  bank_name: string;
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  assisted_by_user_id?: string;
  created_at: string;
}

export interface District {
  id: string;
  name: string;
  state_code: string;
  active: boolean;
}

export interface Centre {
  id: string;
  district_id: string;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  centre_type: 'PPC' | 'APMC' | 'SOCIETY' | 'DIRECT_DEPOT';
  opening_time: string;
  closing_time: string;
  status: 'OPEN' | 'CONGESTED' | 'DELAYED' | 'CLOSED';
  active_counters: number;
  contact_number: string;
}

export interface Commodity {
  id: string;
  code: string;
  name: string;
  variety: string;
  unit: string;
  msp_rate: number; // Minimum Support Price per quintal (₹)
  active: boolean;
}

export interface ProcurementSeason {
  id: string;
  name: string;
  kms_year: string;
  season_type: 'KHARIF' | 'RABI';
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'UPCOMING' | 'CLOSED';
}

export interface FarmerEligibility {
  id: string;
  farmer_id: string;
  season_id: string;
  commodity_id: string;
  allocated_quota_quintals: number;
  utilized_quota_quintals: number;
  status: 'ELIGIBLE' | 'EXHAUSTED' | 'PENDING_VERIFICATION';
}

export interface CentreDay {
  id: string;
  centre_id: string;
  season_id: string;
  commodity_id: string;
  service_date: string; // YYYY-MM-DD
  status: 'OPEN' | 'CONGESTED' | 'DELAYED' | 'CLOSED';
  planned_capacity_qty: number; // in quintals
  planned_farmer_count: number;
  booked_qty: number;
  booked_farmer_count: number;
  arrived_farmer_count: number;
  served_farmer_count: number;
}

export interface SlotWindow {
  id: string;
  centre_day_id: string;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  capacity_qty: number;
  capacity_farmer_count: number;
  booked_qty: number;
  booked_farmer_count: number;
  status: 'AVAILABLE' | 'ALMOST_FULL' | 'FULL';
}

export interface Booking {
  id: string;
  booking_ref: string; // e.g. BK-2026-0042
  farmer_id: string;
  centre_day_id: string;
  slot_window_id: string;
  commodity_id: string;
  expected_qty: number; // in quintals
  token_no: string; // e.g. TK-042
  status: 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED' | 'NO_SHOW';
  idempotency_key: string;
  created_at: string;
  updated_at: string;

  // Joined fields for display convenience
  farmer_name?: string;
  farmer_mobile?: string;
  centre_name?: string;
  service_date?: string;
  slot_start_time?: string;
  slot_end_time?: string;
  commodity_name?: string;
}

export interface QueueEntry {
  id: string;
  booking_id: string;
  centre_day_id: string;
  priority_class: 'GENERAL' | 'ELDERLY' | 'WOMAN_FARMER' | 'SPECIAL_ASSISTANCE';
  position_snapshot: number;
  people_ahead: number;
  current_serving_token?: string;
  eta_minutes: number;
  state: QueueState;
  assigned_counter_id?: string;
  assigned_counter_code?: string;
  checked_in_at?: string;
  called_at?: string;
  service_started_at?: string;
  completed_at?: string;
  action_reason?: string;
  updated_at: string;

  // Joined fields
  token_no?: string;
  farmer_name?: string;
  farmer_mobile?: string;
  expected_qty?: number;
}

export interface ServiceCounter {
  id: string;
  centre_id: string;
  counter_code: string; // e.g. Counter 1
  counter_type: 'WEIGHING' | 'QUALITY_CHECK' | 'EXPRESS';
  status: 'ACTIVE' | 'PAUSED' | 'OFFLINE';
  current_queue_entry_id?: string;
  current_token_no?: string;
  operator_name?: string;
}

export interface ProcurementRecord {
  id: string;
  booking_id: string;
  receipt_ref: string; // e.g. RCP-2026-8812
  commodity_id: string;
  gross_weight_quintals: number;
  tare_weight_quintals: number;
  net_quantity_quintals: number;
  moisture_percentage: number;
  moisture_deduction_quintals: number;
  final_payable_quantity: number;
  rate_per_quintal: number;
  gross_amount: number;
  deduction_amount: number;
  net_amount: number;
  quality_grade: 'GRADE_A' | 'COMMON' | 'REJECTED';
  outcome: ProcurementOutcome;
  outcome_reason?: string;
  recorded_by: string;
  recorded_at: string;

  // Joined fields
  farmer_name?: string;
  centre_name?: string;
  commodity_name?: string;
  token_no?: string;
}

export interface PaymentRecord {
  id: string;
  procurement_id: string;
  payment_ref_masked: string; // e.g. DBT-SBIN-XXXX-9912
  bank_name: string;
  account_masked: string; // e.g. *******4821
  amount: number;
  status: PaymentState;
  expected_at: string;
  processed_at?: string;
  failure_reason?: string;
  last_updated_by: string;
  updated_at: string;
}

export interface NotificationJob {
  id: string;
  farmer_id: string;
  recipient_mobile: string;
  channel: 'SMS' | 'PUSH' | 'IN_APP';
  title: string;
  message: string;
  language: LanguageCode;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  created_at: string;
  sent_at?: string;
}

export interface BusinessEvent {
  id: string;
  event_type: string;
  entity_type: 'BOOKING' | 'QUEUE' | 'PROCUREMENT' | 'PAYMENT' | 'CENTRE_DAY';
  entity_id: string;
  actor_name: string;
  actor_role: UserRole;
  centre_id?: string;
  summary: string;
  payload_snapshot?: string;
  occurred_at: string;
}

export interface CentreMetrics {
  centre_id: string;
  centre_name: string;
  planned_capacity: number;
  booked_volume: number;
  arrived_count: number;
  served_count: number;
  waiting_count: number;
  no_show_count: number;
  average_wait_minutes: number;
  active_counters: number;
  congestion_level: 'LOW' | 'OPTIMAL' | 'CONGESTED' | 'CRITICAL';
}
