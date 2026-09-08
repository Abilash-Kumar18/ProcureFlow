import React, { useState } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import { Languages, User as UserIcon, RotateCcw, ChevronDown, Check, Layers } from 'lucide-react';

interface DemoHeaderProps {
  currentUser: User | null;
  personas: User[];
  onSelectPersona: (userId: string) => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onResetData: () => void;
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
  isLiveConnected,
  isResetting,
  activeTab = 'FARMER',
  onSelectTab
}) => {
  const t = translations[currentLanguage];

  // Dropdown Toggle States
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showFarmerMenu, setShowFarmerMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const activeFarmerName = currentUser ? currentUser.name : 'Ramesh Kumar';

  return (
    <header className="no-print" style={{ background: '#064e3b', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="app-container" style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', minHeight: '64px' }}>
        
        {/* LEFT: Abstract Geometric "P" Logo + ProcureFlow Title & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'var(--green-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            P
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t.appTitle}
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '1px', fontWeight: 500 }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* RIGHT CONTROLS: Portal Switcher, Demo Farmer Selector, Language Dropdown, Reset */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          
          {/* 1. PORTAL SWITCHER DROPDOWN */}
          {onSelectTab && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowPortalMenu(!showPortalMenu);
                  setShowFarmerMenu(false);
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
                <Layers size={14} color="#a7f3d0" />
                <span>
                  {activeTab === 'FARMER' ? 'Farmer Portal' : activeTab === 'OPERATOR' ? 'Centre Operator Console' : 'District Admin Dashboard'}
                </span>
                <ChevronDown size={13} color="#a7f3d0" />
              </button>

              {showPortalMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-hover)',
                  width: '210px',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  <div
                    onClick={() => { onSelectTab('FARMER'); setShowPortalMenu(false); }}
                    style={{ padding: '9px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: activeTab === 'FARMER' ? 700 : 500, background: activeTab === 'FARMER' ? 'var(--mint-soft)' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>Farmer Portal</span>
                    {activeTab === 'FARMER' && <Check size={14} color="var(--green-primary)" />}
                  </div>

                  <div
                    onClick={() => { onSelectTab('OPERATOR'); setShowPortalMenu(false); }}
                    style={{ padding: '9px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: activeTab === 'OPERATOR' ? 700 : 500, background: activeTab === 'OPERATOR' ? '#fffbeb' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>Centre Operator Console</span>
                    {activeTab === 'OPERATOR' && <Check size={14} color="#b45309" />}
                  </div>

                  <div
                    onClick={() => { onSelectTab('ADMIN'); setShowPortalMenu(false); }}
                    style={{ padding: '9px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: activeTab === 'ADMIN' ? 700 : 500, background: activeTab === 'ADMIN' ? '#eef2ff' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>District Admin Dashboard</span>
                    {activeTab === 'ADMIN' && <Check size={14} color="#4338ca" />}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. DEMO FARMER PROFILE DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowFarmerMenu(!showFarmerMenu);
                setShowPortalMenu(false);
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
                width: '190px',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '6px 12px', fontSize: '0.7rem', color: 'var(--slate-400)', borderBottom: '1px solid var(--slate-100)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Select Demo Farmer
                </div>
                {personas.slice(0, 3).map(p => {
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
                        background: isSelected ? 'var(--mint-soft)' : 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{p.name}</span>
                      {isSelected && <Check size={14} color="var(--green-primary)" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. LANGUAGE DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowPortalMenu(false);
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
                  style={{ padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: currentLanguage === 'en' ? 700 : 500, background: currentLanguage === 'en' ? 'var(--mint-soft)' : 'white' }}
                >
                  English
                </div>
                <div
                  onClick={() => { onSelectLanguage('ta'); setShowLangMenu(false); }}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: currentLanguage === 'ta' ? 700 : 500, background: currentLanguage === 'ta' ? 'var(--mint-soft)' : 'white' }}
                >
                  தமிழ்
                </div>
                <div
                  onClick={() => { onSelectLanguage('hi'); setShowLangMenu(false); }}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--slate-900)', fontWeight: currentLanguage === 'hi' ? 700 : 500, background: currentLanguage === 'hi' ? 'var(--mint-soft)' : 'white' }}
                >
                  हिन्दी
                </div>
              </div>
            )}
          </div>

          {/* 4. RESET DEMO BUTTON */}
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

        </div>
      </div>
    </header>
  );
};
