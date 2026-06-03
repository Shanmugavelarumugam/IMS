import React from 'react';
import { X } from 'lucide-react';

interface MetricsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleCards: {
    active_drafts: boolean;
    historic_exp: boolean;
    accounts_payable: boolean;
    fulfillment_rate: boolean;
  };
  onChange: (key: string, checked: boolean) => void;
}

export const MetricsConfigModal: React.FC<MetricsConfigModalProps> = ({
  isOpen,
  onClose,
  visibleCards,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ width: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Configure Cards</h3>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: 16 }}>Select which KPI metric cards to display on top of the Purchases hub.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {Object.keys(visibleCards).map((key) => {
            const label = key === 'active_drafts' ? 'Active Drafts' :
                          key === 'historic_exp' ? 'Historic Spend' :
                          key === 'accounts_payable' ? 'Accounts Payable' : 'Fulfillment Rate';
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
          type="button"
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
