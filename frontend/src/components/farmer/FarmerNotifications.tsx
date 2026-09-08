import React, { useState } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations, localizeNotificationTitle, localizeNotificationMessage, localizeChannel } from '../../i18n/translations';
import { Bell, Radio, Calendar, FileText, CreditCard } from 'lucide-react';

interface FarmerNotificationsProps {
  notifications: any[];
  currentUser: User;
  currentLanguage: LanguageCode;
}

export const FarmerNotifications: React.FC<FarmerNotificationsProps> = ({
  notifications,
  currentUser,
  currentLanguage
}) => {
  const t = translations[currentLanguage];
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredList = notifications.filter(n => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'QUEUE') return n.title.includes('Queue') || n.title.includes('Call') || n.title.includes('Check-in');
    if (selectedCategory === 'BOOKING') return n.title.includes('Booking') || n.title.includes('Slot');
    if (selectedCategory === 'PAYMENT') return n.title.includes('Payment') || n.title.includes('DBT') || n.title.includes('Receipt');
    return true;
  });

  return (
    <div className="app-container" style={{ padding: '24px 24px 60px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          {t.farmer.nav?.alerts || 'Notifications & Alerts'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          {currentLanguage === 'ta'
            ? 'SMS மற்றும் செயலி மூலம் அனுப்பப்பட்ட கொள்முதல் அறிவிப்புகள்.'
            : currentLanguage === 'hi'
            ? 'एसएमएस और ऐप सूचनाओं के माध्यम से प्राप्त खरीद अपडेट।'
            : 'Chronological procurement updates delivered via SMS and app notifications.'}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[
          { id: 'ALL', label: currentLanguage === 'ta' ? 'அனைத்து அறிவிப்புகள்' : currentLanguage === 'hi' ? 'सभी अलर्ट' : 'All Alerts' },
          { id: 'QUEUE', label: currentLanguage === 'ta' ? 'வரிசை & அழைப்பு' : currentLanguage === 'hi' ? 'कतार एवं कॉल अलर्ट' : 'Queue & Call Alerts' },
          { id: 'BOOKING', label: currentLanguage === 'ta' ? 'முன்பதிவுகள்' : currentLanguage === 'hi' ? 'बुकिंग्स' : 'Bookings' },
          { id: 'PAYMENT', label: currentLanguage === 'ta' ? 'DBT பணப்பரிமாற்றம்' : currentLanguage === 'hi' ? 'डीबीटी भुगतान' : 'DBT Payments' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              background: selectedCategory === cat.id ? 'var(--green-primary)' : 'white',
              color: selectedCategory === cat.id ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--slate-300)',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: selectedCategory === cat.id ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* CHRONOLOGICAL LIST ROWS */}
      <div className="service-surface">
        {filteredList.map((n) => (
          <div key={n.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                {localizeNotificationTitle(n.title, currentLanguage)}
              </strong>
              <span className="badge badge-slate" style={{ fontSize: '0.62rem' }}>
                {localizeChannel(n.channel, currentLanguage)}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {localizeNotificationMessage(n.message, currentLanguage)}
            </p>

            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '4px' }}>
              {t.farmer.deliveredTo} {(currentUser as any).mobile || '9876543210'} • 2026-09-07
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
