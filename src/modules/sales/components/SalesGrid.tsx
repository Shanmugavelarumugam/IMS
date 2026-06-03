import React from 'react';
import type { SalesOrder } from '../types';

interface SalesGridProps {
  filteredSales: SalesOrder[];
  onSelectOrder: (order: SalesOrder) => void;
}

export const SalesGrid: React.FC<SalesGridProps> = ({
  filteredSales,
  onSelectOrder,
}) => {
  return (
    <div className="sales-grid">
      {filteredSales.map((s) => (
        <div 
          key={s.id} 
          className="sales-card-premium"
          onClick={() => onSelectOrder(s)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6366f1', fontSize: '0.8rem' }}>
              {s.orderNumber}
            </span>
            <span className={`status-badge ${s.status === 'COMPLETED' ? 'completed' : s.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
              {s.status === 'PENDING_DISPATCH' ? 'Pending Dispatch' : s.status}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            {s.customerName}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, margin: '0 0 16px 0' }}>
            Paid via: {s.paymentMode}
          </p>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{s.items.length} item(s)</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669' }}>
              ₹{s.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div style={{ height: '1.5px', background: '#f1f5f9', marginBottom: '14px' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>
            <span>Order: {s.createdAt}</span>
            <span>Dispatch: {s.dispatchDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
