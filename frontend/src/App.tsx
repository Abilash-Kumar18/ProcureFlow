import React, { useState, useEffect } from 'react';
import { User, LanguageCode } from '../../shared/src/types';
import { DemoHeader } from './components/common/DemoHeader';
import { FarmerHome } from './components/farmer/FarmerHome';
import { OperatorConsole } from './components/operator/OperatorConsole';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { translations } from './i18n/translations';
import { Users, Building2, Shield, Radio, Volume2, Award, Sparkles } from 'lucide-react';
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
          const ramesh = data.data.find((u: User) => u.name.includes('Ramesh')) || data.data[0];
          setCurrentUser(ramesh);
          setActiveTab(ramesh.role === 'DISTRICT_ADMIN' ? 'ADMIN' : ramesh.role as any);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

      {/* Primary Role Navigation Floating Tabs */}
      <div className="no-print" style={{ background: 'white', borderBottom: '1px solid var(--slate-200)', padding: '12px 0' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '14px', gap: '4px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => {
                setActiveTab('FARMER');
                const farmer = personas.find(p => p.role === 'FARMER');
                if (farmer) setCurrentUser(farmer);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'FARMER' ? 'white' : 'transparent',
                color: activeTab === 'FARMER' ? 'var(--emerald-800)' : 'var(--slate-600)',
                fontWeight: activeTab === 'FARMER' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'FARMER' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🌾</span>
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
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'OPERATOR' ? 'white' : 'transparent',
                color: activeTab === 'OPERATOR' ? '#b45309' : 'var(--slate-600)',
                fontWeight: activeTab === 'OPERATOR' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'OPERATOR' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🏢</span>
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
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'ADMIN' ? 'white' : 'transparent',
                color: activeTab === 'ADMIN' ? '#4338ca' : 'var(--slate-600)',
                fontWeight: activeTab === 'ADMIN' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'ADMIN' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🏛️</span>
              <span>{t.roles.DISTRICT_ADMIN}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            <span>Thanjavur Agriculture Zone • Kharif KMS 2026</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main style={{ flex: 1, paddingTop: '24px' }}>
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

      {/* Enterprise Footer */}
      <footer className="no-print" style={{ background: '#090d16', color: 'var(--slate-400)', padding: '28px 0', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
          <div>
            <strong style={{ color: 'white' }}>ProcureFlow</strong> • Smart Procurement Centre Queue & Status Platform
            <span style={{ display: 'block', color: 'var(--slate-500)', marginTop: '3px' }}>
              Built for Smart India Hackathon 2026 • Ministry of Consumer Affairs, Food & Public Distribution
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>Zero Gate Queues • 100% Transparent DBT Payments</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
