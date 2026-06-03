import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { InventoryItem } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onSelectItem
}) => {
  return (
    <div className="premium-table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>In-Stock Qty</th>
            <th>Unit Price</th>
            <th>Asset Valuation</th>
            <th>Alert Status</th>
            <th style={{ textAlign: 'right' }}>Audited On</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} onClick={() => onSelectItem(item)}>
              <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{item.sku}</td>
              <td>{item.name}</td>
              <td style={{ color: '#64748b', fontWeight: 650 }}>{item.category}</td>
              <td style={{ fontWeight: 800 }}>{item.qty} units</td>
              <td style={{ color: '#475569' }}>₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td style={{ fontWeight: 850, color: '#059669' }}>₹{(item.qty * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td>
                {item.qty <= item.minStockLevel ? (
                  <span className="shortage-warning">
                    <AlertTriangle size={12} /> Low Stock
                  </span>
                ) : (
                  <span className="healthy-stock">
                    <CheckCircle2 size={12} /> Healthy
                  </span>
                )}
              </td>
              <td style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>{item.lastAudited}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
