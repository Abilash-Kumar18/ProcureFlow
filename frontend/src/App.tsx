import React, { useState, useEffect } from 'react';
import { User, LanguageCode } from '../../shared/src/types';
import { DemoHeader } from './components/common/DemoHeader';
import { FarmerHome } from './components/farmer/FarmerHome';
import { translations } from './i18n/translations';
import confetti from 'canvas-confetti';
import { WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLiveConnected, setIsLiveConnected] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch demo farmer personas on startup
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch('/api/v1/auth/personas');
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          const farmerPersonas = data.data.filter((u: User) => u.role === 'FARMER');
          setPersonas(farmerPersonas.length > 0 ? farmerPersonas : data.data);
          setCurrentUser(prev => {
            if (!prev) {
              return farmerPersonas.find((u: User) => u.name.includes('Ramesh')) || farmerPersonas[0] || data.data[0];
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

    eventSource.addEventListener('token_called', () => setRefreshKey(prev => prev + 1));
    eventSource.addEventListener('queue_updated', () => setRefreshKey(prev => prev + 1));
    eventSource.addEventListener('booking_created', () => setRefreshKey(prev => prev + 1));
    eventSource.addEventListener('procurement_completed', () => setRefreshKey(prev => prev + 1));
    eventSource.addEventListener('payment_status_changed', () => setRefreshKey(prev => prev + 1));

    eventSource.onerror = () => {
      setIsLiveConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Switch farmer persona handler
  const handleSelectPersona = (userId: string) => {
    const selected = personas.find(p => p.id === userId);
    if (selected) {
      setCurrentUser(selected);
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
      
      {/* Offline PWA Banner */}
      {isOffline && (
        <div style={{ background: '#78350f', color: '#fef3c7', padding: '6px 16px', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 100 }}>
          <WifiOff size={14} />
          <span>You're offline. Showing the latest available cached procurement information.</span>
        </div>
      )}

      {/* Top Application Header */}
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

      {/* Main Farmer Experience View Area */}
      <main style={{ flex: 1 }}>
        {currentUser ? (
          <FarmerHome
            key={`farmer-${currentUser.id}-${refreshKey}`}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        ) : (
          <div className="app-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading farmer portal profile...</p>
          </div>
        )}
      </main>

      {/* Application Footer */}
      <footer className="no-print" style={{ background: '#064e3b', color: '#a7f3d0', padding: '16px 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 'auto' }}>
        <div className="app-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
          <div>
            <strong style={{ color: 'white' }}>{t.appTitle}</strong> • Smart Procurement Centre Queue & Status Platform
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>AgriTech Digital Public Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;

