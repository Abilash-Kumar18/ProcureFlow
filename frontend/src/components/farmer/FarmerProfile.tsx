import React from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations, localizeVillage, localizeBank } from '../../i18n/translations';
import { User as UserIcon, ShieldCheck, MapPin, Phone, CreditCard, Landmark, CheckCircle2 } from 'lucide-react';

interface FarmerProfileProps {
  currentUser: User;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const FarmerProfile: React.FC<FarmerProfileProps> = ({
  currentUser,
  currentLanguage,
  onSelectLanguage
}) => {
  const t = translations[currentLanguage];

  const profileData = {
    farmerId: (currentUser as any).farmer_profile_id || 'FMR-TN-2026-0812',
    name: currentUser.name,
    mobile: '+91 98421 77310',
    village: 'Pillaiyarpatti South',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    landQuotaTotal: 50.0, // Quintals
    landQuotaUsed: 20.0,
    landQuotaRemaining: 30.0,
    aadhaarMasked: '•••• •••• 9104',
    bankName: 'State Bank of India',
    ifsc: 'SBIN0001842',
    accountMasked: '•••• •••• 4892'
  };

  return (
    <div className="app-container" style={{ padding: '24px 20px 60px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
          Farmer Verified Profile
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Verified agricultural registration & quota details linked to Aadhaar DBT.
        </p>
      </div>

      {/* Main Single Profile Surface */}
      <div className="service-surface" style={{ padding: '24px', marginBottom: '24px' }}>
        
        {/* Top Profile Summary */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--mint-soft)',
              color: 'var(--green-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--green-primary)'
            }}>
              <UserIcon size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {profileData.name}
                </h3>
                <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={12} />
                  <span>VERIFIED</span>
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                ID: <strong className="mono">{profileData.farmerId}</strong> • {profileData.village}, {profileData.district}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Kharif 2026 Quota</span>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green-primary)', lineHeight: 1 }}>
              {profileData.landQuotaRemaining} / {profileData.landQuotaTotal} Qtl
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining Allocation</span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          <div style={{ background: 'var(--bg-main)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Mobile Number</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{profileData.mobile}</strong>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Aadhaar Status</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{profileData.aadhaarMasked} (Linked)</strong>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>DBT Bank Account</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{profileData.bankName} ({profileData.accountMasked})</strong>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Preferred Portal Language</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              {(['en', 'ta', 'hi'] as LanguageCode[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: currentLanguage === lang ? 700 : 500,
                    background: currentLanguage === lang ? 'var(--green-primary)' : 'var(--slate-200)',
                    color: currentLanguage === lang ? 'white' : 'var(--text-dark)',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
