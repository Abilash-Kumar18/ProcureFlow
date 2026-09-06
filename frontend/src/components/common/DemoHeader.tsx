import React from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { ShieldCheck, RefreshCw, UserCheck, Languages, Activity, Building, Award, Check } from 'lucide-react';

interface DemoHeaderProps {
  currentUser: User | null;
  personas: User[];
  onSelectPersona: (userId: string) => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onResetData: () => void;
  isLiveConnected: boolean;
  isResetting: boolean;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  currentUser,
  personas,
  onSelectPersona,
  currentLanguage,
  onSelectLanguage,
  onResetData,
  isLiveConnected,
  isResetting
}) => {
  const t = translations[currentLanguage];

  return (
    <header className="no-print" style={{ background: '#090d16', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
      {/* Official Government of India & SIH Strip */}
      <div style={{ background: 'linear-gradient(90deg, #022c22 0%, #064e3b 40%, #0f172a 100%)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 0', fontSize: '0.78rem' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1rem' }}>🇮🇳</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600, letterSpacing: '0.01em' }}>
                {t.govtHeader}
              </span>
            </div>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6ee7b7', fontWeight: 700 }}>
              <Award size={13} />
              <span>{t.sihBadge}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Live SSE Network Pulse */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '2px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div className="live-dot" />
              <span style={{ color: isLiveConnected ? '#34d399' : '#fbbf24', fontWeight: 700, fontSize: '0.7rem' }}>
                {isLiveConnected ? t.realtimeConnected : t.fallbackSync}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="app-container" style={{ padding: '14px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        {/* Brand & Emblem Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 900,
            fontSize: '1.3rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {t.appTitle}
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>v2.4 PRO</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: '2px' }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Demo Controls: Interactive Segmented Persona Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          {/* Persona Switcher Buttons */}
          <div style={{ background: '#131b2e', padding: '4px', borderRadius: '14px', display: 'flex', gap: '4px', border: '1px solid #1e293b' }}>
            {personas.slice(0, 3).map((p) => {
              const isSelected = currentUser?.id === p.id;
              const roleIcon = p.role === 'FARMER' ? '🌾' : p.role === 'OPERATOR' ? '🏢' : '🏛️';
              const roleTitle = p.role === 'FARMER' ? 'Farmer' : p.role === 'OPERATOR' ? 'Operator' : 'Admin';

              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p.id)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--slate-400)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.4)' : 'none'
                  }}
                >
                  <span>{roleIcon}</span>
                  <span>{p.name.split(' ')[0]}</span>
                  {isSelected && <Check size={13} />}
                </button>
              );
            })}
          </div>

          {/* Multilingual Selector Pills */}
          <div style={{ display: 'flex', background: '#131b2e', padding: '4px', borderRadius: '12px', border: '1px solid #1e293b', gap: '2px' }}>
            <button
              onClick={() => onSelectLanguage('en')}
              style={{
                background: currentLanguage === 'en' ? '#334155' : 'transparent',
                color: currentLanguage === 'en' ? '#38bdf8' : 'var(--slate-400)',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 9px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              onClick={() => onSelectLanguage('hi')}
              style={{
                background: currentLanguage === 'hi' ? '#334155' : 'transparent',
                color: currentLanguage === 'hi' ? '#38bdf8' : 'var(--slate-400)',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 9px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onSelectLanguage('ta')}
              style={{
                background: currentLanguage === 'ta' ? '#334155' : 'transparent',
                color: currentLanguage === 'ta' ? '#38bdf8' : 'var(--slate-400)',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 9px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              தமிழ்
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to initial pristine state"
            className="btn"
            style={{
              padding: '7px 12px',
              fontSize: '0.8rem',
              background: '#1e293b',
              color: '#94a3b8',
              border: '1px solid #334155'
            }}
          >
            <RefreshCw size={14} className={isResetting ? 'pulse-active' : ''} />
            <span>{isResetting ? t.demoBar.resetting : t.demoBar.resetData}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
