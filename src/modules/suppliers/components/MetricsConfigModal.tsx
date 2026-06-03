import React from 'react';
import { X, AlertCircle, UserRound, IndianRupee, TrendingUp, Calendar, Star } from 'lucide-react';

interface MetricsConfigModalProps {
  onClose: () => void;
  activeCardIds: string[];
  setActiveCardIds: (ids: string[]) => void;
}

export const MetricsConfigModal: React.FC<MetricsConfigModalProps> = ({
  onClose,
  activeCardIds,
  setActiveCardIds
}) => {
  const cardDefinitions = [
    {
      id: 'active_suppliers',
      label: 'Active Suppliers',
      subtext: 'Registered supplier accounts',
      icon: UserRound,
      color: '#6366f1',
    },
    {
      id: 'outstanding_payables',
      label: 'Outstanding Payables',
      subtext: 'Pending supplier payments',
      icon: IndianRupee,
      color: '#e11d48',
    },
    {
      id: 'active_purchase_orders',
      label: 'Active Purchase Orders',
      subtext: 'Open purchase orders',
      icon: TrendingUp,
      color: '#059669',
    },
    {
      id: 'pending_deliveries',
      label: 'Pending Deliveries',
      subtext: 'In transit',
      icon: Calendar,
      color: '#8b5cf6',
    },
    {
      id: 'overdue_payments',
      label: 'Overdue Payments',
      subtext: 'Delayed ledger amount',
      icon: AlertCircle,
      color: '#dc2626',
    },
    {
      id: 'top_rated_suppliers',
      label: 'Preferred Suppliers',
      subtext: 'Preferred supplier partners',
      icon: Star,
      color: '#d97706',
      isStar: true
    }
  ];

  const isMaxReached = activeCardIds.length >= 4;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 14, 29, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        padding: '32px',
        background: '#ffffff',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        boxShadow: '0 30px 70px rgba(9, 14, 29, 0.12)',
        borderRadius: '24px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 850, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
          Configure Cards
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, margin: '0 0 20px 0' }}>
          Toggle visibility of operational metrics. Select exactly up to 4 active cards to show.
        </p>

        {/* Warning banner when limit is reached */}
        {isMaxReached && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#b45309',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={14} color="#d97706" />
            <span>Limit Reached: Exactly 4 active cards are configured. Remove an active card to enable selecting others.</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {cardDefinitions.map(card => {
            const isSelected = activeCardIds.includes(card.id);
            const isDisabled = isMaxReached && !isSelected;
            return (
              <label 
                key={card.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isSelected ? '#f8fafc' : '#ffffff',
                  border: isSelected ? '1.5px solid #cbd5e1' : '1.5px solid #f1f5f9',
                  borderRadius: '16px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: `${card.color}10`, color: card.color, padding: '8px', borderRadius: '10px', display: 'flex' }}>
                    <card.icon size={16} fill={card.isStar && isSelected ? card.color : 'none'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b' }}>{card.label}</span>
                    <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 550 }}>{card.subtext}</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => {
                    if (isSelected) {
                      setActiveCardIds(activeCardIds.filter(id => id !== card.id));
                    } else {
                      setActiveCardIds([...activeCardIds, card.id]);
                    }
                  }}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#6366f1',
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                />
              </label>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)'
            }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
