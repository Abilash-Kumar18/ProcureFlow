import React, { useState } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { CheckCircle2, UserCheck, MapPin, Globe, ShieldCheck, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FarmerRegistrationProps {
  currentLanguage: LanguageCode;
  onComplete: (farmerData: any) => void;
  onCancel: () => void;
}

export const FarmerRegistration: React.FC<FarmerRegistrationProps> = ({
  currentLanguage,
  onComplete,
  onCancel
}) => {
  const t = translations[currentLanguage];
  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    aadhaarRef: 'XXXX-XXXX-4812',
    village: 'Pillaiyarpatti South',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    language: currentLanguage,
    commodity: 'Paddy (Grade A)',
    landAreaAcres: '4.5',
    expectedQty: 20,
    bankName: 'State Bank of India',
    bankAccountRef: 'SBIN*****4821'
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else if (step === 5) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setStep(6);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="app-container" style={{ padding: '24px 20px 60px', maxWidth: '780px', margin: '0 auto' }}>
      
      {/* Registration Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          Farmer Registration
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          Complete your profile registration to reserve procurement slots and receive virtual tokens.
        </p>
      </div>

      {/* Progress Indicator Steps Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14px', left: '20px', right: '20px', height: '2px', background: 'var(--slate-200)', zIndex: 0 }} />
        
        {[
          { num: 1, label: 'Details' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Language' },
          { num: 4, label: 'Crop' },
          { num: 5, label: 'Review' },
          { num: 6, label: 'Complete' }
        ].map((s) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;

          return (
            <div key={s.num} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: isDone ? 'var(--green-primary)' : isCurrent ? 'white' : 'var(--slate-100)',
                border: isDone ? '2px solid var(--green-primary)' : isCurrent ? '2px solid var(--green-primary)' : '2px solid var(--slate-300)',
                color: isDone ? 'white' : isCurrent ? 'var(--green-primary)' : 'var(--slate-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem',
                transition: 'all 0.15s ease'
              }}>
                {isDone ? <Check size={14} /> : s.num}
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--text-dark)' : 'var(--text-muted)' }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Wizard Surface */}
      <div className="service-surface" style={{ padding: '28px', background: 'white' }}>
        
        {/* STEP 1: FARMER DETAILS */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Step 1: Farmer Personal Details
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Enter your basic identity details to verify your profile.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
                  Full Name (as per Revenue Land Passbook) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
                  Mobile Number (for SMS queue alerts) *
                </label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>
                  Aadhaar Reference Number *
                </label>
                <input
                  type="text"
                  value={formData.aadhaarRef}
                  onChange={(e) => setFormData({ ...formData, aadhaarRef: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION / LOCALITY */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Step 2: Locality & Village Details
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Used to discover the nearest procurement centre.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>District / Zone</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>Village / Locality</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREFERRED LANGUAGE */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Step 3: Preferred Language
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Choose the language for SMS updates and digital receipts.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              {[
                { code: 'en', name: 'English', sub: 'Default System Language' },
                { code: 'ta', name: 'தமிழ் (Tamil)', sub: 'மண்டல விவசாய மொழி' },
                { code: 'hi', name: 'हिन्दी (Hindi)', sub: 'राजभाषा' }
              ].map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => setFormData({ ...formData, language: lang.code as LanguageCode })}
                  style={{
                    border: formData.language === lang.code ? '2px solid var(--green-primary)' : '1px solid var(--slate-200)',
                    background: formData.language === lang.code ? 'var(--mint-soft)' : 'white',
                    padding: '14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-dark)' }}>{lang.name}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>{lang.sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CROP & BANK DETAILS */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Step 4: Crop & Bank DBT Details
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Verify your crop commodity and bank account for Direct Benefit Transfer.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>Commodity</label>
                <input
                  type="text"
                  disabled
                  value="Paddy (Grade A) • MSP ₹2,320/Quintal"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: 'var(--slate-100)', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>Cultivated Area (Acres)</label>
                  <input
                    type="text"
                    value={formData.landAreaAcres}
                    onChange={(e) => setFormData({ ...formData, landAreaAcres: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-dark)' }}>Expected Produce (Qtl)</label>
                  <input
                    type="number"
                    value={formData.expectedQty}
                    onChange={(e) => setFormData({ ...formData, expectedQty: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
              Step 5: Review Registration
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Review your details before confirming registration.
            </p>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
              <div><strong>Farmer Name:</strong> {formData.name}</div>
              <div><strong>Mobile:</strong> {formData.mobile}</div>
              <div><strong>Village:</strong> {formData.village}</div>
              <div><strong>District:</strong> {formData.district} ({formData.state})</div>
              <div><strong>Commodity:</strong> {formData.commodity}</div>
              <div><strong>Expected Produce:</strong> {formData.expectedQty} Qtl</div>
              <div><strong>Bank Account:</strong> {formData.bankAccountRef}</div>
              <div><strong>Language:</strong> {formData.language.toUpperCase()}</div>
            </div>
          </div>
        )}

        {/* STEP 6: COMPLETE */}
        {step === 6 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--mint-soft)', color: 'var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <ShieldCheck size={30} />
            </div>

            <span className="badge badge-green" style={{ marginBottom: '6px' }}>VERIFIED</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              Registration Complete
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '4px auto 20px' }}>
              Your profile is verified. You can now discover mandi centres and book procurement slots.
            </p>

            <button
              onClick={() => onComplete(formData)}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              <span>Proceed to Centre Discovery</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Action Controls Footer */}
        {step < 6 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={step === 1 ? onCancel : handlePrev}
              className="btn btn-secondary"
            >
              <ArrowLeft size={14} />
              <span>{step === 1 ? 'Cancel' : 'Back'}</span>
            </button>

            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: '9px 20px' }}
            >
              <span>{step === 5 ? 'Confirm & Register' : 'Continue'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
