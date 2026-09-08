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
    <div className="app-container" style={{ padding: '24px 24px 60px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
          {t.farmer.nav?.payments || 'Payment Status & DBT Direct Deposit'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          {currentLanguage === 'ta'
            ? 'அரசு குறைந்தபட்ச ஆதரவு விலை (MSP) தொகை உங்கள் வங்கிக் கணக்கில் நேரடியாக வரவு வைக்கப்படுவதை கண்காணிக்கவும்.'
            : currentLanguage === 'hi'
            ? 'अपने बैंक खाते में सीधे सरकारी न्यूनतम समर्थन मूल्य (MSP) भुगतान हस्तांतरण को ट्रैक करें।'
            : 'Track government Minimum Support Price (MSP) payment transfers directly to your bank account.'}
        </p>
      </div>

      {/* Main Payment Container (1 Unified Container) */}
      <div className="service-surface" style={{ padding: '24px', marginBottom: '24px' }}>
        
        {/* Status Header Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '4px' }}>
              {currentLanguage === 'ta' ? 'நேரடி வங்கிப் பரிமாற்றம் (DBT)' : currentLanguage === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT)' : 'DIRECT BENEFIT TRANSFER (DBT)'}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              {currentLanguage === 'ta' ? 'கொள்முதல் பணப்பரிவர்த்தனை விவரம்' : currentLanguage === 'hi' ? 'खरीद भुगतान सारांश' : 'Procurement Payment Summary'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ref: <strong className="mono">{paymentData.transactionRef}</strong> • {currentLanguage === 'ta' ? 'இன்று' : currentLanguage === 'hi' ? 'आज' : 'Today'}, 02:45 PM
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              {currentLanguage === 'ta' ? 'வழங்க வேண்டிய நிகர தொகை' : currentLanguage === 'hi' ? 'शुद्ध देय राशि' : 'Net Payable Amount'}
            </span>
            <div className="mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--green-primary)', lineHeight: 1 }}>
              ₹{paymentData.netPayable.toLocaleString('en-IN')}
            </div>
            <span className="badge badge-amber" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
              {currentLanguage === 'ta' ? 'நிலை: வங்கி பரிவர்த்தனை நடக்கிறது' : currentLanguage === 'hi' ? 'स्थिति: भुगतान प्रक्रियाधीन' : 'Status: Payment Processing'}
            </span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: 'var(--bg-main)', padding: '16px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
              {currentLanguage === 'ta' ? 'ஏற்றுக்கொள்ளப்பட்ட அளவு' : currentLanguage === 'hi' ? 'स्वीकृत मात्रा' : 'Accepted Quantity'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }} className="mono">{paymentData.acceptedQty} {t.common.quintals}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
              {currentLanguage === 'ta' ? 'MSP விலை (கிரேடு ஏ)' : currentLanguage === 'hi' ? 'एमएसपी दर (ग्रेड ए)' : 'MSP Rate (Grade A)'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }} className="mono">₹{paymentData.ratePerQuintal} / {t.common.quintals}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
              {currentLanguage === 'ta' ? 'மொத்த MSP மதிப்பு' : currentLanguage === 'hi' ? 'सकल एमएसपी मूल्य' : 'Gross MSP Value'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }} className="mono">₹{paymentData.grossAmount.toLocaleString('en-IN')}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
              {currentLanguage === 'ta' ? 'வரவு வங்கி' : currentLanguage === 'hi' ? 'गंतव्य बैंक' : 'Destination Bank'}
            </span>
            <strong style={{ fontSize: '0.92rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Landmark size={14} color="var(--green-primary)" />
              <span>{localizeBank(paymentData.bankName, currentLanguage)}</span>
            </strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>A/c: {paymentData.accountMasked}</span>
          </div>
        </div>

        {/* Continuous Step Timeline */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px' }}>
            {currentLanguage === 'ta' ? 'பணப்பரிமாற்ற காலவரிசை' : currentLanguage === 'hi' ? 'भुगतान प्रसंस्करण समयरेखा' : 'Payment Processing Timeline'}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                  {currentLanguage === 'ta' ? '1. கொள்முதல் & தரப் பரிசோதனை முடிந்தது' : currentLanguage === 'hi' ? '1. खरीद एवं गुणवत्ता सत्यापन संपन्न' : '1. Procurement & Quality Verification Completed'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentLanguage === 'ta' ? '19.5 குவிண்டால் நிகர எடை பிள்ளையார்பட்டி மையத்தில் சரிபார்க்கப்பட்டது' : currentLanguage === 'hi' ? 'पिल्लैयारपट्टी केंद्र पर 19.5 क्विंटल शुद्ध भार सत्यापित' : 'Net weight 19.5 Qtl verified at Pillaiyarpatti Centre'}
                </p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>11:45 AM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                  {currentLanguage === 'ta' ? '2. டிஜிட்டல் ரசீது உருவாக்கப்பட்டது' : currentLanguage === 'hi' ? '2. डिजिटल रसीद जारी' : '2. Digital Receipt Generated'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentLanguage === 'ta' ? 'அதிகாரப்பூர்வ ரசீது RCP-2026-0812 அதிகாரியால் கையொப்பமிடப்பட்டது' : currentLanguage === 'hi' ? 'आधिकारिक रसीद RCP-2026-0812 अधिकारी द्वारा हस्ताक्षरित' : 'Official receipt RCP-2026-0812 signed by officer'}
                </p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>11:52 AM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={20} color="var(--green-primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                  {currentLanguage === 'ta' ? '3. DBT வங்கி உத்தரவு தொடங்கப்பட்டது' : currentLanguage === 'hi' ? '3. डीबीटी भुगतान आदेश प्रारंभ' : '3. DBT Payment Order Initiated'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentLanguage === 'ta' ? 'கருவூல கட்டண கோப்பு அனுப்பப்பட்டது' : currentLanguage === 'hi' ? 'ट्रेजरी भुगतान बैच फ़ाइल जनरेट की गई' : 'Treasury payment batch file generated'}
                </p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>01:10 PM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--mint-soft)', border: '2px solid var(--green-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={12} color="var(--green-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--green-primary)' }}>
                  {currentLanguage === 'ta' ? '4. வங்கி பரிவர்த்தனை செயல்முறை (தற்போது)' : currentLanguage === 'hi' ? '4. बैंक क्लीयरिंग हाउस प्रसंस्करण (वर्तमान)' : '4. Bank Clearing House Processing (Current)'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentLanguage === 'ta' ? 'வங்கி வரவு உறுதிப்படுத்தலுக்காக காத்திருக்கிறது' : currentLanguage === 'hi' ? 'आरबीआई एनएसीएच सिस्टम से अंतिम जमा पुष्टि की प्रतीक्षा' : 'Awaiting final credit confirmation from RBI NACH system'}
                </p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--green-primary)', fontWeight: 700 }}>
                {currentLanguage === 'ta' ? 'நடவடிக்கையில்' : currentLanguage === 'hi' ? 'प्रक्रियाधीन' : 'In Progress'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>5</span>
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                  {currentLanguage === 'ta' ? '5. வங்கிக் கணக்கில் நேரடி வரவு' : currentLanguage === 'hi' ? '5. सीधा बैंक खाता जमा प्राप्त' : '5. Direct Bank Credit Received'}
                </strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentLanguage === 'ta' ? 'பதிவு செய்யப்பட்ட கைபேசிக்கு SMS உறுதிப்படுத்தல் அனுப்பப்படும்' : currentLanguage === 'hi' ? 'पंजीकृत मोबाइल नंबर पर एसएमएस पुष्टि भेजी जाएगी' : 'SMS confirmation sent to registered mobile number'}
                </p>
              </div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {currentLanguage === 'ta' ? 'அடுத்தது' : currentLanguage === 'hi' ? 'आगामी' : 'Upcoming'}
              </span>
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
              <span>{currentLanguage === 'ta' ? 'அதிகாரப்பூர்வ ரசீதை காண்க' : currentLanguage === 'hi' ? 'आधिकारिक रसीद देखें' : 'View Official Procurement Receipt'}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
