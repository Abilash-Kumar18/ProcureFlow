import React from 'react';
import { LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import {
  ShieldCheck, Calendar, Clock, MapPin, Ticket, ArrowRight, CheckCircle2,
  TrendingUp, Users, Radio, AlertTriangle, FileText, Smartphone, ChevronRight
} from 'lucide-react';

interface FarmerLandingProps {
  currentLanguage: LanguageCode;
  onStartRegistration: () => void;
  onDiscoverCentres: () => void;
  onViewLiveQueue: () => void;
}

export const FarmerLanding: React.FC<FarmerLandingProps> = ({
  currentLanguage,
  onStartRegistration,
  onDiscoverCentres,
  onViewLiveQueue
}) => {
  const t = translations[currentLanguage];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        color: 'white',
        padding: '44px 0 56px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            
            {/* Left Hero Content */}
            <div>
              <span className="badge badge-green" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#a7f3d0', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '14px' }}>
                ProcureFlow Public Digital Service
              </span>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '14px' }}>
                Know when to arrive.<br />
                <span style={{ color: '#34d399' }}>Know where you stand.</span>
              </h1>

              <p style={{ fontSize: '1rem', color: '#a7f3d0', lineHeight: 1.5, maxWidth: '500px', marginBottom: '24px' }}>
                Book your procurement slot, track your queue position in real time, and stay informed from arrival to direct benefit transfer payment. Zero mandi gate queues.
              </p>

              {/* Hero Action CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={onStartRegistration}
                  className="btn btn-accent"
                  style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  <span>Register as Farmer</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onDiscoverCentres}
                  className="btn"
                  style={{ background: 'rgba(255, 255, 255, 0.12)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '12px 22px', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <MapPin size={16} />
                  <span>Find a Procurement Centre</span>
                </button>
              </div>
            </div>

            {/* Right Hero Process Card */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase' }}>
                  Procurement Journey Summary
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>LIVE SYSTEM</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="#34d399" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'white' }}>1. Slot Booking & Quota Lock</strong>
                    <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Select centre, date, and 2-hour arrival window</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Ticket size={18} color="#fbbf24" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'white' }}>2. Virtual Token Pass</strong>
                    <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Receive digital pass with token number (e.g. TK-009)</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <Radio size={18} color="#34d399" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.88rem', color: 'white' }}>3. Live Real-Time Queue</strong>
                      <span className="badge badge-green" style={{ fontSize: '0.6rem' }}>#12 Ahead</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Arrive on time with 0 gate waiting</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} color="#34d399" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'white' }}>4. Weighbridge & Direct Bank Payment</strong>
                    <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Digital receipt generated with direct bank credit</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <button
                  onClick={onViewLiveQueue}
                  className="btn"
                  style={{ width: '100%', background: 'var(--green-primary)', color: 'white', padding: '9px', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  <Radio size={14} />
                  <span>View Live Queue Demo</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW PROCUREFLOW WORKS */}
      <section style={{ padding: '40px 0', background: 'white', borderBottom: '1px solid var(--border-light)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 28px' }}>
            <span className="badge badge-green" style={{ marginBottom: '6px' }}>SIMPLE PROCESS</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>How ProcureFlow Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              Eliminating mandi congestion through predictable scheduling and live queue tracking.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { step: '01', title: 'Register', desc: 'Verified farmer profile' },
              { step: '02', title: 'Choose Centre', desc: 'Select nearest APMC mandi' },
              { step: '03', title: 'Book Slot', desc: 'Pick 2-hour arrival window' },
              { step: '04', title: 'Get Token', desc: 'Instant virtual token pass' },
              { step: '05', title: 'Track Queue', desc: 'Real-time countdown alerts' },
              { step: '06', title: 'Procurement', desc: 'Weighbridge & quality check' },
              { step: '07', title: 'Track Payment', desc: 'Direct Benefit Transfer' }
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--green-primary)', letterSpacing: '0.04em' }}>STEP {s.step}</span>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-dark)', marginTop: '2px' }}>{s.title}</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION SECTION */}
      <section style={{ padding: '40px 0', background: 'var(--bg-main)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 28px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              From Uncertain Waiting to Predictable Procurement
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              Solving real-world challenges faced by farmers at procurement centres.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* The Traditional Problem Card */}
            <div style={{ background: 'var(--red-soft)', border: '1px solid #fecaca', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red-primary)', marginBottom: '14px' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Traditional Procurement Challenges</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div>
                  <strong style={{ color: '#7f1d1d' }}>Long Waiting & Congestion:</strong>
                  <p style={{ color: '#991b1b', marginTop: '1px' }}>Farmers arrive without knowing how long they will wait, leading to overnight queues.</p>
                </div>
                <div>
                  <strong style={{ color: '#7f1d1d' }}>No Schedule Clarity:</strong>
                  <p style={{ color: '#991b1b', marginTop: '1px' }}>Procurement schedules and available daily mandi capacities are difficult to track.</p>
                </div>
                <div>
                  <strong style={{ color: '#7f1d1d' }}>Status Uncertainty:</strong>
                  <p style={{ color: '#991b1b', marginTop: '1px' }}>Farmers lack real-time visibility into quality acceptance and payment status.</p>
                </div>
              </div>
            </div>

            {/* The ProcureFlow Solution Card */}
            <div style={{ background: 'white', border: '1px solid var(--mint-subtle)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green-primary)', marginBottom: '14px' }}>
                <ShieldCheck size={20} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green-dark)' }}>ProcureFlow Solution</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Smart Time-Slot Booking:</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1px' }}>Reserve guaranteed 2-hour arrival windows matching centre weighbridge capacity.</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Real-Time Live Queue Tracking:</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1px' }}>Track your exact queue position (#12 ahead) and estimated wait time live on your phone.</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Transparent DBT Payments:</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1px' }}>Digital receipt generated at weighbridge with automated direct benefit transfer tracking.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
