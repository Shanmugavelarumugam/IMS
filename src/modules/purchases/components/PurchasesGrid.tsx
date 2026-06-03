import React from 'react';
import { Building2 } from 'lucide-react';
import type { PurchaseOrder } from '../types';

interface PurchasesGridProps {
  filteredPOs: PurchaseOrder[];
  onSelectPO: (po: PurchaseOrder) => void;
}

export const PurchasesGrid: React.FC<PurchasesGridProps> = ({
  filteredPOs,
  onSelectPO,
}) => {
  return (
    <div className="purchase-grid">
      {filteredPOs.map((po) => (
        <div 
          key={po.id} 
          className="purchase-card-premium"
          onClick={() => onSelectPO(po)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6366f1', fontSize: '0.8rem' }}>
              {po.poNumber}
            </span>
            <span className={`status-badge ${po.status.toLowerCase()}`}>
              {po.status}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            {po.supplierName}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 16px 0' }}>
            <Building2 size={12} /> {po.warehouseBranch}
          </p>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{po.items.length} items ordered</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
              ₹{po.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div style={{ height: '1.5px', background: '#f1f5f9', marginBottom: '14px' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>
            <span>Placed: {po.createdAt}</span>
            <span>Due: {po.deliveryDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
