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
  AlertCircle,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff
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
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic localization
  const t = translations[currentLanguage];
  const a = t.auth;

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

  // Password validation rules for Admin
  const hasCapitalLetter = /[A-Z]/.test(adminPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(adminPassword);
  const hasNumber = /[0-9]/.test(adminPassword);
  const hasAlphabet = /[a-zA-Z]/.test(adminPassword);

  // Handle Farmer OTP Login with validation
  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: Farmer Name required
    if (!farmerName.trim()) {
      setErrorMessage(a.errEnterName);
      return;
    }

    // Validation 2: Mobile number must be exactly 10 digits
    if (mobileNumber.length !== 10) {
      setErrorMessage(a.errMobile10);
      return;
    }

    // Validation 3: OTP must be 4 digits
    const enteredOtp = otpCode.join('');
    if (enteredOtp.length < 4) {
      setErrorMessage(a.errOtp4);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
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

  // Handle Admin Login with strict validation
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = adminEmail.trim();
    if (!emailTrimmed) {
      setErrorMessage(a.errAdminEmail);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage(a.errAdminEmailValid);
      return;
    }

    // Validation 1: At least 1 capital letter
    if (!hasCapitalLetter) {
      setErrorMessage(a.errPasswordCapital);
      return;
    }

    // Validation 2: At least 1 special character
    if (!hasSpecialChar) {
      setErrorMessage(a.errPasswordSpecial);
      return;
    }

    // Validation 3: At least 1 number
    if (!hasNumber) {
      setErrorMessage(a.errPasswordNumber);
      return;
    }

    // Validation 4: At least 1 alphabet
    if (!hasAlphabet) {
      setErrorMessage(a.errPasswordAlphabet);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const admin = personas.find(p => p.role === 'DISTRICT_ADMIN') || {
        id: 'admin-01',
        role: 'DISTRICT_ADMIN',
        name: emailTrimmed.split('@')[0].toUpperCase(),
        mobile: '9840011223',
        email: emailTrimmed,
        status: 'ACTIVE',
        district_id: 'dist-thanjavur',
        created_at: new Date().toISOString()
      };

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(admin);
      setIsLoading(false);
    }, 400);
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

        {/* Language Controls (English & Tamil) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.12)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button
              onClick={() => onSelectLanguage('en')}
              style={{
                background: currentLanguage === 'en' ? 'white' : 'transparent',
                color: currentLanguage === 'en' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentLanguage === 'en' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              English
            </button>
            <button
              onClick={() => onSelectLanguage('ta')}
              style={{
                background: currentLanguage === 'ta' ? 'white' : 'transparent',
                color: currentLanguage === 'ta' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentLanguage === 'ta' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              தமிழ்
            </button>
            <button
              onClick={() => onSelectLanguage('hi')}
              style={{
                background: currentLanguage === 'hi' ? 'white' : 'transparent',
                color: currentLanguage === 'hi' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentLanguage === 'hi' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              हिन्दी
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
              {a.portalTitle}
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
                <span>{a.farmerLoginTab}</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthRole('ADMIN'); setErrorMessage(null); }}
                className={`auth-tab-btn ${authRole === 'ADMIN' ? 'active-admin' : ''}`}
                style={{ fontSize: '0.9rem', padding: '11px 8px' }}
              >
                <Landmark size={18} />
                <span>{a.adminLoginTab}</span>
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
                    {a.farmerNameLabel}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      value={farmerName}
                      onChange={(e) => { setFarmerName(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder={a.farmerNamePlaceholder}
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
                    {a.mobileLabel}
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
                      placeholder={a.mobilePlaceholder}
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
                    <span>{a.mobileHelper}</span>
                    <span style={{ fontWeight: 700, color: mobileNumber.length === 10 ? 'var(--emerald-600)' : 'var(--slate-400)' }}>
                      {mobileNumber.length}/10
                    </span>
                  </div>
                </div>

                {/* 4-Digit OTP Input */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                      {a.otpLabel}
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
                    <span>{a.verifyingBtn}</span>
                  ) : (
                    <>
                      <span>{a.farmerSubmitBtn}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: DISTRICT ADMIN LOGIN FORM */}
            {authRole === 'ADMIN' && (
              <form onSubmit={handleAdminLogin} autoComplete="off">
                {/* Official Email Input */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    {a.adminEmailLabel}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="admin_login_email"
                      id="admin_login_email"
                      autoComplete="off"
                      value={adminEmail}
                      onChange={(e) => { setAdminEmail(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder={a.adminEmailPlaceholder}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.92rem',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                {/* Password Input with Strict Validation */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                    {a.adminPasswordLabel}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: '14px', color: 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="admin_login_password"
                      id="admin_login_password"
                      autoComplete="new-password"
                      value={adminPassword}
                      onChange={(e) => { setAdminPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
                      placeholder={a.adminPasswordPlaceholder}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--slate-200)',
                        fontSize: '0.95rem',
                        fontFamily: showPassword ? 'inherit' : "'JetBrains Mono', monospace"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Real-time Password Requirements Checklist */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    marginBottom: '20px',
                    fontSize: '0.76rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasCapitalLetter ? '#15803d' : 'var(--slate-500)', fontWeight: hasCapitalLetter ? 700 : 500 }}>
                    {hasCapitalLetter ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                    <span>{a.reqCapital}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecialChar ? '#15803d' : 'var(--slate-500)', fontWeight: hasSpecialChar ? 700 : 500 }}>
                    {hasSpecialChar ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                    <span>{a.reqSpecial}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasNumber ? '#15803d' : 'var(--slate-500)', fontWeight: hasNumber ? 700 : 500 }}>
                    {hasNumber ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                    <span>{a.reqNumber}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasAlphabet ? '#15803d' : 'var(--slate-500)', fontWeight: hasAlphabet ? 700 : 500 }}>
                    {hasAlphabet ? <CheckCircle2 size={13} color="#16a34a" /> : <XCircle size={13} color="#94a3b8" />}
                    <span>{a.reqAlphabet}</span>
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
                  {isLoading ? a.authenticatingBtn : a.adminSubmitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
