import React from 'react';
import { UserRound, IndianRupee, TrendingUp, Calendar, AlertCircle, Star, Settings } from 'lucide-react';

interface StatsGridProps {
  totalCount: number;
  totalLiability: number;
  activeOrders: number;
  pendingDeliveries: number;
  overduePayments: number;
  eliteCount: number;
  activeCardIds: string[];
  onConfigureCards: () => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalCount,
  totalLiability,
  activeOrders,
  pendingDeliveries,
  overduePayments,
  eliteCount,
  activeCardIds,
  onConfigureCards
}) => {
  const cardDefinitions = [
    {
      id: 'active_suppliers',
      label: 'Active Suppliers',
      value: totalCount,
      subtext: 'Registered supplier accounts',
      icon: UserRound,
      color: '#6366f1',
      className: 'blue'
    },
    {
      id: 'outstanding_payables',
      label: 'Outstanding Payables',
      value: `₹${totalLiability.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Pending supplier payments',
      icon: IndianRupee,
      color: '#e11d48',
      className: 'red',
      valueColor: '#e11d48'
    },
    {
      id: 'active_purchase_orders',
      label: 'Active Purchase Orders',
      value: activeOrders,
      subtext: 'Open purchase orders',
      icon: TrendingUp,
      color: '#059669',
      className: 'emerald'
    },
    {
      id: 'pending_deliveries',
      label: 'Pending Deliveries',
      value: pendingDeliveries,
      subtext: 'In transit',
      icon: Calendar,
      color: '#8b5cf6',
      className: 'purple',
      iconBg: '#f5f3ff'
    },
    {
      id: 'overdue_payments',
      label: 'Overdue Payments',
      value: `₹${overduePayments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Delayed ledger amount',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      iconBg: '#fff1f2',
      valueColor: '#dc2626'
    },
    {
      id: 'top_rated_suppliers',
      label: 'Preferred Suppliers',
      value: eliteCount,
      subtext: 'Preferred supplier partners',
      icon: Star,
      color: '#d97706',
      className: 'amber',
      isStar: true
    }
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '12px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
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
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.05)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
          }}
        >
          <Settings size={14} /> Configure Cards
        </button>
      </div>

      <div className="stats-grid">
        {cardDefinitions.filter(c => activeCardIds.includes(c.id)).map(card => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="stat-card-premium">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="stat-card-label">{card.label}</span>
                <span className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</span>
                <span className="stat-card-subtext">{card.subtext}</span>
              </div>
              <div 
                className={`stat-card-icon-wrapper ${card.className}`} 
                style={card.iconBg ? { background: card.iconBg, color: card.color } : {}}
              >
                <Icon size={20} fill={card.isStar ? card.color : 'none'} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
