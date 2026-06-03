import React from 'react';
import { X, Box, Building2, Calendar, ArrowUpRight, ArrowDownLeft, PlusCircle, ArrowRightLeft } from 'lucide-react';
import type { InventoryItem } from '../types';

interface InventoryDrawerProps {
  selectedItem: InventoryItem;
  onClose: () => void;
  onRecordStockAdjustment: (item: InventoryItem) => void;
  onStockTransfer: (item: InventoryItem) => void;
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  selectedItem,
  onClose,
  onRecordStockAdjustment,
  onStockTransfer
}) => {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span className="shortage-warning" style={{ background: selectedItem.qty <= selectedItem.minStockLevel ? '#fff1f2' : '#ecfdf5', color: selectedItem.qty <= selectedItem.minStockLevel ? '#be123c' : '#059669', borderColor: selectedItem.qty <= selectedItem.minStockLevel ? '#ffe4e6' : '#d1fae5' }}>
            {selectedItem.qty <= selectedItem.minStockLevel ? 'Low Stock Level Alert' : 'Healthy Asset Level'}
          </span>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f0f3ff', padding: '12px', borderRadius: '14px', color: '#6366f1' }}>
            <Box size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{selectedItem.name}</h2>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginTop: '2px' }}>
              {selectedItem.sku}
            </div>
          </div>
        </div>

        {/* Warehouse Allocation Breakdown */}
        <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Depot Stock Allocation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {selectedItem.warehouses.map((wh, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color="#64748b" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{wh.warehouseName}</span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 850, color: '#0f172a' }}>{wh.qty} units</span>
            </div>
          ))}
        </div>

        {/* Transaction Ledger */}
        <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Physical Audit & Transaction Ledger
        </h3>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedItem.ledger?.map((entry) => (
            <div key={entry.id} style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{entry.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 650, marginTop: '4px' }}>
                  <Calendar size={12} /> {entry.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 850, color: entry.isCredit ? '#059669' : '#e11d48' }}>
                {entry.isCredit ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                {entry.amount} U
              </div>
            </div>
          ))}
        </div>

        {/* Ledger Operations Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <button 
            onClick={() => onRecordStockAdjustment(selectedItem)}
            style={{ 
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
              padding: '12px', borderRadius: '14px', border: 'none', background: '#6366f1',
              color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', outline: 'none',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}
          >
            <PlusCircle size={18} /> Record Stock Adjustment
          </button>

          <button 
            onClick={() => onStockTransfer(selectedItem)}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', 
              borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#475569', cursor: 'pointer', outline: 'none'
            }}
            title="Transfer stock between branches"
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
