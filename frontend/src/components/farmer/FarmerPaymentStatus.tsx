import React from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations, localizeCentreName, localizeCommodity, localizeBank } from '../../i18n/translations';
import { CreditCard, CheckCircle2, Clock, Landmark, FileCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface FarmerPaymentStatusProps {
  activeBooking: any | null;
  currentUser: User;
  currentLanguage: LanguageCode;
  onViewReceipt?: (receiptRef: string) => void;
}

export const FarmerPaymentStatus: React.FC<FarmerPaymentStatusProps> = ({
  activeBooking,
  currentUser,
  currentLanguage,
  onViewReceipt
}) => {
  const t = translations[currentLanguage];

  const paymentData = {
    receiptRef: 'RCP-2026-0812',
    acceptedQty: 19.5, // Quintals
    ratePerQuintal: 2275, // ₹/Qtl (Paddy Grade A MSP 2026)
    grossAmount: 44362.50,
    deductions: 0.00,
    netPayable: 44362.50,
    bankName: 'State Bank of India',
    accountMasked: '•••• •••• 4892',
    ifsc: 'SBIN0001842',
    paymentStatus: 'PROCESSING',
    transactionRef: 'DBT-TN-2026-981724',
    updatedAt: 'Today, 02:45 PM'
  };

  return (
    <div className="app-container" style={{ padding: '24px 20px 60px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
          Payment Status & DBT Direct Deposit
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Track government Minimum Support Price (MSP) payment transfers directly to your bank account.
        </p>
      </div>

      {/* Main Payment Container (1 Unified Container) */}
      <div className="service-surface" style={{ padding: '24px', marginBottom: '24px' }}>
        
        {/* Status Header Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '4px' }}>DIRECT BENEFIT TRANSFER (DBT)</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              Procurement Payment Summary
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ref: <strong className="mono">{paymentData.transactionRef}</strong> • Updated: {paymentData.updatedAt}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Net Payable Amount</span>
            <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--green-primary)', lineHeight: 1 }}>
              ₹{paymentData.netPayable.toLocaleString('en-IN')}
            </div>
            <span className="badge badge-amber" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
              Status: Payment Processing
            </span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: 'var(--bg-main)', padding: '16px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Accepted Quantity</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }} className="mono">{paymentData.acceptedQty} Quintals</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>MSP Rate (Grade A)</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }} className="mono">₹{paymentData.ratePerQuintal} / Qtl</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Gross MSP Value</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }} className="mono">₹{paymentData.grossAmount.toLocaleString('en-IN')}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Destination Bank</span>
            <strong style={{ fontSize: '0.92rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Landmark size={14} color="var(--green-primary)" />
              <span>{paymentData.bankName}</span>
            </strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>A/c: {paymentData.accountMasked}</span>
          </div>
        </div>

        {/* Continuous Step Timeline */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px' }}>
            Payment Processing Timeline
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>1. Procurement & Quality Verification Completed</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net weight 19.5 Qtl verified at Pillaiyarpatti Centre</p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>11:45 AM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>2. Digital Receipt Generated</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official receipt RCP-2026-0812 signed by officer</p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>11:52 AM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>3. DBT Payment Order Initiated</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Treasury payment batch file generated</p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>01:10 PM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--mint-soft)', border: '2px solid var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={12} color="var(--green-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--green-primary)' }}>4. Bank Clearing House Processing (Current)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting final credit confirmation from RBI NACH system</p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--green-primary)', fontWeight: 700 }}>In Progress</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>5</span>
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>5. Direct Bank Credit Received</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SMS confirmation sent to registered mobile number</p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Upcoming</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onViewReceipt && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onViewReceipt(paymentData.receiptRef)}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <FileCheck size={15} color="var(--green-primary)" />
              <span>View Official Procurement Receipt</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
