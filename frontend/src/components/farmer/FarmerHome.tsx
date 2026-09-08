import React, { useState, useEffect } from 'react';
import { User, LanguageCode, SlotWindow } from '../../../../shared/src/types';
import {
  translations,
  localizeStatus,
  localizeCentreName,
  localizeCentreAddress,
  localizeCommodity,
  localizeVillage,
  localizeBank,
  localizeCounter,
  localizeChannel,
  localizeNotificationTitle,
  localizeNotificationMessage
} from '../../i18n/translations';
import { playTokenCallChime } from '../../utils/audioAlert';
import confetti from 'canvas-confetti';
import {
  Calendar, MapPin, AlertTriangle, FileText, Bell, Volume2, Check, Navigation, ShieldCheck, Ticket,
  Radio, Home, Search, Clock, ChevronRight, Compass, CreditCard, ArrowRight, User as UserIcon
} from 'lucide-react';

import { FarmerLanding } from './FarmerLanding';
import { FarmerRegistration } from './FarmerRegistration';
import { FarmerDiscovery } from './FarmerDiscovery';
import { FarmerLiveQueue } from './FarmerLiveQueue';
import { FarmerTimeline } from './FarmerTimeline';
import { FarmerNotifications } from './FarmerNotifications';
import { FarmerBookingHistory } from './FarmerBookingHistory';
import { FarmerPaymentStatus } from './FarmerPaymentStatus';
import { FarmerProfile } from './FarmerProfile';

interface FarmerHomeProps {
  currentUser: User;
  currentLanguage: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
  onRefresh: () => void;
}

export type FarmerView =
  | 'JOURNEY_HOME'
  | 'LANDING'
  | 'REGISTRATION'
  | 'DISCOVERY'
  | 'LIVE_QUEUE'
  | 'TIMELINE'
  | 'PAYMENTS'
  | 'NOTIFICATIONS'
  | 'HISTORY'
  | 'PROFILE';

export const FarmerHome: React.FC<FarmerHomeProps> = ({ currentUser, currentLanguage, onSelectLanguage, onRefresh }) => {
  const t = translations[currentLanguage];
  const [currentView, setCurrentView] = useState<FarmerView>('JOURNEY_HOME');

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
  const handleOpenBookingModal = async (presetCentre?: any) => {
    setShowBookingModal(true);
    setBookingError(null);
    setAlternatives([]);
    try {
      const res = await fetch('/api/v1/centres');
      const data = await res.json();
      if (data.data) {
        setCentres(data.data);
        const target = presetCentre || data.data[0];
        if (target) {
          handleSelectCentre(target);
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
        setCurrentView('LIVE_QUEUE');
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

  const peopleAhead = activeBooking?.people_ahead ?? 3;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* INTEGRATED SINGLE HORIZONTAL FARMER NAVIGATION BAR */}
      <nav className="no-print" style={{ background: 'white', borderBottom: '1px solid var(--border-light)', padding: '0' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          
          <div style={{ display: 'flex', gap: '2px' }}>
            {[
              { id: 'JOURNEY_HOME', label: 'Home', icon: Home },
              { id: 'DISCOVERY', label: 'Find Centre', icon: Search },
              { id: 'HISTORY', label: 'Bookings', icon: Calendar },
              { id: 'LIVE_QUEUE', label: 'Live Queue', icon: Radio, isLive: true },
              { id: 'TIMELINE', label: 'Procurement', icon: FileText },
              { id: 'PAYMENTS', label: 'Payments', icon: CreditCard },
              { id: 'NOTIFICATIONS', label: 'Alerts', icon: Bell },
              { id: 'PROFILE', label: 'Profile', icon: UserIcon }
            ].map(navItem => {
              const Icon = navItem.icon;
              const isActive = currentView === navItem.id;

              return (
                <button
                  key={navItem.id}
                  onClick={() => setCurrentView(navItem.id as FarmerView)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 16px',
                    border: 'none',
                    background: isActive ? 'var(--mint-soft)' : 'transparent',
                    color: isActive ? 'var(--green-primary)' : 'var(--text-muted)',
                    borderBottom: isActive ? '2.5px solid var(--green-primary)' : '2.5px solid transparent',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? 'var(--green-primary)' : 'var(--text-muted)'} />
                  <span>{navItem.label}</span>
                  {navItem.isLive && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--green-primary)', fontWeight: 800, marginLeft: '2px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span className="live-dot" style={{ width: '5px', height: '5px' }} />
                      <span>Live</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, padding: '8px 0' }}>
            <span>Thanjavur Zone • Kharif 2026</span>
          </div>

        </div>
      </nav>

      {/* VIEW RENDER AREA */}
      <div style={{ flex: 1 }}>
        {currentView === 'LANDING' && (
          <FarmerLanding
            currentLanguage={currentLanguage}
            onStartRegistration={() => setCurrentView('REGISTRATION')}
            onDiscoverCentres={() => setCurrentView('DISCOVERY')}
            onViewLiveQueue={() => setCurrentView('LIVE_QUEUE')}
          />
        )}

        {currentView === 'REGISTRATION' && (
          <FarmerRegistration
            currentLanguage={currentLanguage}
            onComplete={(data) => setCurrentView('DISCOVERY')}
            onCancel={() => setCurrentView('JOURNEY_HOME')}
          />
        )}

        {currentView === 'DISCOVERY' && (
          <FarmerDiscovery
            currentLanguage={currentLanguage}
            onSelectCentre={(centre) => handleOpenBookingModal(centre)}
          />
        )}

        {currentView === 'LIVE_QUEUE' && (
          <FarmerLiveQueue
            activeBooking={activeBooking}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onCheckIn={handleCheckIn}
            onRefresh={() => {
              loadFarmerData();
              onRefresh();
            }}
          />
        )}

        {currentView === 'TIMELINE' && (
          <FarmerTimeline
            activeBooking={activeBooking}
            currentLanguage={currentLanguage}
            onViewReceipt={handleViewReceipt}
          />
        )}

        {currentView === 'PAYMENTS' && (
          <FarmerPaymentStatus
            activeBooking={activeBooking}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onViewReceipt={handleViewReceipt}
          />
        )}

        {currentView === 'NOTIFICATIONS' && (
          <FarmerNotifications
            notifications={notifications}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
          />
        )}

        {currentView === 'HISTORY' && (
          <FarmerBookingHistory
            bookings={bookings}
            currentLanguage={currentLanguage}
            onViewReceipt={handleViewReceipt}
            onTrackQueue={() => setCurrentView('LIVE_QUEUE')}
          />
        )}

        {currentView === 'PROFILE' && (
          <FarmerProfile
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage || (() => {})}
          />
        )}

        {/* MAIN FARMER ACTION HOME */}
        {currentView === 'JOURNEY_HOME' && (
          <div className="app-container" style={{ padding: '24px 20px 60px' }}>
            
            {/* HERO GREETING */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
                Good morning, {currentUser.name.split(' ')[0]}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
                Manage your procurement journey from booking to direct bank payment.
              </p>
            </div>

            {/* ONE INTEGRATED SECTION: YOUR NEXT PROCUREMENT */}
            {activeBooking ? (
              <div className="service-surface" style={{ padding: '28px', marginBottom: '24px', background: 'white' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                  <div>
                    <span className="badge badge-green" style={{ marginBottom: '6px' }}>YOUR NEXT PROCUREMENT</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                      {localizeCentreName(activeBooking.centre_name, currentLanguage)}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--green-primary)" />
                      <span>{localizeCentreAddress(activeBooking.centre_address, currentLanguage)}</span>
                    </p>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '8px' }}>
                      Date: {activeBooking.service_date} • Arrival: {activeBooking.slot_start_time} – {activeBooking.slot_end_time}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Virtual Token</span>
                    <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--green-primary)', lineHeight: 1 }}>
                      {activeBooking.token_no}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '4px' }}>
                      {peopleAhead} farmers ahead • ~{activeBooking.eta_minutes ?? 20} min wait
                    </div>
                    <span className="badge badge-amber" style={{ marginTop: '4px' }}>
                      Status: {localizeStatus(activeBooking.queue_state, currentLanguage)}
                    </span>
                  </div>
                </div>

                {/* Primary & Secondary Action Bar */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => setCurrentView('LIVE_QUEUE')} className="btn btn-primary" style={{ padding: '10px 20px', fontWeight: 700 }}>
                    <Radio size={16} />
                    <span>Track Live Queue</span>
                  </button>
                  <button onClick={() => setCurrentView('HISTORY')} className="btn btn-secondary" style={{ padding: '10px 18px' }}>
                    <span>View Booking Details</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* LIGHTWEIGHT HORIZONTAL QUICK ACTION ROW */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              <button onClick={() => handleOpenBookingModal()} className="btn btn-secondary" style={{ flex: 1, minWidth: '160px', justifyContent: 'flex-start', padding: '12px 16px' }}>
                <Calendar size={18} color="var(--green-primary)" />
                <span style={{ fontWeight: 700 }}>Book a Slot</span>
              </button>

              <button onClick={() => setCurrentView('DISCOVERY')} className="btn btn-secondary" style={{ flex: 1, minWidth: '160px', justifyContent: 'flex-start', padding: '12px 16px' }}>
                <Search size={18} color="var(--green-primary)" />
                <span style={{ fontWeight: 700 }}>Find a Centre</span>
              </button>

              <button onClick={() => setCurrentView('HISTORY')} className="btn btn-secondary" style={{ flex: 1, minWidth: '160px', justifyContent: 'flex-start', padding: '12px 16px' }}>
                <FileText size={18} color="var(--green-primary)" />
                <span style={{ fontWeight: 700 }}>My Bookings</span>
              </button>

              <button onClick={() => setCurrentView('TIMELINE')} className="btn btn-secondary" style={{ flex: 1, minWidth: '160px', justifyContent: 'flex-start', padding: '12px 16px' }}>
                <CreditCard size={18} color="var(--green-primary)" />
                <span style={{ fontWeight: 700 }}>Track Procurement & Payment</span>
              </button>
            </div>

            {/* ONE MAJOR CONNECTED PROGRESS JOURNEY LINE */}
            <div className="service-surface" style={{ padding: '24px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px' }}>
                Current Procurement Journey Progress
              </h3>

              <div className="journey-line-container">
                <div className="journey-track-line" />

                <div className="journey-step-node completed">
                  <div className="journey-step-circle">✓</div>
                  <span className="journey-step-label">BOOKED</span>
                </div>

                <div className="journey-step-node completed">
                  <div className="journey-step-circle">✓</div>
                  <span className="journey-step-label">TOKEN</span>
                </div>

                <div className="journey-step-node completed">
                  <div className="journey-step-circle">✓</div>
                  <span className="journey-step-label">ARRIVED</span>
                </div>

                <div className="journey-step-node active">
                  <div className="journey-step-circle">●</div>
                  <span className="journey-step-label">QUEUE (Current)</span>
                </div>

                <div className="journey-step-node">
                  <div className="journey-step-circle">5</div>
                  <span className="journey-step-label">PROCUREMENT</span>
                </div>

                <div className="journey-step-node">
                  <div className="journey-step-circle">6</div>
                  <span className="journey-step-label">PAYMENT</span>
                </div>
              </div>
            </div>

            {/* RECENT ALERTS LIST ROWS */}
            <div className="service-surface">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>Recent Alerts & Notifications</strong>
                <button onClick={() => setCurrentView('NOTIFICATIONS')} style={{ background: 'none', border: 'none', color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                  View All Notifications →
                </button>
              </div>

              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{localizeNotificationTitle(n.title, currentLanguage)}</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{localizeNotificationMessage(n.message, currentLanguage)}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="no-print" style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
        background: 'white',
        borderTop: '1px solid var(--border-light)',
        padding: '6px 0'
      }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {[
            { id: 'JOURNEY_HOME', label: 'Home', icon: Home },
            { id: 'DISCOVERY', label: 'Centres', icon: Search },
            { id: 'HISTORY', label: 'Bookings', icon: Calendar },
            { id: 'LIVE_QUEUE', label: 'Queue', icon: Radio },
            { id: 'TIMELINE', label: 'More', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as FarmerView)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? 'var(--green-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  padding: '4px 10px'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--green-primary)' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(16, 32, 26, 0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="service-surface" style={{ background: 'white', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: 800 }}>Reserve Procurement Slot</h3>
              <button onClick={() => setShowBookingModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>

            {bookingError && (
              <div style={{ background: 'var(--red-soft)', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.84rem', color: 'var(--red-primary)' }}>
                <strong>{bookingError}</strong>
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-dark)' }}>
                Select Procurement Centre
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {centres.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCentre(c)}
                    style={{
                      border: selectedCentre?.id === c.id ? '2px solid var(--green-primary)' : '1px solid var(--border-light)',
                      background: selectedCentre?.id === c.id ? 'var(--mint-soft)' : 'white',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>{localizeCentreName(c.name, currentLanguage)}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{localizeCentreAddress(c.address, currentLanguage)}</span>
                  </div>
                ))}
              </div>
            </div>

            {slotWindows.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-dark)' }}>
                  Select Arrival Window
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                  {slotWindows.map((slot) => {
                    const isFull = slot.status === 'FULL';
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--green-primary)' : '1px solid var(--border-light)',
                          background: isSelected ? 'var(--mint-soft)' : isFull ? 'var(--slate-100)' : 'white',
                          cursor: isFull ? 'not-allowed' : 'pointer',
                          opacity: isFull ? 0.5 : 1,
                          textAlign: 'center'
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                          {slot.start_time} - {slot.end_time}
                        </strong>
                        <span style={{ fontSize: '0.68rem', color: isFull ? 'var(--red-primary)' : 'var(--green-primary)' }}>
                          {isFull ? 'FULL' : `${slot.booked_farmer_count}/${slot.capacity_farmer_count} slots`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
                Expected Quantity (Quintals)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={expectedQty}
                onChange={(e) => setExpectedQty(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowBookingModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={!selectedSlot || isSubmittingBooking}
                className="btn btn-primary"
                style={{ padding: '9px 20px', fontWeight: 700 }}
              >
                {isSubmittingBooking ? 'Securing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL DIGITAL RECEIPT MODAL */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(16, 32, 26, 0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="service-surface" style={{ background: 'white', maxWidth: '540px', width: '100%', padding: '24px', borderRadius: '16px' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--slate-300)', paddingBottom: '14px', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800 }}>Procurement Receipt</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>REF: <strong>{selectedReceipt.receipt_ref}</strong></span>
                <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--green-primary)' }}>TOKEN: <strong>{selectedReceipt.token_no}</strong></span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', marginBottom: '14px' }}>
              <div><strong>Farmer:</strong> {selectedReceipt.farmer_name}</div>
              <div><strong>Centre:</strong> {localizeCentreName(selectedReceipt.centre_name, currentLanguage)}</div>
              <div><strong>Commodity:</strong> {localizeCommodity(selectedReceipt.commodity_name, currentLanguage)}</div>
              <div><strong>Date:</strong> {selectedReceipt.recorded_at}</div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '14px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>Gross Weight</span>
                <strong className="mono">{selectedReceipt.gross_weight_quintals} Qtl</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>Tare Weight</span>
                <strong className="mono" style={{ color: 'var(--text-muted)' }}>- {selectedReceipt.tare_weight_quintals} Qtl</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px solid var(--border-subtle)', marginTop: '4px' }}>
                <span>Net Payable Quantity</span>
                <strong className="mono" style={{ color: 'var(--green-primary)' }}>{selectedReceipt.final_payable_quantity} Qtl</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--slate-300)', marginTop: '6px', paddingTop: '6px', fontSize: '1.1rem', color: 'var(--green-dark)' }}>
                <strong>Net Payable Amount</strong>
                <strong className="mono">₹{selectedReceipt.net_amount?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }} className="no-print">
              <button onClick={() => window.print()} className="btn btn-secondary">
                Print
              </button>
              <button onClick={() => setSelectedReceipt(null)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
