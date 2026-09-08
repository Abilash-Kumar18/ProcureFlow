import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../../../../shared/src/types';
import { translations, localizeCentreName, localizeCentreAddress } from '../../i18n/translations';
import { Search, MapPin, Clock, Users, ArrowRight, Map, List, Filter } from 'lucide-react';

interface FarmerDiscoveryProps {
  currentLanguage: LanguageCode;
  onSelectCentre: (centre: any) => void;
}

export const FarmerDiscovery: React.FC<FarmerDiscoveryProps> = ({
  currentLanguage,
  onSelectCentre
}) => {
  const t = translations[currentLanguage];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('ALL');
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await fetch('/api/v1/centres');
        const data = await res.json();
        if (data.data) {
          setCentres(data.data);
        }
      } catch (err) {
        console.error('Failed to load centres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCentres();
  }, []);

  // Filter centres
  const filteredCentres = centres.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterAvailability === 'OPTIMAL') return matchesSearch && !c.is_congested;
    if (filterAvailability === 'HEAVY') return matchesSearch && c.is_congested;
    return matchesSearch;
  });

  return (
    <div className="app-container" style={{ padding: '24px 20px 60px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          Find a Procurement Centre
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          Search by village, locality, or centre name to check available slots and queue wait times.
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="service-surface" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Field */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by village, locality or centre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 38px',
                borderRadius: '8px',
                border: '1px solid var(--slate-300)',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 500
              }}
            />
          </div>

          {/* Availability Filter Buttons */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--slate-100)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setFilterAvailability('ALL')}
              style={{
                background: filterAvailability === 'ALL' ? 'white' : 'transparent',
                color: filterAvailability === 'ALL' ? 'var(--text-dark)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '0.78rem',
                fontWeight: filterAvailability === 'ALL' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              All Centres ({centres.length})
            </button>

            <button
              onClick={() => setFilterAvailability('OPTIMAL')}
              style={{
                background: filterAvailability === 'OPTIMAL' ? 'white' : 'transparent',
                color: filterAvailability === 'OPTIMAL' ? 'var(--green-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '0.78rem',
                fontWeight: filterAvailability === 'OPTIMAL' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              Available Today
            </button>

            <button
              onClick={() => setFilterAvailability('HEAVY')}
              style={{
                background: filterAvailability === 'HEAVY' ? 'white' : 'transparent',
                color: filterAvailability === 'HEAVY' ? 'var(--amber-primary)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '0.78rem',
                fontWeight: filterAvailability === 'HEAVY' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              Heavy Traffic
            </button>
          </div>

        </div>
      </div>

      {/* CLEAN LIST ROWS (70%+ REDUCTION IN CARDS) */}
      <div className="service-surface">
        {filteredCentres.map((centre) => {
          const isCongested = centre.is_congested;
          const distanceText = centre.id === 'c-1' ? '2.4 km' : centre.id === 'c-2' ? '6.8 km' : '11.2 km';

          return (
            <div key={centre.id} className="list-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              
              {/* Centre Details */}
              <div style={{ flex: 2, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-dark)' }}>
                    {localizeCentreName(centre.name, currentLanguage)}
                  </strong>
                  <span className={`badge ${isCongested ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.62rem' }}>
                    {isCongested ? 'Heavy Traffic' : 'Available Today'}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--green-primary)" />
                  <span>{localizeCentreAddress(centre.address, currentLanguage)}</span>
                  <span style={{ color: 'var(--slate-300)' }}>•</span>
                  <strong>{distanceText} away</strong>
                </p>
              </div>

              {/* Status Metrics */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Next Slot</span>
                  <strong style={{ color: 'var(--text-dark)' }}>11:00 – 13:00</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Est. Wait</span>
                  <strong style={{ color: 'var(--text-dark)' }}>~42 min</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Capacity</span>
                  <strong style={{ color: isCongested ? 'var(--amber-primary)' : 'var(--green-primary)' }}>
                    {isCongested ? '88%' : '72%'}
                  </strong>
                </div>
              </div>

              {/* View Slots CTA */}
              <div>
                <button
                  onClick={() => onSelectCentre(centre)}
                  className="btn btn-secondary"
                  style={{ padding: '7px 14px', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  <span>View Slots</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
