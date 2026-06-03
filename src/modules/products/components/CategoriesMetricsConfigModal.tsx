import React from 'react';
import { X } from 'lucide-react';

interface VisibleCards {
  total_categories: boolean;
  total_skus: boolean;
  avg_skus: boolean;
  active_tax: boolean;
}

interface CategoriesMetricsConfigModalProps {
  visibleCards: VisibleCards;
  onToggle: (key: keyof VisibleCards, checked: boolean) => void;
  onClose: () => void;
}

const CARD_LABELS: Record<keyof VisibleCards, string> = {
  total_categories: 'Total Categories',
  total_skus: 'Linked Inventory SKUs',
  avg_skus: 'Avg Products/Category',
  active_tax: 'Active Categories'
};

export const CategoriesMetricsConfigModal: React.FC<CategoriesMetricsConfigModalProps> = ({
  visibleCards,
  onToggle,
  onClose
}) => {
  return (
    <div className="cat-premium-modal-overlay">
      <div className="cat-premium-modal-content" style={{ width: '400px' }}>
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
          Select which KPI metric cards to display on top of the Category hub.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {(Object.keys(visibleCards) as Array<keyof VisibleCards>).map((key) => (
            <label
              key={key}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={visibleCards[key]}
                onChange={(e) => onToggle(key, e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
              />
              {CARD_LABELS[key]}
            </label>
          ))}
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
