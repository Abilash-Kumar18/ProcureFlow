import React, { useState } from 'react';
import { LanguageCode } from '../../../../shared/src/types';
import { translations, localizeStatus } from '../../i18n/translations';
import { CheckCircle2, FileText, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface FarmerTimelineProps {
  activeBooking: any;
  currentLanguage: LanguageCode;
  onViewReceipt: (receiptRef: string) => void;
}

export const FarmerTimeline: React.FC<FarmerTimelineProps> = ({
  activeBooking,
  currentLanguage,
  onViewReceipt
}) => {
  const t = translations[currentLanguage];

  const timelineSteps = [
    { id: 1, title: 'Farmer Profile Registration', status: 'COMPLETED', time: '2026-09-01 10:15 AM', details: 'Aadhaar authenticated. Verified 4.5 Acres paddy cultivation in Pillaiyarpatti.' },
    { id: 2, title: 'Slot Reserved & Quota Locked', status: 'COMPLETED', time: '2026-09-06 04:30 PM', details: 'Reserved 11:00 – 13:00 window at Pillaiyarpatti Primary Procurement Centre for 20 Qtl Paddy.' },
    { id: 3, title: 'Virtual Token Pass Issued', status: 'COMPLETED', time: '2026-09-06 04:30 PM', details: 'Digital Pass issued with Virtual Token TK-009 (Booking Ref: BK-2026-0009).' },
    { id: 4, title: 'Mandi Gate Check-in', status: 'COMPLETED', time: '2026-09-07 10:52 AM', details: 'Checked in at Gate 1. Assigned queue position #12.' },
    { id: 5, title: 'Live Queue & Counter Call', status: 'COMPLETED', time: '2026-09-07 11:34 AM', details: 'Called to Counter 1 (Weighbridge Bay) after dynamic queue countdown.' },
    { id: 6, title: 'Grain Quality Inspection', status: 'COMPLETED', time: '2026-09-07 11:40 AM', details: 'Grade A Paddy accepted. Moisture reading: 13.5% (Within 17% standard).' },
    { id: 7, title: 'Weighbridge Gross & Tare Measurement', status: 'COMPLETED', time: '2026-09-07 11:48 AM', details: 'Gross Weight: 22.5 Qtl | Vehicle Tare Weight: 2.5 Qtl | Net Payable Weight: 20.0 Qtl.' },
    { id: 8, title: 'Official Digital Receipt Generated', status: 'COMPLETED', time: '2026-09-07 11:52 AM', details: 'Receipt PR-2026-0009 generated. Net Payable Value: ₹46,400 (MSP ₹2,320/Qtl).' },
    { id: 9, title: 'Direct Benefit Transfer (DBT) Payment Processing', status: 'IN_PROGRESS', time: '2026-09-07 12:05 PM', details: 'PFMS payment file transmitted to State Bank of India (SBIN*****4821). Bank Ref: DBT-PFMS-TN-98124.' },
    { id: 10, title: 'Bank Payment Credited', status: 'UPCOMING', time: 'Expected within 24 Hours', details: 'Direct Bank Transfer credit to farmer account.' }
  ];

  return (
    <div className="app-container" style={{ padding: '24px 20px 60px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          Procurement & Payment Status
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          One continuous transparency timeline from registration to Direct Benefit Transfer bank payment.
        </p>
      </div>

      {/* Summary Highlights Surface */}
      <div style={{ background: 'var(--green-dark)', color: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>Commodity</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Paddy (Grade A)</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>Accepted Weight</span>
            <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>20.0 Quintals</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>MSP Rate</span>
            <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>₹2,320 / Qtl</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>Net Payable Value</span>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>₹46,400</div>
          </div>
        </div>
      </div>

      {/* ONE CONTINUOUS TIMELINE (NOT INDIVIDUAL CARDS) */}
      <div className="service-surface" style={{ padding: '24px 28px' }}>
        <div className="timeline-continuous">
          {timelineSteps.map((step) => {
            const isCompleted = step.status === 'COMPLETED';
            const isInProgress = step.status === 'IN_PROGRESS';

            return (
              <div key={step.id} className={`timeline-item ${isCompleted ? 'completed' : isInProgress ? 'active' : ''}`}>
                <div className="timeline-marker">
                  {isCompleted ? '✓' : step.id}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-dark)' }}>{step.title}</strong>
                    <span className={`badge ${isCompleted ? 'badge-green' : isInProgress ? 'badge-amber' : 'badge-slate'}`} style={{ fontSize: '0.62rem' }}>
                      {isCompleted ? 'Completed' : isInProgress ? 'Processing' : 'Upcoming'}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {step.time}
                  </span>

                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '4px', lineHeight: 1.4 }}>
                    {step.details}
                  </p>

                  {step.id === 8 && (
                    <button
                      onClick={() => onViewReceipt('PR-2026-0009')}
                      className="btn btn-secondary"
                      style={{ marginTop: '8px', padding: '5px 12px', fontSize: '0.78rem' }}
                    >
                      <FileText size={14} />
                      <span>View Receipt (PR-2026-0009)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
