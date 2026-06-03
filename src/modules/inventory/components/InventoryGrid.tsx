import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { InventoryItem } from '../types';

interface InventoryGridProps {
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  items,
  onSelectItem
}) => {
  return (
    <div className="inventory-grid">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="inventory-card-premium"
          onClick={() => onSelectItem(item)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366f1', background: '#f0f3ff', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
              {item.sku}
            </span>
            {item.qty <= item.minStockLevel ? (
              <span className="shortage-warning">
                <AlertTriangle size={12} /> Low Stock
              </span>
            ) : (
              <span className="healthy-stock">
                <CheckCircle2 size={12} /> Healthy
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
            {item.name}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, margin: '0 0 16px 0' }}>
            {item.category}
          </p>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>In-Stock Qty</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{item.qty} units</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Net Valuation</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
                ₹{(item.qty * item.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>

          <div style={{ height: '1.5px', background: '#f1f5f9', marginBottom: '14px' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>
            <span>{item.warehouses.length} Depot Allocations</span>
            <span>Audited: {item.lastAudited}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
