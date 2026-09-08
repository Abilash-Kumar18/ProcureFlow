import React, { useState } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { ProcureFlowLogo } from '../common/ProcureFlowLogo';
import { translations } from '../../i18n/translations';
import {
  Lock,
  Smartphone,
  ArrowRight,
  User as UserIcon,
  Sprout,
  Landmark,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthPageProps {
  personas: User[];
  onLoginSuccess: (user: User) => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onReplaySplash: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  personas,
  onLoginSuccess,
  currentLanguage,
  onSelectLanguage,
  onReplaySplash
}) => {
  const [authRole, setAuthRole] = useState<'FARMER' | 'ADMIN'>('FARMER');

  // Farmer login state (initially empty)
  const [farmerName, setFarmerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);

  // Admin login state (initially empty)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = translations[currentLanguage];

  // Restrict mobile input to numbers only (0-9) and max 10 digits
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = rawValue.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(sanitized);
    if (errorMessage) setErrorMessage(null);
  };

  // OTP single digit handler (digits only)
  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otpCode];
    newOtp[index] = sanitized;
    setOtpCode(newOtp);

    // Auto-focus next input if filled
    if (sanitized && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP backspace auto-focus previous
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle Farmer OTP Login with validation
  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: Farmer Name required
    if (!farmerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // Validation 2: Mobile number must be exactly 10 digits
    if (mobileNumber.length !== 10) {
      setErrorMessage('Mobile number must be exactly 10 digits.');
      return;
    }

    // Validation 3: OTP must be 4 digits
    const enteredOtp = otpCode.join('');
    if (enteredOtp.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching farmer or construct user profile from inputs
      const existingFarmer = personas.find(p => p.role === 'FARMER');
      const authenticatedUser: User = {
        id: existingFarmer?.id || `user-farmer-${Date.now()}`,
        role: 'FARMER',
        name: farmerName.trim(),
        mobile: mobileNumber,
        status: 'ACTIVE',
        district_id: existingFarmer?.district_id || 'dist-thanjavur',
        preferred_language: currentLanguage,
        farmer_ref: existingFarmer?.farmer_ref || `FMR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        village: existingFarmer?.village || 'Thanjavur Zone',
        created_at: new Date().toISOString()
      };

      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      onLoginSuccess(authenticatedUser);
      setIsLoading(false);
    }, 400);
  };

  // Handle Admin Login with validation
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminEmail.trim()) {
      setErrorMessage('Please enter your administrative email.');
      return;
    }

    if (!adminKey.trim()) {
      setErrorMessage('Please enter your administrative security key.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const admin = personas.find(p => p.role === 'DISTRICT_ADMIN') || {
        id: 'admin-01',
        role: 'DISTRICT_ADMIN',
        name: adminEmail.split('@')[0].toUpperCase(),
        mobile: '9840011223',
        email: adminEmail,
        status: 'ACTIVE',
        district_id: 'dist-thanjavur',
        created_at: new Date().toISOString()
      };

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(admin);
      setIsLoading(false);
    }, 400);
  };

  // 1-Click Quick Demo Launcher
  const handleQuickDemo = (role: 'FARMER' | 'DISTRICT_ADMIN') => {
    const user = personas.find(p => p.role === role);
    if (user) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(user);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #09131d 0%, #064e3b 45%, #051b14 100%)',
        color: '#1e293b',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Waves and Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-120px',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Top Navbar */}
      <header
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          background: 'rgba(9, 19, 29, 0.6)',
          zIndex: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={onReplaySplash}
            title="Click to replay logo intro"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <ProcureFlowLogo size={36} showText={false} animated={true} />
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' }}>
              PROCURE<span style={{ color: '#34d399' }}>FLOW</span>
            </span>
          </div>
        </div>

        {/* Language Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.1)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button
              onClick={() => onSelectLanguage('en')}
              style={{
                background: currentLanguage === 'en' ? 'white' : 'transparent',
                color: currentLanguage === 'en' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '7px',
                padding: '4px 10px',
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
                background: currentLanguage === 'hi' ? 'white' : 'transparent',
                color: currentLanguage === 'hi' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '7px',
                padding: '4px 10px',
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
                background: currentLanguage === 'ta' ? 'white' : 'transparent',
                color: currentLanguage === 'ta' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '7px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Content Card */}
      <div
        className="app-container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 16px',
          zIndex: 10
        }}
      >
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Brand Logo & Header Center */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div
              onClick={onReplaySplash}
              style={{ cursor: 'pointer', display: 'inline-block' }}
              title="Click to replay logo animation"
            >
              <ProcureFlowLogo size={110} animated={true} textColor="#ffffff" />
            </div>
            <h1
              style={{
                color: 'white',
                fontSize: '1.6rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginTop: '8px'
              }}
            >
              Procurement Portal Access
            </h1>
          </div>

          {/* Authentication Card */}
          <div className="auth-glass-card" style={{ padding: '28px 32px' }}>
            {/* Role Switcher Tabs (Farmer & Admin Only) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: '#f1f5f9',
                padding: '5px',
                borderRadius: '16px',
                marginBottom: '22px',
                border: '1px solid #e2e8f0'
              }}
            >
              <button
                type="button"
                onClick={() => { setAuthRole('FARMER'); setErrorMessage(null); }}
                className={`auth-tab-btn ${authRole === 'FARMER' ? 'active-farmer' : ''}`}
                style={{ fontSize: '0.9rem', padding: '11px 8px' }}
              >
                <Sprout size={18} />
                <span>Farmer Login</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthRole('ADMIN'); setErrorMessage(null); }}
                className={`auth-tab-btn ${authRole === 'ADMIN' ? 'active-admin' : ''}`}
                style={{ fontSize: '0.9rem', padding: '11px 8px' }}
              >
                <Landmark size={18} />
                <span>Admin Login</span>
              </button>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={17} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: FARMER LOGIN FORM */}
            {authRole === 'FARMER' && (
              <form onSubmit={handleFarmerLogin}>
                {/* Farmer Name / Username */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Farmer Name / Username
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      value={farmerName}
                      onChange={(e) => { setFarmerName(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder="Enter your name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.95rem',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                {/* Mobile Number with Strict Numeric Validation */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Mobile Number (10 Digits)
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <Smartphone size={18} />
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={handleMobileChange}
                      placeholder="Enter 10-digit mobile number"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    <span>Numbers only (no letters or special characters)</span>
                    <span style={{ fontWeight: 700, color: mobileNumber.length === 10 ? 'var(--emerald-600)' : 'var(--slate-400)' }}>
                      {mobileNumber.length}/10
                    </span>
                  </div>
                </div>

                {/* 4-Digit OTP Simulation Input */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                      Enter 4-Digit OTP
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        placeholder="•"
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="otp-box"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  {isLoading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Enter Farmer Portal</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: DISTRICT ADMIN LOGIN FORM */}
            {authRole === 'ADMIN' && (
              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Official District Authority Email
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => { setAdminEmail(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder="e.g. collector@thanjavur.nic.in"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    Administrative Multi-Factor Key
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(e) => { setAdminKey(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder="Enter security key"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.95rem',
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(67, 56, 202, 0.35)'
                  }}
                >
                  {isLoading ? 'Authenticating...' : 'Access District Command Center'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
