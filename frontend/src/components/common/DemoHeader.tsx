import React, { useState } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { ProcureFlowLogo } from './ProcureFlowLogo';
import { Languages, User as UserIcon, RotateCcw, ChevronDown, Check, LogOut, ShieldCheck } from 'lucide-react';

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
  activeTab?: 'FARMER' | 'OPERATOR' | 'ADMIN';
  onSelectTab?: (tab: 'FARMER' | 'OPERATOR' | 'ADMIN') => void;
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
  isResetting,
  activeTab = 'FARMER',
  onSelectTab
}) => {
  const t = translations[currentLanguage];

  // Dropdown Toggle States
  const [showFarmerMenu, setShowFarmerMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const activeFarmerName = currentUser ? currentUser.name : 'Ramesh Kumar';

  return (
    <header className="no-print" style={{ background: '#064e3b', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="app-container" style={{ padding: '10px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', minHeight: '60px' }}>
        
        {/* LEFT: ProcureFlow Logo + Title & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ProcureFlowLogo size={70} showText={false} animated={false} />
          <div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              PROCURE<span style={{ color: '#34d399' }}>FLOW</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#a7f3d0', marginTop: '2px', fontWeight: 500 }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* RIGHT CONTROLS: Demo Farmer Selector, Language Dropdown, Reset, Logout */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          
          {/* 1. DEMO FARMER PROFILE DROPDOWN */}
          {personas.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowFarmerMenu(!showFarmerMenu);
                  setShowLangMenu(false);
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '7px',
                  padding: '6px 11px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserIcon size={14} color="#a7f3d0" />
                <span>{activeFarmerName}</span>
                <span style={{ fontSize: '0.65rem', background: '#047857', color: 'white', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {currentUser?.role === 'DISTRICT_ADMIN' ? 'Admin' : 'Farmer'}
                </span>
                <ChevronDown size={13} color="#a7f3d0" />
              </button>

              {showFarmerMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-hover)',
                  width: '200px',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.7rem', color: 'var(--slate-400)', borderBottom: '1px solid var(--slate-100)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Select Profile
                  </div>
                  {personas.slice(0, 4).map(p => {
                    const isSelected = currentUser?.id === p.id;

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPersona(p.id);
                          setShowFarmerMenu(false);
                        }}
                        style={{
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          color: 'var(--slate-900)',
                          fontWeight: isSelected ? 700 : 500,
                          background: isSelected ? 'var(--mint-soft, #ecfdf5)' : 'white',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{p.name}</span>
                        {isSelected && <Check size={14} color="#059669" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. LANGUAGE DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowFarmerMenu(false);
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '7px',
                padding: '6px 11px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Languages size={14} color="#a7f3d0" />
              <span>{currentLanguage === 'en' ? 'English' : currentLanguage === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
              <ChevronDown size={13} color="#a7f3d0" />
            </button>

            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                background: 'white',
                border: '1px solid var(--slate-200)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-hover)',
                width: '140px',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                <div
                  onClick={() => { onSelectLanguage('en'); setShowLangMenu(false); }}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: currentLanguage === 'en' ? 700 : 500, background: currentLanguage === 'en' ? '#ecfdf5' : 'white' }}
                >
                  English
                </div>
                <div
                  onClick={() => { onSelectLanguage('ta'); setShowLangMenu(false); }}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: currentLanguage === 'ta' ? 700 : 500, background: currentLanguage === 'ta' ? '#ecfdf5' : 'white' }}
                >
                  தமிழ்
                </div>
                <div
                  onClick={() => { onSelectLanguage('hi'); setShowLangMenu(false); }}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: currentLanguage === 'hi' ? 700 : 500, background: currentLanguage === 'hi' ? '#ecfdf5' : 'white' }}
                >
                  हिन्दी
                </div>
              </div>
            )}
          </div>

          {/* 3. RESET DEMO BUTTON */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to initial pristine state"
            className="btn"
            style={{
              padding: '6px 11px',
              fontSize: '0.78rem',
              background: 'rgba(0, 0, 0, 0.25)',
              color: '#a7f3d0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '7px'
            }}
          >
            <RotateCcw size={13} className={isResetting ? 'pulse-active' : ''} />
            <span>{isResetting ? t.demoBar.resetting : 'Reset Demo'}</span>
          </button>

          {/* 4. LOGOUT / SWITCH ACCOUNT */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Return to Authentication Portal"
              className="btn"
              style={{
                padding: '6px 11px',
                fontSize: '0.78rem',
                background: 'rgba(239, 68, 68, 0.18)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '7px'
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
