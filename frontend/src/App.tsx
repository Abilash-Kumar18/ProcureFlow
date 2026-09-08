import React, { useState, useEffect } from 'react';
import { User, LanguageCode } from '../../shared/src/types';
import { DemoHeader } from './components/common/DemoHeader';
import { FarmerHome } from './components/farmer/FarmerHome';
import { OperatorConsole } from './components/operator/OperatorConsole';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { translations } from './i18n/translations';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'FARMER' | 'OPERATOR' | 'ADMIN'>('FARMER');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch demo personas on startup
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch('/api/v1/auth/personas');
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setPersonas(data.data);
          setCurrentUser(prev => {
            if (!prev) {
              const ramesh = data.data.find((u: User) => u.name.includes('Ramesh')) || data.data[0];
              setActiveTab(ramesh.role === 'DISTRICT_ADMIN' ? 'ADMIN' : ramesh.role as any);
              return ramesh;
            }
            const match = data.data.find((u: User) => u.id === prev.id);
            return match || prev;
          });
        }
      } catch (err) {
        console.error('Failed to load personas:', err);
      }
    };

    fetchPersonas();
  }, [refreshKey]);

  // Connect to SSE Live Event Stream
  useEffect(() => {
    const eventSource = new EventSource('/api/v1/stream/global');

    eventSource.onopen = () => {
      setIsLiveConnected(true);
    };

    eventSource.addEventListener('token_called', () => {
      setRefreshKey(prev => prev + 1);
    });

    eventSource.addEventListener('queue_updated', () => {
      setRefreshKey(prev => prev + 1);
    });

    eventSource.addEventListener('booking_created', () => {
      setRefreshKey(prev => prev + 1);
    });

    eventSource.addEventListener('procurement_completed', () => {
      setRefreshKey(prev => prev + 1);
    });

    eventSource.addEventListener('payment_status_changed', () => {
      setRefreshKey(prev => prev + 1);
    });

    eventSource.onerror = () => {
      setIsLiveConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Switch persona handler
  const handleSelectPersona = (userId: string) => {
    const selected = personas.find(p => p.id === userId);
    if (selected) {
      setCurrentUser(selected);
      setActiveTab(selected.role === 'DISTRICT_ADMIN' ? 'ADMIN' : selected.role as any);
      setRefreshKey(prev => prev + 1);
    }
  };

  // Reset database
  const handleResetData = async () => {
    if (!confirm('Reset ProcureFlow database to initial demo state?')) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/v1/admin/reset-demo-data', { method: 'POST' });
      if (res.ok) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const t = translations[currentLanguage];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Header */}
      <DemoHeader
        currentUser={currentUser}
        personas={personas}
        onSelectPersona={handleSelectPersona}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onResetData={handleResetData}
        isLiveConnected={isLiveConnected}
        isResetting={isResetting}
      />

      {/* Primary Role Selector Bar */}
      <div className="no-print" style={{ background: 'white', borderBottom: '1px solid var(--slate-200)', padding: '6px 0' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => {
                setActiveTab('FARMER');
                if (currentUser?.role !== 'FARMER') {
                  const farmer = personas.find(p => p.role === 'FARMER');
                  if (farmer) setCurrentUser(farmer);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'FARMER' ? 'var(--mint-soft)' : 'transparent',
                color: activeTab === 'FARMER' ? 'var(--green-dark)' : 'var(--slate-600)',
                borderBottom: activeTab === 'FARMER' ? '2px solid var(--green-primary)' : '2px solid transparent',
                fontWeight: activeTab === 'FARMER' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.roles.FARMER}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('OPERATOR');
                const op = personas.find(p => p.role === 'OPERATOR');
                if (op) setCurrentUser(op);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'OPERATOR' ? '#fffbeb' : 'transparent',
                color: activeTab === 'OPERATOR' ? '#b45309' : 'var(--slate-600)',
                borderBottom: activeTab === 'OPERATOR' ? '2px solid #b45309' : '2px solid transparent',
                fontWeight: activeTab === 'OPERATOR' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.roles.OPERATOR}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ADMIN');
                const admin = personas.find(p => p.role === 'DISTRICT_ADMIN');
                if (admin) setCurrentUser(admin);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'ADMIN' ? '#eef2ff' : 'transparent',
                color: activeTab === 'ADMIN' ? '#4338ca' : 'var(--slate-600)',
                borderBottom: activeTab === 'ADMIN' ? '2px solid #4338ca' : '2px solid transparent',
                fontWeight: activeTab === 'ADMIN' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.roles.DISTRICT_ADMIN}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            <span>{t.zoneTag}</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main style={{ flex: 1 }}>
        {currentUser && activeTab === 'FARMER' && (
          <FarmerHome
            key={`farmer-${currentUser.id}-${refreshKey}`}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}

        {currentUser && activeTab === 'OPERATOR' && (
          <OperatorConsole
            key={`operator-${currentUser.id}-${refreshKey}`}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}

        {currentUser && activeTab === 'ADMIN' && (
          <AdminDashboard
            key={`admin-${currentUser.id}-${refreshKey}`}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}
      </main>

      {/* Digital Service Footer */}
      <footer className="no-print" style={{ background: 'var(--slate-900)', color: 'var(--slate-400)', padding: '18px 0', borderTop: '1px solid var(--slate-800)', marginTop: 'auto' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
          <div>
            <strong style={{ color: 'white' }}>{t.appTitle}</strong> • {t.appSubtitle}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>{t.footerTagline}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
