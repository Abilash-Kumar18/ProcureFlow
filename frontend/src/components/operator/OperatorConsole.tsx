import React, { useState, useEffect } from 'react';
import { User, LanguageCode } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import confetti from 'canvas-confetti';
import {
  Users, CheckCircle, Clock, AlertOctagon, ArrowRight, UserPlus,
  Scale, FileCheck, DollarSign, ShieldAlert, Sparkles, RefreshCw,
  Search, Filter, Activity, Radio, Cpu
} from 'lucide-react';

interface OperatorConsoleProps {
  currentUser: User;
  currentLanguage: LanguageCode;
  onRefresh: () => void;
}

export const OperatorConsole: React.FC<OperatorConsoleProps> = ({ currentUser, currentLanguage, onRefresh }) => {
  const t = translations[currentLanguage];
  const [liveQueueData, setLiveQueueData] = useState<any | null>(null);
  const [selectedCounterId, setSelectedCounterId] = useState<string>('cnt-c1-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Weighing & Quality Modal State
  const [activeWeighingEntry, setActiveWeighingEntry] = useState<any | null>(null);
  const [grossWeight, setGrossWeight] = useState<number>(22.5);
  const [tareWeight, setTareWeight] = useState<number>(2.5);
  const [moisture, setMoisture] = useState<number>(13.5);
  const [qualityGrade, setQualityGrade] = useState<'GRADE_A' | 'COMMON' | 'REJECTED'>('GRADE_A');
  const [isSubmittingProcurement, setIsSubmittingProcurement] = useState(false);

  // Assisted Walk-in Modal State
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinMobile, setWalkinMobile] = useState('');
  const [walkinVillage, setWalkinVillage] = useState('Pillaiyarpatti');
  const [walkinQty, setWalkinQty] = useState(25);
  const [isSubmittingWalkin, setIsSubmittingWalkin] = useState(false);

  // Payment update modal / drawer
  const [payments, setPayments] = useState<any[]>([]);
  const [showPaymentTab, setShowPaymentTab] = useState(false);

  const centreDayId = 'cd-pillaiyar-today';

  const loadQueue = async () => {
    try {
      const res = await fetch(`/api/v1/queue/centre-days/${centreDayId}`);
      const data = await res.json();
      if (data.data) {
        setLiveQueueData(data.data);
      }

      const pRes = await fetch('/api/v1/payments');
      const pData = await pRes.json();
      if (pData.data) {
        setPayments(pData.data);
      }
    } catch (e) {
      console.error('Failed to load operator queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  // Operator Action: Call Next Token
  const handleCallNext = async () => {
    try {
      const res = await fetch('/api/v1/queue/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centre_day_id: centreDayId,
          counter_id: selectedCounterId,
          operator_name: currentUser.name
        })
      });

      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.5 } });
        loadQueue();
        onRefresh();
      } else {
        alert(data.error || 'Failed to call token');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Operator Action: Start Service
  const handleStartService = async (queueEntryId: string) => {
    try {
      const res = await fetch('/api/v1/queue/start-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queue_entry_id: queueEntryId,
          counter_id: selectedCounterId,
          operator_name: currentUser.name
        })
      });
      if (res.ok) {
        loadQueue();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Operator Action: Skip No-Show
  const handleSkip = async (queueEntryId: string) => {
    const reason = prompt('Enter No-Show Reason:', 'Farmer absent when token called 3 times');
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/queue/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queue_entry_id: queueEntryId,
          reason,
          operator_name: currentUser.name
        })
      });
      if (res.ok) {
        loadQueue();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Operator Action: Defer Token
  const handleDefer = async (queueEntryId: string) => {
    const reason = prompt('Enter Deferral Reason:', 'Vehicle puncture / temporary unload delay');
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/queue/defer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queue_entry_id: queueEntryId,
          reason,
          operator_name: currentUser.name
        })
      });
      if (res.ok) {
        loadQueue();
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open Weighing Modal
  const handleOpenWeighing = (entry: any) => {
    setActiveWeighingEntry(entry);
    const exp = entry.expected_qty || 20;
    setGrossWeight(Number((exp + 2.5).toFixed(2)));
    setTareWeight(2.5);
    setMoisture(13.5);
    setQualityGrade('GRADE_A');
  };

  // Submit Procurement Measurement
  const handleSubmitProcurement = async () => {
    if (!activeWeighingEntry) return;
    setIsSubmittingProcurement(true);

    try {
      const res = await fetch('/api/v1/procurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: activeWeighingEntry.booking_id,
          gross_weight_quintals: grossWeight,
          tare_weight_quintals: tareWeight,
          moisture_percentage: moisture,
          quality_grade: qualityGrade,
          outcome: 'ACCEPTED',
          recorded_by: currentUser.name
        })
      });

      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
        setActiveWeighingEntry(null);
        loadQueue();
        onRefresh();
      } else {
        alert(data.error || 'Failed to record procurement');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingProcurement(false);
    }
  };

  // Assisted Walk-in
  const handleSubmitWalkin = async () => {
    if (!walkinName || !walkinMobile) {
      alert('Please enter farmer name and mobile number');
      return;
    }

    setIsSubmittingWalkin(true);
    try {
      const regRes = await fetch('/api/v1/auth/register-farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: walkinName,
          mobile: walkinMobile,
          village: walkinVillage,
          district_id: 'dist-thanjavur',
          assisted_by: currentUser.id
        })
      });
      const regData = await regRes.json();
      const farmerProfileId = regData.data.farmer_profile_id;

      const bookRes = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: farmerProfileId,
          centre_day_id: centreDayId,
          slot_window_id: 'slot-c1-w2',
          commodity_id: 'comm-paddy-a',
          expected_qty: walkinQty
        })
      });
      const bookData = await bookRes.json();

      if (bookData.data?.booking?.id) {
        await fetch(`/api/v1/queue/${bookData.data.booking.id}/check-in`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arrival_method: 'ASSISTED_OPERATOR' })
        });
      }

      setShowWalkinModal(false);
      setWalkinName('');
      setWalkinMobile('');
      loadQueue();
      onRefresh();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingWalkin(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/payments/${paymentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_status: newStatus,
          actor_name: currentUser.name
        })
      });
      if (res.ok) {
        confetti({ particleCount: 70, spread: 60 });
        loadQueue();
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const centreDay = liveQueueData?.centre_day;
  const queueList = liveQueueData?.queue || [];
  const counters = liveQueueData?.counters || [];

  // Filtered queue
  const filteredQueue = queueList.filter((item: any) => {
    const matchesSearch =
      item.token_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.village.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterState === 'ALL') return matchesSearch;
    if (filterState === 'ACTIVE') return matchesSearch && (item.state === 'CALLED' || item.state === 'IN_SERVICE');
    if (filterState === 'WAITING') return matchesSearch && (item.state === 'WAITING' || item.state === 'CHECKED_IN');
    if (filterState === 'COMPLETED') return matchesSearch && item.state === 'COMPLETED';
    return matchesSearch;
  });

  // Weighbridge calculations
  const netQty = Math.max(0, grossWeight - tareWeight);
  const moistureDed = moisture > 14.0 ? Number(((netQty * (moisture - 14)) / 100).toFixed(2)) : 0.0;
  const finalPayable = Math.max(0, netQty - moistureDed);
  const mspRate = 2320;
  const netPayableAmt = Number((finalPayable * mspRate).toFixed(2));

  return (
    <div className="app-container" style={{ paddingBottom: '70px' }}>
      {/* Operator Mission Control Header */}
      <div className="modern-card" style={{ padding: '24px', marginBottom: '24px', background: '#090d16', color: 'white', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-amber">{t.operator.consoleBadge}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#064e3b', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 700 }}>
                <Activity size={13} />
                <span>{t.operator.liveTag}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>{t.operator.operatorLabel} <strong style={{ color: 'white' }}>{currentUser.name}</strong></span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              {t.operator.consoleTitle}
            </h2>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', marginTop: '2px' }}>
              {t.operator.mandatedInfo}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowPaymentTab(!showPaymentTab)}
              className="btn btn-secondary"
              style={{ background: showPaymentTab ? 'var(--slate-800)' : '#1e293b', color: 'white', borderColor: '#334155' }}
            >
              <DollarSign size={16} color="#10b981" />
              <span>{t.operator.dbtReconcileBtn} ({payments.filter(p => p.status === 'PROCESSING').length} {t.operator.pending})</span>
            </button>
            <button onClick={() => setShowWalkinModal(true)} className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <UserPlus size={16} />
              <span>{t.operator.assistedRegister}</span>
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Tiles */}
        {centreDay && (
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#131b2e', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>{t.operator.telemetry.dailyCapacity}</span>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>{centreDay.planned_capacity_qty} Qtl</div>
              <div style={{ height: '5px', background: '#1e293b', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round((centreDay.booked_qty / centreDay.planned_capacity_qty) * 100)}%`, background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                {centreDay.booked_qty} Qtl {t.operator.telemetry.allocated} ({Math.round((centreDay.booked_qty / centreDay.planned_capacity_qty) * 100)}%)
              </span>
            </div>

            <div style={{ background: '#131b2e', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>{t.operator.telemetry.arrivalsAtGate}</span>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{centreDay.arrived_farmer_count}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                {t.operator.telemetry.expectedTotalToday} {centreDay.booked_farmer_count}
              </span>
            </div>

            <div style={{ background: '#131b2e', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>{t.operator.telemetry.completedWeighings}</span>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa', marginTop: '2px' }}>{centreDay.served_farmer_count}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                {t.operator.telemetry.receiptsDispatched}
              </span>
            </div>

            <div style={{ background: '#131b2e', padding: '16px', borderRadius: '16px', border: '1px solid #1e293b' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>{t.operator.telemetry.activeWaitingQueue}</span>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                {queueList.filter((q: any) => q.state === 'WAITING' || q.state === 'CHECKED_IN').length}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                {t.operator.telemetry.throughput}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DBT Payment Reconcile Drawer */}
      {showPaymentTab && (
        <div className="modern-card" style={{ padding: '24px', marginBottom: '24px', background: '#f0fdf4', border: '2px solid #86efac' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={22} />
                <span>{t.operator.dbtDesk.title}</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#15803d' }}>
                {t.operator.dbtDesk.subtitle}
              </p>
            </div>
            <button onClick={() => setShowPaymentTab(false)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              {t.operator.dbtDesk.close}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table" style={{ background: 'white', borderRadius: '14px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>{t.operator.dbtDesk.receiptRef}</th>
                  <th>{t.operator.dbtDesk.farmerDetails}</th>
                  <th>{t.operator.dbtDesk.payable}</th>
                  <th>{t.operator.dbtDesk.bankDbtMasked}</th>
                  <th>{t.operator.dbtDesk.status}</th>
                  <th style={{ textAlign: 'right' }}>{t.operator.dbtDesk.action}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="mono" style={{ fontWeight: 800 }}>{p.receipt_ref}</td>
                    <td>
                      <strong>{p.farmer_name}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)' }}>{p.farmer_mobile}</span>
                    </td>
                    <td className="mono" style={{ fontWeight: 800, color: '#15803d', fontSize: '1.05rem' }}>
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="mono" style={{ fontSize: '0.8rem' }}>{p.payment_ref_masked}</td>
                    <td>
                      <span className={`badge ${
                        p.status === 'PAID' ? 'badge-emerald' :
                        p.status === 'PROCESSING' ? 'badge-amber' : 'badge-slate'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {p.status === 'PROCESSING' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(p.id, 'PAID')}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          {t.operator.dbtDesk.confirmCredit}
                        </button>
                      )}
                      {p.status === 'INITIATED' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(p.id, 'PROCESSING')}
                          className="btn btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          {t.operator.dbtDesk.sendPfms}
                        </button>
                      )}
                      {p.status === 'PAID' && (
                        <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>
                          {t.operator.dbtDesk.credited}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bay Selector & Primary Call Next Control Station */}
      <div className="modern-card" style={{ padding: '20px 24px', marginBottom: '24px', background: 'white' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          {/* Weighing Bays Grid */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t.operator.baySelector.label}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {counters.map((c: any) => {
                const isSelected = selectedCounterId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCounterId(c.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid var(--emerald-600)' : '1px solid var(--slate-200)',
                      background: isSelected ? '#ecfdf5' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? '#10b981' : '#94a3b8' }} />
                      <strong style={{ fontSize: '0.88rem', color: isSelected ? '#064e3b' : 'var(--slate-800)' }}>{c.counter_code}</strong>
                    </div>
                    <span className="mono" style={{ display: 'block', fontSize: '0.75rem', color: isSelected ? '#047857' : 'var(--slate-400)', marginTop: '2px', fontWeight: 700 }}>
                      {c.current_token_no ? `${t.operator.baySelector.serving} ${c.current_token_no}` : t.operator.baySelector.bayFree}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Call Next Button */}
          <button
            onClick={handleCallNext}
            className="btn btn-accent"
            style={{ padding: '14px 32px', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.02em' }}
          >
            <Sparkles size={20} />
            <span>{t.operator.callNext}</span>
          </button>
        </div>
      </div>

      {/* Live Queue Operations Table with Search & Filter Bar */}
      <div className="modern-card" style={{ padding: '24px', background: 'white' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-900)' }}>{t.operator.queueTable.title}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              {t.operator.queueTable.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={t.operator.queueTable.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '9px 14px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--slate-200)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '240px'
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', background: 'var(--slate-100)', padding: '3px', borderRadius: '10px', gap: '2px' }}>
              {[
                { key: 'ALL', label: t.operator.queueTable.filterAll },
                { key: 'ACTIVE', label: t.operator.queueTable.filterActive },
                { key: 'WAITING', label: t.operator.queueTable.filterWaiting },
                { key: 'COMPLETED', label: t.operator.queueTable.filterCompleted }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterState(key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: filterState === key ? 'white' : 'transparent',
                    color: filterState === key ? 'var(--slate-900)' : 'var(--slate-500)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: filterState === key ? 'var(--shadow-subtle)' : 'none'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>{t.operator.tokenColumn}</th>
                <th>{t.operator.farmerColumn}</th>
                <th>{t.operator.quantityColumn}</th>
                <th>{t.operator.stateColumn}</th>
                <th>{t.operator.bayColumn}</th>
                <th style={{ textAlign: 'right' }}>{t.operator.actionsColumn}</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((entry: any) => {
                const isCalled = entry.state === 'CALLED';
                const isInService = entry.state === 'IN_SERVICE';
                const isWaiting = entry.state === 'WAITING' || entry.state === 'CHECKED_IN';

                return (
                  <tr
                    key={entry.id}
                    style={{
                      background: isCalled ? '#fffbeb' : isInService ? '#ecfdf5' : 'transparent'
                    }}
                  >
                    <td>
                      <strong className="mono" style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
                        {entry.token_no}
                      </strong>
                      <span className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                        {entry.booking_ref}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--slate-900)', fontSize: '0.95rem' }}>{entry.farmer_name}</strong>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        📍 {entry.village} • {entry.farmer_mobile}
                      </span>
                    </td>

                    <td className="mono" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {entry.expected_qty} Qtl
                    </td>

                    <td>
                      <span className={`badge ${
                        entry.state === 'CALLED' ? 'badge-amber pulse-active' :
                        entry.state === 'IN_SERVICE' ? 'badge-emerald' :
                        entry.state === 'COMPLETED' ? 'badge-indigo' :
                        entry.state === 'NO_SHOW' ? 'badge-red' : 'badge-slate'
                      }`}>
                        {entry.state}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      {entry.assigned_counter_code || '—'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {isCalled && (
                          <button
                            onClick={() => handleStartService(entry.id)}
                            className="btn btn-primary"
                            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                          >
                            <Scale size={15} />
                            <span>{t.operator.queueTable.startService}</span>
                          </button>
                        )}

                        {isInService && (
                          <button
                            onClick={() => handleOpenWeighing(entry)}
                            className="btn btn-primary"
                            style={{ padding: '7px 16px', fontSize: '0.8rem', background: '#059669' }}
                          >
                            <FileCheck size={15} />
                            <span>{t.operator.queueTable.weighbridgeQuality}</span>
                          </button>
                        )}

                        {(isWaiting || isCalled) && (
                          <>
                            <button
                              onClick={() => handleDefer(entry.id)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              title="Defer token temporarily"
                            >
                              {t.operator.queueTable.defer}
                            </button>
                            <button
                              onClick={() => handleSkip(entry.id)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--red-600)' }}
                              title="Mark No-Show"
                            >
                              {t.operator.queueTable.noShow}
                            </button>
                          </>
                        )}

                        {entry.state === 'COMPLETED' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--emerald-700)', fontWeight: 700 }}>
                            {t.operator.queueTable.receiptIssued}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Digital Weighbridge & Quality Assessment Modal */}
      {activeWeighingEntry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="modern-card" style={{ background: 'white', maxWidth: '660px', width: '100%', padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-900)' }}>
                  {t.operator.weighingModal.title} {activeWeighingEntry.token_no}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                  {t.operator.weighingModal.farmer} <strong>{activeWeighingEntry.farmer_name}</strong> • {t.operator.weighingModal.declared} {activeWeighingEntry.expected_qty} {t.operator.weighingModal.paddy}
                </p>
              </div>
              <button onClick={() => setActiveWeighingEntry(null)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: 'var(--slate-400)' }}>&times;</button>
            </div>

            {/* Simulated Digital LED Weighbridge Terminal */}
            <div className="weighbridge-terminal" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                <span>{t.operator.weighingModal.scaleTitle}</span>
                <span>{t.operator.weighingModal.scaleStatus}</span>
              </div>
              <div className="scale-readout">
                <span>{(grossWeight * 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span style={{ fontSize: '1.2rem', color: '#34d399' }}>{t.operator.weighingModal.grossKg}</span>
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.operator.weighingModal.grossLabel}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '1.05rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.operator.weighingModal.tareLabel}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '1.05rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.operator.weighingModal.moistureLabel}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '1.05rem', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.72rem', color: moisture > 14.0 ? 'var(--red-600)' : '#059669', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                  {moisture > 14.0 ? `${t.operator.weighingModal.moistureExcess} (${(moisture - 14).toFixed(1)}%)` : t.operator.weighingModal.moistureOk}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.operator.weighingModal.gradingLabel}
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as any)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.95rem', fontWeight: 600 }}
                >
                  <option value="GRADE_A">{t.operator.weighingModal.gradeA}</option>
                  <option value="COMMON">{t.operator.weighingModal.common}</option>
                </select>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--slate-200)', marginBottom: '24px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>{t.operator.weighingModal.netQty}</span>
                <strong className="mono">{netQty.toFixed(2)} {t.common.quintals}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>{t.operator.weighingModal.moistureDed}</span>
                <span className="mono" style={{ color: 'var(--red-600)' }}>- {moistureDed.toFixed(2)} {t.common.quintals}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderTop: '1px solid var(--slate-200)', paddingTop: '6px' }}>
                <span>{t.operator.weighingModal.finalPayable}</span>
                <strong className="mono" style={{ color: 'var(--emerald-700)', fontSize: '1.05rem' }}>{finalPayable.toFixed(2)} {t.common.quintals}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--slate-300)', paddingTop: '8px', fontSize: '1.25rem', color: 'var(--emerald-800)' }}>
                <strong>{t.operator.weighingModal.netPayable}</strong>
                <strong className="mono">₹{netPayableAmt.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setActiveWeighingEntry(null)} className="btn btn-secondary">
                {t.common.cancel}
              </button>
              <button
                onClick={handleSubmitProcurement}
                disabled={isSubmittingProcurement}
                className="btn btn-primary"
                style={{ padding: '12px 28px', fontWeight: 700 }}
              >
                {isSubmittingProcurement ? t.operator.weighingModal.generatingReceipt : t.operator.weighingModal.approveButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assisted Walk-in Modal */}
      {showWalkinModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="modern-card" style={{ background: 'white', maxWidth: '520px', width: '100%', padding: '28px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-900)' }}>{t.operator.walkinModal.title}</h3>
              <button onClick={() => setShowWalkinModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: 'var(--slate-400)' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.operator.walkinModal.nameLabel}</label>
                <input
                  type="text"
                  placeholder={t.operator.walkinModal.namePlaceholder}
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.operator.walkinModal.mobileLabel}</label>
                <input
                  type="tel"
                  placeholder={t.operator.walkinModal.mobilePlaceholder}
                  value={walkinMobile}
                  onChange={(e) => setWalkinMobile(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.operator.walkinModal.villageLabel}</label>
                <input
                  type="text"
                  value={walkinVillage}
                  onChange={(e) => setWalkinVillage(e.target.value)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>{t.operator.walkinModal.qtyLabel}</label>
                <input
                  type="number"
                  value={walkinQty}
                  onChange={(e) => setWalkinQty(Number(e.target.value))}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid var(--slate-300)', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowWalkinModal(false)} className="btn btn-secondary">
                {t.common.cancel}
              </button>
              <button onClick={handleSubmitWalkin} disabled={isSubmittingWalkin} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                {isSubmittingWalkin ? t.operator.walkinModal.generatingToken : t.operator.walkinModal.registerButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
