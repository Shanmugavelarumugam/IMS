import React from 'react';
import { X } from 'lucide-react';

interface MetricsConfigModalProps {
  onClose: () => void;
  visibleCards: {
    total_qty: boolean;
    net_value: boolean;
    alerts: boolean;
    locations: boolean;
  };
  onChange: (key: string, value: boolean) => void;
}

export const MetricsConfigModal: React.FC<MetricsConfigModalProps> = ({
  onClose,
  visibleCards,
  onChange
}) => {
  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ width: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Configure Cards</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: 16 }}>
          Select which KPI metric cards to display on top of the Stock balance hub.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {Object.keys(visibleCards).map((key) => {
            const label = key === 'total_qty' ? 'Total Stock Quantity' :
                          key === 'net_value' ? 'Net Inventory Value' :
                          key === 'alerts' ? 'Critical Shortages' : 'Warehousing Depots';
            return (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={visibleCards[key as keyof typeof visibleCards]}
                  onChange={(e) => onChange(key, e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                />
                {label}
              </label>
            );
          })}
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
            background: '#6366f1', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem',
            cursor: 'pointer', outline: 'none'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
