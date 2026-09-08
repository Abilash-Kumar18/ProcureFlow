import React, { useState } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations, localizeStatus, localizeCentreName, localizeCentreAddress } from '../../i18n/translations';
import { FileText, Calendar, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface FarmerBookingHistoryProps {
  bookings: any[];
  currentLanguage: LanguageCode;
  onViewReceipt: (receiptRef: string) => void;
  onTrackQueue: () => void;
}

export const FarmerBookingHistory: React.FC<FarmerBookingHistoryProps> = ({
  bookings,
  currentLanguage,
  onViewReceipt,
  onTrackQueue
}) => {
  const t = translations[currentLanguage];
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'UPCOMING') return b.status === 'CONFIRMED' || b.queue_state === 'WAITING' || b.queue_state === 'BOOKED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="app-container" style={{ padding: '24px 20px 60px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          My Bookings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          View upcoming procurement appointments, digital receipts, and booking status.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {['UPCOMING', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              background: activeTab === tab ? 'var(--green-primary)' : 'white',
              color: activeTab === tab ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--slate-300)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: activeTab === tab ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {tab === 'UPCOMING' ? 'Upcoming Bookings' : tab === 'COMPLETED' ? 'Completed Receipts' : 'Cancelled'}
          </button>
        ))}
      </div>

      {/* CLEAN LIST ROWS */}
      <div className="service-surface">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div key={b.id} className="list-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-dark)' }}>{b.token_no}</span>
                  <span className={`badge ${b.status === 'COMPLETED' ? 'badge-green' : 'badge-amber'}`}>
                    {localizeStatus(b.queue_state || b.status, currentLanguage)}
                  </span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>REF: {b.booking_ref}</span>
                </div>

                <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                  {localizeCentreName(b.centre_name, currentLanguage)}
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {b.service_date} • {b.slot_start_time} - {b.slot_end_time}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {b.queue_state === 'WAITING' || b.queue_state === 'BOOKED' ? (
                  <button onClick={onTrackQueue} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <span>Track Live Queue</span>
                  </button>
                ) : null}

                {b.receipt_ref && (
                  <button onClick={() => onViewReceipt(b.receipt_ref)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    <FileText size={14} />
                    <span>Receipt ({b.receipt_ref})</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No bookings found in this category.
          </div>
        )}
      </div>

    </div>
  );
};
