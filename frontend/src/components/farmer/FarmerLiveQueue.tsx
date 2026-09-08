import React from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations, localizeCentreName, localizeStatus, localizeCounter, localizeCommodity } from '../../i18n/translations';
import { playTokenCallChime } from '../../utils/audioAlert';
import { Radio, MapPin, Clock, Volume2, Navigation, RefreshCw, CheckCircle2 } from 'lucide-react';

interface FarmerLiveQueueProps {
  activeBooking: any;
  currentUser: User;
  currentLanguage: LanguageCode;
  onCheckIn: (bookingId: string) => void;
  onRefresh: () => void;
}

export const FarmerLiveQueue: React.FC<FarmerLiveQueueProps> = ({
  activeBooking,
  currentUser,
  currentLanguage,
  onCheckIn,
  onRefresh
}) => {
  const t = translations[currentLanguage];

  const peopleAhead = activeBooking?.people_ahead ?? 3;
  const etaMinutes = activeBooking?.eta_minutes ?? 20;
  const tokenNo = activeBooking?.token_no || 'TK-009';
  const servingToken = 'TK-008';

  return (
    <div className="app-container" style={{ padding: '24px 24px 60px' }}>
      
      {/* Real-time Status Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <div className="live-indicator">
              <div className="live-dot" />
              <span>{t.farmer.liveQueuePage?.liveQueueBadge || 'LIVE QUEUE'}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {t.farmer.liveQueuePage?.updatedAt || 'Real-time'}</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            {localizeCentreName(activeBooking?.centre_name || 'Pillaiyarpatti Primary Procurement Centre', currentLanguage)}
          </h2>
        </div>

        <button
          onClick={onRefresh}
          className="btn btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} />
          <span>{t.farmer.liveQueuePage?.refreshBtn || 'Refresh'}</span>
        </button>
      </div>

      {/* URGENT CALL ALERT (If CALLED state) */}
      {activeBooking?.queue_state === 'CALLED' && (
        <div style={{
          background: 'var(--amber-primary)',
          color: 'white',
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Volume2 size={24} />
            <div>
              <strong style={{ fontSize: '1.1rem', display: 'block' }}>
                {t.farmer.tokenIsCalled || 'Your Token is Called!'} {localizeCounter(activeBooking.assigned_counter_code, currentLanguage) || 'Counter 1 (Weighbridge Bay)'}
              </strong>
              <span style={{ fontSize: '0.82rem', opacity: 0.95 }}>{t.farmer.urgentAlert?.instructions || 'Guide your vehicle into the bay for gross weight measurement.'}</span>
            </div>
          </div>

          <button
            onClick={() => playTokenCallChime()}
            className="btn"
            style={{ background: 'white', color: 'var(--amber-primary)', fontWeight: 800, padding: '7px 16px', fontSize: '0.82rem' }}
          >
            {t.farmer.urgentAlert?.playChime || 'Play Chime'}
          </button>
        </div>
      )}

      {/* FOCUSED ELEGANT QUEUE DISPLAY SURFACE */}
      <div className="service-surface" style={{ padding: '32px', marginBottom: '24px', background: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', alignItems: 'center' }}>
          
          {/* Left: Your Token & People Ahead */}
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
              {t.farmer.liveQueuePage?.yourToken || 'YOUR VIRTUAL TOKEN'}
            </span>

            {/* Elegant Token Display */}
            <div className="mono" style={{ fontSize: 'clamp(2.8rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--green-dark)', lineHeight: 1, margin: '4px 0 14px' }}>
              {tokenNo}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>{peopleAhead}</span>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.farmer.liveQueuePage?.farmersAheadSuffix || 'farmers ahead of you'}</span>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--green-primary)', fontWeight: 700, marginTop: '4px' }}>
              {t.farmer.liveQueuePage?.estimatedWait || 'Estimated wait: ~'}{etaMinutes} {t.farmer.minutes}
            </div>
          </div>

          {/* Right: Currently Serving & Gate Check-in CTA */}
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              {t.farmer.liveQueuePage?.currentlyServing || 'Currently Serving at Bay'}
            </span>
            <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-dark)', margin: '4px 0 10px' }}>
              {servingToken}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              <span>{t.common.status}: <strong style={{ color: 'var(--green-primary)' }}>{localizeStatus(activeBooking?.queue_state || 'WAITING', currentLanguage)}</strong></span>
            </div>

            {activeBooking?.queue_state === 'BOOKED' && (
              <button
                onClick={() => onCheckIn(activeBooking.id)}
                className="btn btn-accent"
                style={{ width: '100%', padding: '11px', fontSize: '0.9rem', fontWeight: 700 }}
              >
                <Navigation size={16} />
                <span>{t.farmer.liveQueuePage?.checkInUponArrival || 'Check In Upon Arrival'}</span>
              </button>
            )}

            {activeBooking?.queue_state === 'WAITING' && (
              <div style={{ background: 'var(--mint-soft)', padding: '9px', borderRadius: '8px', color: 'var(--green-primary)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>{t.farmer.liveQueuePage?.checkedInGate || 'Checked in at gate. Please wait near bay.'}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* VISUAL QUEUE LINE STREAM */}
      <div className="service-surface" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px' }}>
          {t.farmer.liveQueuePage?.liveStreamTitle || 'Live Queue Stream Order'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          
          <div style={{ background: 'var(--slate-100)', border: '1px solid var(--slate-300)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <span className="badge badge-slate" style={{ fontSize: '0.6rem', marginBottom: '2px' }}>{t.farmer.liveQueuePage?.nowServingBadge || 'NOW SERVING'}</span>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-700)' }}>{servingToken}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>{localizeCounter('BAY-01', currentLanguage)}</span>
          </div>

          <div style={{ background: 'var(--mint-soft)', border: '1.5px solid var(--green-primary)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <span className="badge badge-green" style={{ fontSize: '0.6rem', marginBottom: '2px' }}>{t.farmer.liveQueuePage?.yourTokenBadge || 'YOUR TOKEN'}</span>
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--green-dark)' }}>{tokenNo}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--green-primary)', fontWeight: 700 }}>{currentUser.name}</span>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t.farmer.liveQueuePage?.upcomingBadge || 'UPCOMING'}</span>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>TK-010</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{localizeCommodity('Paddy', currentLanguage)} (18 {t.common.quintals})</span>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t.farmer.liveQueuePage?.upcomingBadge || 'UPCOMING'}</span>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>TK-011</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{localizeCommodity('Paddy', currentLanguage)} (25 {t.common.quintals})</span>
          </div>

        </div>
      </div>

    </div>
  );
};
