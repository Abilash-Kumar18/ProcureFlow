import React, { useState, useEffect } from 'react';
import { ProcureFlowLogo } from '../common/ProcureFlowLogo';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const statusMessages = [
    'Initializing Smart Queue State Engine...',
    'Connecting Metrology Calibrated Weighbridges...',
    'Syncing PFMS Direct Benefit Transfer Gateway...',
    'Department of Consumer Affairs • SIH 26032 Ready'
  ];

  useEffect(() => {
    const duration = 2400; // 2.4 seconds
    const intervalTime = 40;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 400);
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className="splash-container"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
      }}
    >
      <div className="splash-particles" />

      {/* Top Badge */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          color: '#e2e8f0',
          fontWeight: 600
        }}
      >
        <ShieldCheck size={16} color="#34d399" />
        <span>Smart Agriculture Procurement Platform</span>
      </div>

      {/* Center Logo with Rich Animation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10
        }}
      >
        <ProcureFlowLogo size={180} animated={true} textColor="#ffffff" />

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1rem',
            color: '#94a3b8',
            maxWidth: '440px',
            marginTop: '12px',
            letterSpacing: '0.02em',
            fontWeight: 500
          }}
        >
          Smart Procurement Centre Queue & Status Platform
        </p>

        {/* Status ticker */}
        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: '#34d399',
            fontFamily: "'JetBrains Mono', monospace",
            minHeight: '22px'
          }}
        >
          <Sparkles size={14} className="pulse-active" />
          <span>{statusMessages[statusIndex]}</span>
        </div>

        {/* Progress Bar */}
        <div className="splash-progress-track">
          <div
            className="splash-progress-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Bottom Skip Button */}
      <div style={{ position: 'absolute', bottom: '36px', zIndex: 10 }}>
        <button
          onClick={handleSkip}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <span>Continue to Portal</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
