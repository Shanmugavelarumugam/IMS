import React from 'react';
import { Box, IndianRupee, AlertTriangle, Layers, Settings } from 'lucide-react';

interface StatsGridProps {
  totalSKUsCount: number;
  totalValue: number;
  lowStockCount: number;
  categoryCount: number;
  activeCardIds: string[];
  onConfigureCards: () => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalSKUsCount,
  totalValue,
  lowStockCount,
  categoryCount,
  activeCardIds,
  onConfigureCards
}) => {
  const cardDefinitions = [
    {
      id: 'total_skus',
      label: 'Total Products',
      value: totalSKUsCount,
      subtext: 'Active inventory items',
      icon: Box,
      className: 'blue',
      color: '#6366f1'
    },
    {
      id: 'total_value',
      label: 'Total Inventory Value',
      value: `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Current inventory valuation',
      icon: IndianRupee,
      className: 'emerald',
      color: '#059669',
      valueColor: '#059669'
    },
    {
      id: 'low_stock',
      label: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: 'Items below threshold',
      icon: AlertTriangle,
      className: 'rose',
      color: '#e11d48',
      valueColor: lowStockCount > 0 ? '#e11d48' : '#0f172a'
    },
    {
      id: 'categories',
      label: 'Categories',
      value: categoryCount,
      subtext: 'Active categories',
      icon: Layers,
      className: 'purple',
      color: '#8b5cf6'
    }
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          Operational Highlights
        </h3>
        <button 
          onClick={onConfigureCards}
          style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            color: '#4f46e5',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.05)',
            transition: 'all 0.2s'
          }}
        >
          <Settings size={14} /> Configure Cards
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        {cardDefinitions.filter(c => activeCardIds.includes(c.id)).map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{card.label}</div>
                <div className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</div>
                <div className="stat-card-subtext">{card.subtext}</div>
              </div>
              <div className={`stat-card-icon-wrapper ${card.className}`}>
                <Icon size={20} strokeWidth={2.4} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
