import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { InventoryItem } from '../types';

interface AdjustModalProps {
  selectedItem: InventoryItem;
  onClose: () => void;
  onSubmit: (amount: string, type: 'add' | 'subtract', notes: string, warehouse: string) => void;
}

export const AdjustModal: React.FC<AdjustModalProps> = ({
  selectedItem,
  onClose,
  onSubmit
}) => {
  const [adjustWarehouse, setAdjustWarehouse] = useState(
    selectedItem.warehouses[0]?.warehouseName || 'Mumbai Central Hub'
  );
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(adjustAmount, adjustType, adjustNotes, adjustWarehouse);
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Record Stock Adjustment</h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Select Depot / Location
            </label>
            <select 
              value={adjustWarehouse} 
              onChange={(e) => setAdjustWarehouse(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
              }}
            >
              {selectedItem.warehouses.map((wh, idx) => (
                <option key={idx} value={wh.warehouseName}>
                  {wh.warehouseName} (Available: {wh.qty})
                </option>
              ))}
              <option value="Mumbai Central Hub">Mumbai Central Hub (Add New)</option>
              <option value="Bangalore Tech Park Depot">Bangalore Tech Park Depot (Add New)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                Adjustment Type
              </label>
              <select 
                value={adjustType} 
                onChange={(e) => setAdjustType(e.target.value as 'add' | 'subtract')}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              >
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                Adjustment Quantity
              </label>
              <input 
                type="number" 
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="e.g. 15"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Adjustment Log Note
            </label>
            <input 
              type="text" 
              value={adjustNotes}
              onChange={(e) => setAdjustNotes(e.target.value)}
              placeholder="e.g. Reconciled during monthly stock count audit"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', outline: 'none'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', outline: 'none'
              }}
            >
              Execute Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
