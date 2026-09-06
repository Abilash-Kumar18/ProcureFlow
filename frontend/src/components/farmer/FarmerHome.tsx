import React, { useState, useEffect } from 'react';
import { User, LanguageCode, SlotWindow } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { playTokenCallChime } from '../../utils/audioAlert';
import confetti from 'canvas-confetti';
import {
  Calendar, Clock, MapPin, CheckCircle2, AlertTriangle, ArrowRight,
  TrendingUp, FileText, CreditCard, Bell, ChevronRight, Volume2, Sparkles,
  Building, QrCode, ShieldCheck, Download, Navigation, PhoneCall, Check, Info
} from 'lucide-react';

interface FarmerHomeProps {
  currentUser: User;
  currentLanguage: LanguageCode;
  onRefresh: () => void;
}

export const FarmerHome: React.FC<FarmerHomeProps> = ({ currentUser, currentLanguage, onRefresh }) => {
  const t = translations[currentLanguage];
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [centres, setCentres] = useState<any[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<any | null>(null);
  const [selectedCentreDay, setSelectedCentreDay] = useState<any | null>(null);
  const [slotWindows, setSlotWindows] = useState<SlotWindow[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotWindow | null>(null);
  const [expectedQty, setExpectedQty] = useState<number>(20);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Digital Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Load Farmer Data
  const loadFarmerData = async () => {
    try {
      const farmerId = (currentUser as any).farmer_profile_id || 'profile-ramesh';

      // 1. Fetch bookings
      const bRes = await fetch(`/api/v1/bookings/farmer/${farmerId}`);
      const bData = await bRes.json();
      if (bData.data) {
        setBookings(bData.data);
        const active = bData.data.find((b: any) => b.status === 'CONFIRMED' || b.queue_state === 'IN_SERVICE' || b.queue_state === 'CALLED');
        setActiveBooking(active || bData.data[0] || null);

        if (active?.queue_state === 'CALLED') {
          playTokenCallChime();
        }
      }

      // 2. Fetch notifications
      const nRes = await fetch(`/api/v1/notifications/farmer/${farmerId}`);
      const nData = await nRes.json();
      if (nData.data) {
        setNotifications(nData.data);
      }
    } catch (e) {
      console.error('Failed to load farmer data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmerData();
  }, [currentUser]);

  // Handle Farmer Check-In
  const handleCheckIn = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/v1/queue/${bookingId}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arrival_method: 'SELF_APP' })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
        loadFarmerData();
        onRefresh();
      }
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  // Open booking modal
  const handleOpenBookingModal = async () => {
    setShowBookingModal(true);
    setBookingError(null);
    setAlternatives([]);
    try {
      const res = await fetch('/api/v1/centres');
      const data = await res.json();
      if (data.data) {
        setCentres(data.data);
        if (data.data.length > 0) {
          handleSelectCentre(data.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load centres:', e);
    }
  };

  const handleSelectCentre = async (centre: any) => {
    setSelectedCentre(centre);
    setSelectedSlot(null);
    setBookingError(null);
    setAlternatives([]);

    if (centre.centre_day) {
      setSelectedCentreDay(centre.centre_day);
      const res = await fetch(`/api/v1/centres/centre-days/${centre.centre_day.id}/availability`);
      const data = await res.json();
      if (data.data?.slot_windows) {
        setSlotWindows(data.data.slot_windows);
        const available = data.data.slot_windows.find((s: SlotWindow) => s.status !== 'FULL');
        if (available) setSelectedSlot(available);
      }
    }
  };

  // Submit Slot Booking
  const handleSubmitBooking = async () => {
    if (!selectedCentreDay || !selectedSlot) return;
    setIsSubmittingBooking(true);
    setBookingError(null);

    try {
      const farmerId = (currentUser as any).farmer_profile_id || 'profile-ramesh';
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: farmerId,
          centre_day_id: selectedCentreDay.id,
          slot_window_id: selectedSlot.id,
          commodity_id: 'comm-paddy-a',
          expected_qty: expectedQty
        })
      });

      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
        setShowBookingModal(false);
        loadFarmerData();
        onRefresh();
      } else {
        setBookingError(data.error || 'Failed to book slot');
        if (data.alternatives) {
          setAlternatives(data.alternatives);
        }
      }
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleViewReceipt = async (receiptRef: string) => {
    try {
      const res = await fetch(`/api/v1/procurements/receipt/${receiptRef}`);
      const data = await res.json();
      if (data.data) {
        setSelectedReceipt(data.data);
      }
    } catch (err) {
      console.error('Error fetching receipt:', err);
    }
  };

  // Queue ring calculations
  const peopleAhead = activeBooking?.people_ahead ?? 3;
  const circumference = 2 * Math.PI * 55;
  const strokeOffset = circumference - (Math.max(1, 10 - peopleAhead) / 10) * circumference;

  return (
    <div className="app-container" style={{ paddingBottom: '70px' }}>
      {/* Farmer Welcome & Season Quota Banner */}
      <div className="modern-card" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.6rem',
              boxShadow: '0 8px 18px rgba(5, 150, 105, 0.25)'
            }}>
              👨‍🌾
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-emerald">{t.farmer.verifiedProfile}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  {t.farmer.farmerRef} <strong className="mono">{(currentUser as any).farmer_ref || 'FMR-TN-2026-0812'}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--slate-900)' }}>{t.farmer.welcome} {currentUser.name}</h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                📍 {(currentUser as any).village || 'Pillaiyarpatti South'} • 🏦 {(currentUser as any).masked_payment_ref || 'SBIN*****4821'} (State Bank of India)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#ecfdf5', padding: '10px 16px', borderRadius: '14px', border: '1px solid #a7f3d0', textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>{t.farmer.kharifQuota}</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46' }}>80.0 / 100 Qtl</div>
              <span style={{ fontSize: '0.7rem', color: '#059669' }}>{t.farmer.eligiblePaddy}</span>
            </div>

            <button onClick={handleOpenBookingModal} className="btn btn-primary" style={{ padding: '12px 22px' }}>
              <Calendar size={18} />
              <span>{t.farmer.bookNewSlot}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Counter Call Banner */}
      {activeBooking?.queue_state === 'CALLED' && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          borderRadius: '20px',
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 12px 30px rgba(217, 119, 6, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '12px', borderRadius: '14px', display: 'flex' }}>
              <Volume2 size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ background: 'white', color: '#b45309', fontWeight: 800 }}>{t.farmer.urgentAlert.title}</span>
                <div className="sound-wave">
                  <div className="sound-bar" style={{ background: 'white' }} />
                  <div className="sound-bar" style={{ background: 'white' }} />
                  <div className="sound-bar" style={{ background: 'white' }} />
                  <div className="sound-bar" style={{ background: 'white' }} />
                  <div className="sound-bar" style={{ background: 'white' }} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.35rem', margin: '4px 0', fontWeight: 800 }}>
                {t.farmer.urgentAlert.calledTo} {activeBooking.assigned_counter_code || 'Counter 1 (Weighbridge Bay)'}!
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.95 }}>
                {t.farmer.urgentAlert.instructions}
              </p>
            </div>
          </div>

          <button
            onClick={() => playTokenCallChime()}
            className="btn"
            style={{ background: 'white', color: '#b45309', fontWeight: 700, padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {t.farmer.urgentAlert.playChime}
          </button>
        </div>
      )}

      {/* Hero Digital Procurement Pass (Wallet / Boarding Pass Style) */}
      {activeBooking ? (
        <div className="pass-card" style={{ padding: '32px', marginBottom: '28px' }}>
          {/* Top Pass Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-emerald" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  {t.farmer.officialDigitalPass}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>{t.farmer.docaNetwork}</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
                {activeBooking.centre_name}
              </h3>
              <p style={{ color: '#a7f3d0', fontSize: '0.9rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} />
                <span>{activeBooking.centre_address}</span>
              </p>
            </div>

            {/* Large Glowing Token Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '20px',
              padding: '16px 28px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6ee7b7', fontWeight: 700 }}>
                {t.farmer.tokenNumber}
              </span>
              <div className="mono" style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
                {activeBooking.token_no}
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                {t.farmer.bookingRef} {activeBooking.booking_ref}
              </span>
            </div>
          </div>

          {/* Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 600 }}>{t.farmer.procurementDate}</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>{activeBooking.service_date}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 600 }}>{t.farmer.arrivalWindow}</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>{activeBooking.slot_start_time} - {activeBooking.slot_end_time}</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 600 }}>{t.farmer.cropExpectedVolume}</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>{activeBooking.commodity_name} • {activeBooking.expected_qty} Qtl</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 600 }}>{t.farmer.currentStatus}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span className={`badge ${activeBooking.queue_state === 'CALLED' ? 'badge-amber' : 'badge-emerald'}`}>
                  {activeBooking.queue_state}
                </span>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="pass-divider" />

          {/* Lower Pass Section: Queue Ring & Action */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Circular Queue Ring */}
              <div className="queue-ring-container">
                <svg className="queue-ring-svg" viewBox="0 0 140 140">
                  <circle className="queue-ring-bg" cx="70" cy="70" r="55" />
                  <circle
                    className="queue-ring-progress"
                    cx="70"
                    cy="70"
                    r="55"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                    {activeBooking.people_ahead ?? 0}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t.farmer.ahead}
                  </span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                  {activeBooking.queue_state === 'BOOKED'
                    ? t.farmer.arrivalPending
                    : activeBooking.queue_state === 'WAITING'
                    ? `${t.farmer.estWaitMinutes}${activeBooking.eta_minutes ?? 20} ${t.farmer.minutes}`
                    : activeBooking.queue_state === 'CALLED'
                    ? t.farmer.tokenIsCalled
                    : activeBooking.queue_state === 'IN_SERVICE'
                    ? t.farmer.weighingInProgress
                    : t.farmer.procurementComplete}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '2px', maxWidth: '400px' }}>
                  {activeBooking.queue_state === 'BOOKED'
                    ? t.farmer.arrivalPendingDesc
                    : t.farmer.dynamicQueueDesc}
                </p>
              </div>
            </div>

            {/* Check-In Action Button or Receipt Button */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {activeBooking.queue_state === 'BOOKED' && (
                <button
                  onClick={() => handleCheckIn(activeBooking.id)}
                  className="btn btn-accent"
                  style={{ padding: '14px 28px', fontSize: '1.05rem', fontWeight: 800 }}
                >
                  <Navigation size={20} />
                  <span>{t.farmer.checkInNow}</span>
                </button>
              )}

              {activeBooking.procurement_id && (
                <button
                  onClick={() => handleViewReceipt(activeBooking.receipt_ref)}
                  className="btn"
                  style={{ background: 'white', color: '#064e3b', fontWeight: 800, padding: '12px 24px' }}
                >
                  <FileText size={18} />
                  <span>{t.farmer.viewReceipt} ({activeBooking.receipt_ref})</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Flow Stepper */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="step-track">
              <div className={`step-node ${['BOOKED', 'WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED'].includes(activeBooking.queue_state) ? 'completed' : ''}`}>
                <div className="step-circle"><Check size={18} /></div>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>{t.farmer.stepper.booked}</span>
              </div>

              <div className={`step-node ${['WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED'].includes(activeBooking.queue_state) ? (activeBooking.queue_state === 'WAITING' ? 'active' : 'completed') : ''}`}>
                <div className="step-circle">{['WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED'].includes(activeBooking.queue_state) ? <Check size={18} /> : '2'}</div>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>{t.farmer.stepper.gateCheckin}</span>
              </div>

              <div className={`step-node ${['CALLED', 'IN_SERVICE', 'COMPLETED'].includes(activeBooking.queue_state) ? (activeBooking.queue_state === 'CALLED' ? 'active' : 'completed') : ''}`}>
                <div className="step-circle">{['CALLED', 'IN_SERVICE', 'COMPLETED'].includes(activeBooking.queue_state) ? <Check size={18} /> : '3'}</div>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>{t.farmer.stepper.weighbridge}</span>
              </div>

              <div className={`step-node ${['IN_SERVICE', 'COMPLETED'].includes(activeBooking.queue_state) ? (activeBooking.queue_state === 'IN_SERVICE' ? 'active' : 'completed') : ''}`}>
                <div className="step-circle">{activeBooking.queue_state === 'COMPLETED' ? <Check size={18} /> : '4'}</div>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>{t.farmer.stepper.qualityCheck}</span>
              </div>

              <div className={`step-node ${activeBooking.queue_state === 'COMPLETED' ? 'completed' : ''}`}>
                <div className="step-circle">{activeBooking.queue_state === 'COMPLETED' ? <Check size={18} /> : '5'}</div>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 700 }}>{t.farmer.stepper.dbtCredit}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Booking Card */
        <div className="modern-card" style={{ padding: '48px 24px', textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Calendar size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-900)', marginBottom: '6px' }}>{t.farmer.noActiveBooking}</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 24px' }}>
            {t.farmer.noActiveBookingDesc}
          </p>
          <button onClick={handleOpenBookingModal} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
            <Calendar size={20} />
            <span>{t.farmer.bookNewSlot}</span>
          </button>
        </div>
      )}

      {/* Two Column Layout: Historical Bookings & Recent SMS Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Previous Bookings & Receipts */}
        <div className="modern-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="var(--emerald-600)" />
              <span>{t.farmer.historyTitle}</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{bookings.length} {t.common.records}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                style={{
                  border: '1px solid var(--slate-200)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: b.id === activeBooking?.id ? '#f0fdf4' : 'white'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--slate-900)' }}>{b.token_no}</span>
                    <span className={`badge ${
                      b.status === 'COMPLETED' ? 'badge-emerald' :
                      b.status === 'CONFIRMED' ? 'badge-amber' : 'badge-slate'
                    }`}>
                      {b.queue_state || b.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '3px' }}>
                    {b.centre_name} • {b.service_date}
                  </p>
                  {b.receipt_ref && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--emerald-700)', fontWeight: 700 }}>
                      {t.farmer.receiptModal.receiptLabel} {b.receipt_ref} • ₹{b.net_amount?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {b.receipt_ref ? (
                  <button onClick={() => handleViewReceipt(b.receipt_ref)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    {t.farmer.viewReceipt} 📄
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{t.common.scheduled}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SMS & App Notifications Feed */}
        <div className="modern-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} color="var(--amber-500)" />
              <span>{t.farmer.notifications}</span>
            </h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{t.farmer.notificationsLive}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ background: 'var(--slate-50)', borderRadius: '14px', padding: '14px', borderLeft: '4px solid var(--emerald-500)', border: '1px solid var(--slate-200)', borderLeftWidth: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{n.channel}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.45 }}>{n.message}</p>
                <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                  {t.farmer.deliveredTo} {(currentUser as any).mobile || '9876543210'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slot Booking Drawer / Modal */}
      {showBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="modern-card" style={{ background: 'white', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-900)' }}>{t.farmer.bookingModal.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{t.farmer.bookingModal.subtitle}</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: 'var(--slate-400)' }}>&times;</button>
            </div>

            {/* Error & AI Alternative Slot Recommendation */}
            {bookingError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', fontWeight: 800, marginBottom: '8px' }}>
                  <AlertTriangle size={20} />
                  <span>{bookingError}</span>
                </div>
                {alternatives.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#991b1b', marginBottom: '10px' }}>
                      {t.farmer.bookingModal.recommendedAlternatives}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {alternatives.map((alt) => (
                        <button
                          key={alt.id}
                          onClick={() => {
                            setSelectedSlot(alt);
                            setBookingError(null);
                          }}
                          className="btn btn-secondary"
                          style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.85rem', borderColor: '#fca5a5' }}
                        >
                          <span>{alt.centre_name} ({alt.service_date})</span>
                          <strong>{alt.start_time} - {alt.end_time} • {t.farmer.bookingModal.selectAndReserve}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Select Centre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--slate-800)' }}>
                {t.farmer.bookingModal.step1}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {centres.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCentre(c)}
                    style={{
                      border: selectedCentre?.id === c.id ? '2px solid var(--emerald-600)' : '1px solid var(--slate-200)',
                      background: selectedCentre?.id === c.id ? '#ecfdf5' : 'white',
                      padding: '14px',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>{c.name}</strong>
                      <span className={`badge ${c.is_congested ? 'badge-amber' : 'badge-emerald'}`}>
                        {c.is_congested ? t.common.heavyTraffic : t.common.optimal}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px' }}>{c.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Time Window */}
            {slotWindows.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--slate-800)' }}>
                  {t.farmer.bookingModal.step2}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {slotWindows.map((slot) => {
                    const isFull = slot.status === 'FULL';
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--emerald-600)' : '1px solid var(--slate-200)',
                          background: isSelected ? '#d1fae5' : isFull ? '#f1f5f9' : 'white',
                          cursor: isFull ? 'not-allowed' : 'pointer',
                          opacity: isFull ? 0.5 : 1,
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                          {slot.start_time} - {slot.end_time}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: isFull ? 'var(--red-600)' : '#059669', fontWeight: 600 }}>
                          {isFull ? t.farmer.bookingModal.capacityFull : `${slot.booked_farmer_count}/${slot.capacity_farmer_count} ${t.farmer.bookingModal.slots}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Quantity */}
            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--slate-800)' }}>
                {t.farmer.bookingModal.step3}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={expectedQty}
                onChange={(e) => setExpectedQty(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--slate-300)',
                  fontSize: '1.05rem',
                  outline: 'none',
                  fontWeight: 600
                }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '6px', display: 'block' }}>
                {t.farmer.bookingModal.commodityInfo}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowBookingModal(false)} className="btn btn-secondary">
                {t.common.cancel}
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={!selectedSlot || isSubmittingBooking}
                className="btn btn-primary"
                style={{ padding: '12px 28px', fontWeight: 700 }}
              >
                {isSubmittingBooking ? t.farmer.bookingModal.securingSlot : t.farmer.bookingModal.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Verified Digital Procurement Receipt Modal */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="modern-card receipt-sheet" style={{ background: 'white', maxWidth: '620px', width: '100%', padding: '36px', borderRadius: '24px', position: 'relative' }}>
            {/* Gov Seal & Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--slate-300)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>🇮🇳</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--emerald-800)', letterSpacing: '0.05em' }}>
                  {t.farmer.receiptModal.govHeader}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-900)' }}>{t.farmer.receiptModal.title}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--slate-600)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '6px' }}>
                  {t.farmer.receiptModal.receiptLabel} <strong>{selectedReceipt.receipt_ref}</strong>
                </span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--emerald-700)', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                  {t.farmer.receiptModal.tokenLabel} <strong>{selectedReceipt.token_no}</strong>
                </span>
              </div>
            </div>

            {/* Farmer & Centre Meta Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div><strong>{t.farmer.receiptModal.farmerName}</strong> {selectedReceipt.farmer_name}</div>
              <div><strong>{t.farmer.receiptModal.centreName}</strong> {selectedReceipt.centre_name}</div>
              <div><strong>{t.farmer.receiptModal.commodityVariety}</strong> {selectedReceipt.commodity_name}</div>
              <div><strong>{t.farmer.receiptModal.timestamp}</strong> {selectedReceipt.recorded_at}</div>
              <div><strong>{t.farmer.receiptModal.aadhaar}</strong> {selectedReceipt.masked_aadhaar}</div>
              <div><strong>{t.farmer.receiptModal.bankDbt}</strong> {selectedReceipt.masked_payment_ref}</div>
            </div>

            {/* Weighbridge Calculations Breakdown Box */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid var(--slate-200)', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{t.farmer.receiptModal.grossWeight}</span>
                <strong className="mono">{selectedReceipt.gross_weight_quintals} {t.common.quintals}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{t.farmer.receiptModal.tareWeight}</span>
                <strong className="mono" style={{ color: 'var(--slate-500)' }}>- {selectedReceipt.tare_weight_quintals} {t.common.quintals}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{t.farmer.receiptModal.moistureReading}</span>
                <span>{selectedReceipt.moisture_percentage}% {t.farmer.receiptModal.moistureStandard}</span>
              </div>
              {selectedReceipt.moisture_deduction_quintals > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'var(--red-600)' }}>
                  <span>{t.farmer.receiptModal.excessMoistureDed}</span>
                  <strong>- {selectedReceipt.moisture_deduction_quintals} {t.common.quintals}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--slate-200)', marginTop: '6px', paddingTop: '6px' }}>
                <span>{t.farmer.receiptModal.netQuantity}</span>
                <strong className="mono" style={{ color: 'var(--emerald-700)', fontSize: '1.05rem' }}>{selectedReceipt.final_payable_quantity} {t.common.quintals}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{t.farmer.receiptModal.mspRate}</span>
                <span className="mono">₹{selectedReceipt.rate_per_quintal} / {t.common.quintals}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--slate-300)', marginTop: '8px', paddingTop: '8px', fontSize: '1.25rem', color: 'var(--emerald-800)' }}>
                <strong>{t.farmer.receiptModal.netPayable}</strong>
                <strong className="mono">₹{selectedReceipt.net_amount?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Direct Benefit Transfer (DBT) Status */}
            <div style={{ background: '#ecfdf5', padding: '14px 18px', borderRadius: '14px', border: '1px solid #86efac', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 800 }}>{t.farmer.receiptModal.dbtStatusTitle}</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                  {selectedReceipt.payment_status || 'INITIATED'}
                </div>
                <span className="mono" style={{ fontSize: '0.72rem', color: '#166534' }}>Ref: {selectedReceipt.payment_ref_masked || 'DBT-PFMS-TN-98124'}</span>
              </div>
              <span className="badge badge-emerald">{t.farmer.receiptModal.authenticated}</span>
            </div>

            {/* Printable Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }} className="no-print">
              <button onClick={() => window.print()} className="btn btn-secondary">
                {t.common.print}
              </button>
              <button onClick={() => setSelectedReceipt(null)} className="btn btn-primary">
                {t.common.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
