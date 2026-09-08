import React from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { ProcureFlowLogo } from './ProcureFlowLogo';
import {
  ShieldCheck,
  RefreshCw,
  Award,
  Check,
  LogOut,
  Sprout,
  Building2,
  Landmark
} from 'lucide-react';

interface DemoHeaderProps {
  currentUser: User | null;
  personas: User[];
  onSelectPersona: (userId: string) => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onResetData: () => void;
  onLogout?: () => void;
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
  onLogout,
  isLiveConnected,
  isResetting
}) => {
  const t = translations[currentLanguage];

  return (
    <header className="no-print" style={{ background: '#090d16', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
      {/* Top Notification & Status Strip */}
      <div style={{ background: 'linear-gradient(90deg, #022c22 0%, #064e3b 40%, #0f172a 100%)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 0', fontSize: '0.78rem' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#34d399" />
              <span style={{ color: '#e2e8f0', fontWeight: 600, letterSpacing: '0.01em' }}>
                Smart Procurement Management Network
              </span>
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
      <div className="app-container" style={{ padding: '12px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        {/* Brand & Emblem Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ProcureFlowLogo size={42} showText={false} animated={true} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                PROCURE<span style={{ color: '#34d399' }}>FLOW</span>
              </h1>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: '2px' }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Demo Controls: Interactive Segmented Persona Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {/* Persona Switcher Buttons */}
          <div style={{ background: '#131b2e', padding: '4px', borderRadius: '14px', display: 'flex', gap: '4px', border: '1px solid #1e293b' }}>
            {personas.slice(0, 3).map((p) => {
              const isSelected = currentUser?.id === p.id;
              const RoleIcon = p.role === 'FARMER' ? Sprout : p.role === 'OPERATOR' ? Building2 : Landmark;

              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p.id)}
                  style={{
                    background: isSelected ? 'var(--emerald-primary)' : 'transparent',
                    color: isSelected ? 'white' : '#a7f3d0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 9px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RoleIcon size={14} />
                  <span>{p.name.split(' ')[0]}</span>
                  {isSelected && <Check size={13} />}
                </button>
              );
            })}
          </div>

          {/* Multilingual Selector */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.2)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', gap: '2px' }}>
            <button
              onClick={() => onSelectLanguage('en')}
              style={{
                background: currentLanguage === 'en' ? 'var(--green-primary)' : 'transparent',
                color: currentLanguage === 'en' ? 'white' : '#a7f3d0',
                border: 'none',
                borderRadius: '5px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => onSelectLanguage('hi')}
              style={{
                background: currentLanguage === 'hi' ? 'var(--green-primary)' : 'transparent',
                color: currentLanguage === 'hi' ? 'white' : '#a7f3d0',
                border: 'none',
                borderRadius: '5px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onSelectLanguage('ta')}
              style={{
                background: currentLanguage === 'ta' ? 'var(--green-primary)' : 'transparent',
                color: currentLanguage === 'ta' ? 'white' : '#a7f3d0',
                border: 'none',
                borderRadius: '5px',
                padding: '4px 8px',
                fontSize: '0.72rem',
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
              padding: '5px 9px',
              fontSize: '0.72rem',
              background: 'rgba(0, 0, 0, 0.2)',
              color: '#a7f3d0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px'
            }}
          >
            <RefreshCw size={12} className={isResetting ? 'pulse-active' : ''} />
            <span>{isResetting ? t.demoBar.resetting : t.demoBar.resetData}</span>
          </button>

          {/* Log out / Switch Authentication Portal */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Return to Authentication Portal"
              className="btn"
              style={{
                padding: '7px 12px',
                fontSize: '0.8rem',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.25)'
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
