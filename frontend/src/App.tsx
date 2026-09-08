import React, { useState, useEffect } from 'react';
import { User, LanguageCode } from '../../shared/src/types';
import { DemoHeader } from './components/common/DemoHeader';
import { FarmerHome } from './components/farmer/FarmerHome';
import { OperatorConsole } from './components/operator/OperatorConsole';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SplashScreen } from './components/splash/SplashScreen';
import { AuthPage } from './components/auth/AuthPage';
import { translations } from './i18n/translations';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSplashing, setIsSplashing] = useState<boolean>(true);
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

  // Handle successful login from AuthPage
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab(user.role === 'DISTRICT_ADMIN' ? 'ADMIN' : user.role as any);
    if (user.preferred_language && ['en', 'hi', 'ta'].includes(user.preferred_language)) {
      setCurrentLanguage(user.preferred_language as LanguageCode);
    }
    setRefreshKey(prev => prev + 1);
  };

  // Handle Logout to return to Auth Portal
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Replay splash screen
  const handleReplaySplash = () => {
    setIsSplashing(true);
  };

  // Switch persona handler
  const handleSelectPersona = (userId: string) => {
    const selected = personas.find(p => p.id === userId);
    if (selected) {
      setCurrentUser(selected);
      setActiveTab(selected.role === 'DISTRICT_ADMIN' ? 'ADMIN' : selected.role as any);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleSelectTab = (tab: 'FARMER' | 'OPERATOR' | 'ADMIN') => {
    setActiveTab(tab);
    if (tab === 'FARMER') {
      const farmer = personas.find(p => p.role === 'FARMER');
      if (farmer) setCurrentUser(farmer);
    } else if (tab === 'OPERATOR') {
      const op = personas.find(p => p.role === 'OPERATOR');
      if (op) setCurrentUser(op);
    } else if (tab === 'ADMIN') {
      const admin = personas.find(p => p.role === 'DISTRICT_ADMIN');
      if (admin) setCurrentUser(admin);
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

  // 1. Initial Animated Splash Screen
  if (isSplashing) {
    return <SplashScreen onComplete={() => setIsSplashing(false)} />;
  }

  // 2. Authentication Page (when not logged in)
  if (!isAuthenticated || !currentUser) {
    return (
      <AuthPage
        personas={personas}
        onLoginSuccess={handleLoginSuccess}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onReplaySplash={handleReplaySplash}
      />
    );
  }

  // 3. Authenticated Main Dashboard
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Application Header */}
      <DemoHeader
        currentUser={currentUser}
        personas={personas}
        onSelectPersona={handleSelectPersona}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onResetData={handleResetData}
        onLogout={handleLogout}
        isLiveConnected={isLiveConnected}
        isResetting={isResetting}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

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

      {/* Application Footer */}
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
