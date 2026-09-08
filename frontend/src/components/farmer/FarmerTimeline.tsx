import React, { useState } from 'react';
import { LanguageCode } from '../../../../shared/src/types';
import { translations, localizeStatus, localizeCommodity } from '../../i18n/translations';
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
    {
      id: 1,
      title: currentLanguage === 'ta' ? 'விவசாயி சுயவிவர பதிவு' : currentLanguage === 'hi' ? 'किसान प्रोफ़ाइल पंजीकरण' : 'Farmer Profile Registration',
      status: 'COMPLETED',
      time: '2026-09-01 10:15 AM',
      details: currentLanguage === 'ta' ? 'ஆதார் சரிபார்க்கப்பட்டது. பிள்ளையார்பட்டியில் 4.5 ஏக்கர் நெல் சாகுபடி உறுதி செய்யப்பட்டது.' : currentLanguage === 'hi' ? 'आधार प्रमाणीकृत। पिल्लैयारपट्टी में 4.5 एकड़ धान की खेती सत्यापित।' : 'Aadhaar authenticated. Verified 4.5 Acres paddy cultivation in Pillaiyarpatti.'
    },
    {
      id: 2,
      title: currentLanguage === 'ta' ? 'ஸ்லாட் ஒதுக்கீடு & முன்பதிவு' : currentLanguage === 'hi' ? 'स्लॉट आरक्षित एवं कोटा सुरक्षित' : 'Slot Reserved & Quota Locked',
      status: 'COMPLETED',
      time: '2026-09-06 04:30 PM',
      details: currentLanguage === 'ta' ? 'பிள்ளையார்பட்டி கொள்முதல் நிலையத்தில் 20 குவிண்டால் நெல்லுக்கு 11:00 – 13:00 ஸ்லாட் ஒதுக்கப்பட்டது.' : currentLanguage === 'hi' ? 'पिल्लैयारपट्टी खरीद केंद्र में 20 क्विंटल धान हेतु 11:00 – 13:00 विंडो आरक्षित।' : 'Reserved 11:00 – 13:00 window at Pillaiyarpatti Primary Procurement Centre for 20 Qtl Paddy.'
    },
    {
      id: 3,
      title: currentLanguage === 'ta' ? 'டிஜிட்டல் பாஸ் & டோக்கன் வழங்கப்பட்டது' : currentLanguage === 'hi' ? 'वर्चुअल टोकन पास जारी' : 'Virtual Token Pass Issued',
      status: 'COMPLETED',
      time: '2026-09-06 04:30 PM',
      details: currentLanguage === 'ta' ? 'TK-009 என்ற டோக்கன் எண்ணுடன் டிஜிட்டல் பாஸ் வழங்கப்பட்டது (Ref: BK-2026-0009).' : currentLanguage === 'hi' ? 'वर्चुअल टोकन TK-009 (बुकिंग संदर्भ: BK-2026-0009) के साथ डिजिटल पास जारी किया गया।' : 'Digital Pass issued with Virtual Token TK-009 (Booking Ref: BK-2026-0009).'
    },
    {
      id: 4,
      title: currentLanguage === 'ta' ? 'மண்டி வாயில் செக்-இன்' : currentLanguage === 'hi' ? 'मंडी गेट चेक-इन' : 'Mandi Gate Check-in',
      status: 'COMPLETED',
      time: '2026-09-07 10:52 AM',
      details: currentLanguage === 'ta' ? 'வாயில் 1-ல் செக்-இன் செய்யப்பட்டது. வரிசை நிலை #12 ஒதுக்கப்பட்டது.' : currentLanguage === 'hi' ? 'गेट 1 पर चेक-इन किया गया। कतार स्थिति #12 आवंटित।' : 'Checked in at Gate 1. Assigned queue position #12.'
    },
    {
      id: 5,
      title: currentLanguage === 'ta' ? 'நேரடி வரிசை அழைப்பு' : currentLanguage === 'hi' ? 'लाइव कतार एवं काउंटर कॉल' : 'Live Queue & Counter Call',
      status: 'COMPLETED',
      time: '2026-09-07 11:34 AM',
      details: currentLanguage === 'ta' ? 'எடை மேடை கவுண்டர் 1-க்கு அழைக்கப்பட்டது.' : currentLanguage === 'hi' ? 'वे-ब्रिज काउंटर 1 पर बुलाया गया।' : 'Called to Counter 1 (Weighbridge Bay) after dynamic queue countdown.'
    },
    {
      id: 6,
      title: currentLanguage === 'ta' ? 'நெல் தரப் பரிசோதனை' : currentLanguage === 'hi' ? 'अनाज गुणवत्ता निरीक्षण' : 'Grain Quality Inspection',
      status: 'COMPLETED',
      time: '2026-09-07 11:40 AM',
      details: currentLanguage === 'ta' ? 'கிரேடு ஏ நெல் ஏற்றுக்கொள்ளப்பட்டது. ஈரப்பதம்: 13.5% (அனுமதிக்கப்பட்ட வரம்பு 17%).' : currentLanguage === 'hi' ? 'ग्रेड ए धान स्वीकृत। नमी रीडिंग: 13.5% (17% मानक के भीतर)।' : 'Grade A Paddy accepted. Moisture reading: 13.5% (Within 17% standard).'
    },
    {
      id: 7,
      title: currentLanguage === 'ta' ? 'எடை மேடை மொத்த & வாகன எடை' : currentLanguage === 'hi' ? 'वे-ब्रिज सकल एवं टेयर माप' : 'Weighbridge Gross & Tare Measurement',
      status: 'COMPLETED',
      time: '2026-09-07 11:48 AM',
      details: currentLanguage === 'ta' ? 'மொத்த எடை: 22.5 குவிண்டால் | வாகன எடை: 2.5 குவிண்டால் | நிகர அளவு: 20.0 குவிண்டால்.' : currentLanguage === 'hi' ? 'सकल भार: 22.5 क्विंटल | खाली वाहन भार: 2.5 क्विंटल | शुद्ध देय भार: 20.0 क्विंटल।' : 'Gross Weight: 22.5 Qtl | Vehicle Tare Weight: 2.5 Qtl | Net Payable Weight: 20.0 Qtl.'
    },
    {
      id: 8,
      title: currentLanguage === 'ta' ? 'டிஜிட்டல் கொள்முதல் ரசீது வழங்கப்பட்டது' : currentLanguage === 'hi' ? 'आधिकारिक डिजिटल रसीद जारी' : 'Official Digital Receipt Generated',
      status: 'COMPLETED',
      time: '2026-09-07 11:52 AM',
      details: currentLanguage === 'ta' ? 'ரசீது PR-2026-0009 உருவாக்கப்பட்டது. மொத்த தொகை: ₹46,400 (MSP ₹2,320/குவிண்டால்).' : currentLanguage === 'hi' ? 'रसीद PR-2026-0009 जारी। शुद्ध देय राशि: ₹46,400 (एमएसपी ₹2,320/क्विंटल)।' : 'Receipt PR-2026-0009 generated. Net Payable Value: ₹46,400 (MSP ₹2,320/Qtl).'
    },
    {
      id: 9,
      title: currentLanguage === 'ta' ? 'நேரடி வங்கி வரவு (DBT) செயல்முறை' : currentLanguage === 'hi' ? 'प्रत्यक्ष लाभ अंतरण (DBT) भुगतान प्रक्रिया' : 'Direct Benefit Transfer (DBT) Payment Processing',
      status: 'IN_PROGRESS',
      time: '2026-09-07 12:05 PM',
      details: currentLanguage === 'ta' ? 'PFMS மூலம் வங்கிக்கு அனுப்பப்பட்டது (SBIN*****4821). Bank Ref: DBT-PFMS-TN-98124.' : currentLanguage === 'hi' ? 'PFMS भुगतान फ़ाइल भारतीय स्टेट बैंक (SBIN*****4821) को प्रेषित। संदर्भ: DBT-PFMS-TN-98124।' : 'PFMS payment file transmitted to State Bank of India (SBIN*****4821). Bank Ref: DBT-PFMS-TN-98124.'
    },
    {
      id: 10,
      title: currentLanguage === 'ta' ? 'வங்கி கணக்கில் வரவு வைக்கப்படுதல்' : currentLanguage === 'hi' ? 'बैंक भुगतान जमा' : 'Bank Payment Credited',
      status: 'UPCOMING',
      time: currentLanguage === 'ta' ? '24 மணி நேரத்திற்குள் வரவு வைக்கப்படும்' : currentLanguage === 'hi' ? '24 घंटे के भीतर अपेक्षित' : 'Expected within 24 Hours',
      details: currentLanguage === 'ta' ? 'விவசாயியின் வங்கிக் கணக்கிற்கு நேரடியாக வரவு வைக்கப்படும்.' : currentLanguage === 'hi' ? 'किसान के बैंक खाते में सीधा अंतरण जमा।' : 'Direct Bank Transfer credit to farmer account.'
    }
  ];

  return (
    <div className="app-container" style={{ padding: '24px 24px 60px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          {t.farmer.nav?.procurement || 'Procurement & Payment Status'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          {currentLanguage === 'ta'
            ? 'பதிவு முதல் நேரடி வங்கி வரவு வரை தொடர்ச்சியான வெளிப்படையான காலவரிசை.'
            : currentLanguage === 'hi'
            ? 'पंजीकरण से लेकर प्रत्यक्ष लाभ अंतरण (DBT) बैंक भुगतान तक एक निरंतर पारदर्शिता समयरेखा।'
            : 'One continuous transparency timeline from registration to Direct Benefit Transfer bank payment.'}
        </p>
      </div>

      {/* Summary Highlights Surface */}
      <div style={{ background: 'var(--green-dark)', color: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>{currentLanguage === 'ta' ? 'பயிர்' : currentLanguage === 'hi' ? 'फसल' : 'Commodity'}</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>{localizeCommodity('Paddy (Grade A)', currentLanguage)}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>{currentLanguage === 'ta' ? 'ஏற்றுக்கொள்ளப்பட்ட எடை' : currentLanguage === 'hi' ? 'स्वीकृत वजन' : 'Accepted Weight'}</span>
            <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>20.0 {t.common.quintals}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>{currentLanguage === 'ta' ? 'MSP விலை' : currentLanguage === 'hi' ? 'एमएसपी दर' : 'MSP Rate'}</span>
            <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>₹2,320 / {t.common.quintals}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>{currentLanguage === 'ta' ? 'மொத்த தொகை' : currentLanguage === 'hi' ? 'शुद्ध देय राशि' : 'Net Payable Value'}</span>
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
                      {isCompleted
                        ? (currentLanguage === 'ta' ? 'முடிந்தது' : currentLanguage === 'hi' ? 'पूर्ण' : 'Completed')
                        : isInProgress
                        ? (currentLanguage === 'ta' ? 'நடவடிக்கையில்' : currentLanguage === 'hi' ? 'प्रक्रियाधीन' : 'Processing')
                        : (currentLanguage === 'ta' ? 'அடுத்தது' : currentLanguage === 'hi' ? 'आगामी' : 'Upcoming')}
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
                      <span>{t.farmer.viewReceipt} (PR-2026-0009)</span>
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
