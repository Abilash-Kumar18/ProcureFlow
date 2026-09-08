import React from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { Globe, Bell, User as UserIcon, RefreshCw, Check } from 'lucide-react';

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
    <header className="no-print" style={{ background: '#064e3b', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="app-container" style={{ padding: '10px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        
        {/* LEFT: ProcureFlow Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--green-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            P
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t.appTitle}
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#a7f3d0', marginTop: '1px' }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* RIGHT: Language Selector, Notifications, Farmer Profile & Persona */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          
          {/* Persona Selector (Demo Context) */}
          <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '3px', borderRadius: '8px', display: 'flex', gap: '2px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {personas.slice(0, 3).map((p) => {
              const isSelected = currentUser?.id === p.id;
              const shortRole = p.role === 'FARMER' ? 'Farmer' : p.role === 'OPERATOR' ? 'Operator' : 'Admin';

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
                  <span>{p.name.split(' ')[0]} ({shortRole})</span>
                  {isSelected && <Check size={11} />}
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
        </div>
      </div>
    </header>
  );
};
