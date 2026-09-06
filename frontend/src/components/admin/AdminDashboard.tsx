import React, { useState, useEffect } from 'react';
import { User, LanguageCode, CentreMetrics } from '../../../../shared/src/types';
import { translations } from '../../i18n/translations';
import {
  ShieldCheck, Download, AlertTriangle, Building, TrendingUp,
  Clock, Users, Activity, CheckCircle2, FileSpreadsheet, RefreshCw,
  BarChart3, Check, Filter, Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  currentLanguage: LanguageCode;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, currentLanguage, onRefresh }) => {
  const t = translations[currentLanguage];
  const [adminData, setAdminData] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const dRes = await fetch('/api/v1/admin/dashboard');
      const dData = await dRes.json();
      if (dData.data) {
        setAdminData(dData.data);
      }

      const aRes = await fetch('/api/v1/admin/audit-logs');
      const aData = await aRes.json();
      if (aData.data) {
        setAuditLogs(aData.data);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/v1/admin/export-procurements-csv', '_blank');
  };

  const summary = adminData?.summary;
  const centres: CentreMetrics[] = adminData?.centre_metrics || [];

  return (
    <div className="app-container" style={{ paddingBottom: '70px' }}>
      {/* Admin Executive Header */}
      <div className="modern-card" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-indigo">DISTRICT COMMAND</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                District Collector: <strong style={{ color: 'white' }}>{currentUser.name}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              {t.admin.title}
            </h2>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem', marginTop: '2px' }}>
              Thanjavur Agri District Procurement Division • Kharif KMS 2026-27 Monitoring
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleExportCsv}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '12px 24px', fontWeight: 700 }}
            >
              <Download size={18} />
              <span>{t.admin.exportCsv}</span>
            </button>
          </div>
        </div>

        {/* District KPI Summary Grid */}
        {summary && (
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Monitored Centres
              </span>
              <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>
                {summary.total_centres}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>100% Operational Today</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Planned Daily Capacity
              </span>
              <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                {summary.total_planned_capacity} Qtl
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>Booked: {summary.total_booked_volume} Qtl</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Farmers Served Today
              </span>
              <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', marginTop: '2px' }}>
                {summary.total_served}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>DBT Payments Processing</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Active Waiting Queue
              </span>
              <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                {summary.total_waiting}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>Across All 4 Centres</span>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Centre Congestion Heatmap */}
      <div className="modern-card" style={{ padding: '24px', marginBottom: '24px', background: 'white' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-900)' }}>{t.admin.congestionMap}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Real-time load balancing view across APMCs to redirect farmers and avert mandi congestion
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
            <span className="badge badge-emerald">Optimal (&lt;75%)</span>
            <span className="badge badge-amber">Heavy Demand (80-95%)</span>
            <span className="badge badge-red">Critical Overflow (&gt;95%)</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {centres.map((c) => {
            const capRatio = Math.min(100, Math.round((c.booked_volume / c.planned_capacity) * 100));
            const isCongested = c.congestion_level === 'CONGESTED' || c.congestion_level === 'CRITICAL';

            return (
              <div
                key={c.centre_id}
                style={{
                  border: isCongested ? '2px solid #f87171' : '1px solid var(--slate-200)',
                  borderRadius: '18px',
                  padding: '18px',
                  background: isCongested ? '#fff1f2' : 'var(--slate-50)',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>{c.centre_name}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)' }}>PPC District Unit</span>
                  </div>
                  <span className={`badge ${
                    c.congestion_level === 'CRITICAL' ? 'badge-red' :
                    c.congestion_level === 'CONGESTED' ? 'badge-amber' : 'badge-emerald'
                  }`}>
                    {c.congestion_level}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div style={{ margin: '14px 0 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--slate-600)' }}>Capacity Booked:</span>
                    <strong className="mono">{capRatio}% ({c.booked_volume}/{c.planned_capacity} Qtl)</strong>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${capRatio}%`,
                      background: isCongested ? 'var(--red-500)' : 'var(--emerald-600)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                {/* Centre Sub-Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', marginTop: '12px', color: 'var(--slate-600)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                  <div>Waiting: <strong style={{ color: 'var(--slate-900)' }}>{c.waiting_count} farmers</strong></div>
                  <div>Completed: <strong style={{ color: 'var(--slate-900)' }}>{c.served_count} farmers</strong></div>
                  <div>Avg Waiting: <strong style={{ color: 'var(--slate-900)' }}>~{c.average_wait_minutes} mins</strong></div>
                  <div>Active Counters: <strong style={{ color: 'var(--slate-900)' }}>{c.active_counters} bays</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immutable Audit Trail Explorer */}
      <div className="modern-card" style={{ padding: '24px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-900)' }}>{t.admin.auditLog}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Append-only tamper-evident event stream capturing every state transition, weighing, and DBT disbursement
            </p>
          </div>
          <button onClick={loadAdminData} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            <RefreshCw size={15} />
            <span>Refresh Trail</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Entity</th>
                <th>Authorized Actor</th>
                <th>Centre</th>
                <th>Audit Summary</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                      {log.event_type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>{log.entity_type}</td>
                  <td>
                    <strong style={{ color: 'var(--slate-900)' }}>{log.actor_name}</strong>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--slate-400)' }}>{log.actor_role}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                    {log.centre_name || 'District Command'}
                  </td>
                  <td style={{ color: 'var(--slate-800)', fontSize: '0.85rem' }}>{log.summary}</td>
                  <td className="mono" style={{ fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                    {log.occurred_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
