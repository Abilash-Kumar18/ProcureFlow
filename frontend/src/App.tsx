import React, { useState, useEffect } from 'react';
import { User, LanguageCode } from '../../shared/src/types';
import { DemoHeader } from './components/common/DemoHeader';
import { FarmerHome } from './components/farmer/FarmerHome';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SplashScreen } from './components/splash/SplashScreen';
import { AuthPage } from './components/auth/AuthPage';
import { translations } from './i18n/translations';
import confetti from 'canvas-confetti';
import { WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSplashing, setIsSplashing] = useState<boolean>(true);
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

  // Handle successful login from AuthPage
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
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

  // 1. Initial Animated Splash Screen
  if (isSplashing) {
    return <SplashScreen onComplete={() => setIsSplashing(false)} />;
  }

  // 2. Authentication Page (when user has not logged in)
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

  // 3. Authenticated Dashboard (Farmer Home or Admin Dashboard)
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
        onLogout={handleLogout}
        isLiveConnected={isLiveConnected}
        isResetting={isResetting}
      />

      {/* Main Experience View Area */}
      <main style={{ flex: 1 }}>
        {currentUser.role === 'DISTRICT_ADMIN' ? (
          <AdminDashboard
            key={`admin-${currentUser.id}-${refreshKey}`}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        ) : (
          <FarmerHome
            key={`farmer-${currentUser.id}-${refreshKey}`}
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
