import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { InventoryItem } from '../types';

interface TransferModalProps {
  selectedItem: InventoryItem;
  onClose: () => void;
  onSubmit: (amount: string, fromWarehouse: string, toWarehouse: string) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  selectedItem,
  onClose,
  onSubmit
}) => {
  const [transferFrom, setTransferFrom] = useState(
    selectedItem.warehouses[0]?.warehouseName || ''
  );
  const [transferTo, setTransferTo] = useState(
    selectedItem.warehouses[1]?.warehouseName || ''
  );
  const [transferAmount, setTransferAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(transferAmount, transferFrom, transferTo);
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Stock Transfer</h2>
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
              Source branch
            </label>
            <select 
              value={transferFrom} 
              onChange={(e) => setTransferFrom(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
              }}
            >
              <option value="">-- Choose Source --</option>
              {selectedItem.warehouses.map((wh, idx) => (
                <option key={idx} value={wh.warehouseName}>
                  {wh.warehouseName} (Qty: {wh.qty})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Destination branch
            </label>
            <select 
              value={transferTo} 
              onChange={(e) => setTransferTo(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
              }}
            >
              <option value="">-- Choose Destination --</option>
              <option value="Mumbai Central Hub">Mumbai Central Hub</option>
              <option value="Bangalore Tech Park Depot">Bangalore Tech Park Depot</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Quantity to Transfer
            </label>
            <input 
              type="number" 
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="e.g. 5"
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
              Dispatch Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
