import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../types';

interface AdjustmentModalProps {
  selectedProduct: Product;
  onClose: () => void;
  onSubmit: (amount: string, type: 'add' | 'subtract', notes: string) => void;
}

export const AdjustmentModal: React.FC<AdjustmentModalProps> = ({
  selectedProduct,
  onClose,
  onSubmit
}) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(adjustmentAmount, adjustmentType, adjustmentNotes);
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Adjust Stock Quantity
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 20px 0', lineHeight: 1.5, fontWeight: 550 }}>
              Adjust active stock levels for <strong style={{ color: '#0f172a' }}>{selectedProduct.name}</strong>. Current level: {selectedProduct.stockQty} U.
            </p>

            <div className="premium-input-group">
              <label>Adjustment Action</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <label 
                  style={{ 
                    flex: 1, 
                    border: `1.5px solid ${adjustmentType === 'add' ? '#6366f1' : '#e2e8f0'}`, 
                    background: adjustmentType === 'add' ? '#f5f7ff' : '#ffffff',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: adjustmentType === 'add' ? '#6366f1' : '#475569'
                  }}
                >
                  <input 
                    type="radio" 
                    name="adjType" 
                    checked={adjustmentType === 'add'} 
                    onChange={() => setAdjustmentType('add')} 
                    style={{ display: 'none' }}
                  />
                  Add Stock (+)
                </label>
                <label 
                  style={{ 
                    flex: 1, 
                    border: `1.5px solid ${adjustmentType === 'subtract' ? '#dc2626' : '#e2e8f0'}`, 
                    background: adjustmentType === 'subtract' ? '#fff1f2' : '#ffffff',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: adjustmentType === 'subtract' ? '#dc2626' : '#475569'
                  }}
                >
                  <input 
                    type="radio" 
                    name="adjType" 
                    checked={adjustmentType === 'subtract'} 
                    onChange={() => setAdjustmentType('subtract')} 
                    style={{ display: 'none' }}
                  />
                  Deduct Stock (-)
                </label>
              </div>
            </div>

            <div className="premium-input-group">
              <label>Adjustment Quantity (Units)</label>
              <input 
                type="number" 
                className="premium-input" 
                value={adjustmentAmount} 
                onChange={e => setAdjustmentAmount(e.target.value)} 
                placeholder="e.g. 5"
                min="1"
                required
              />
            </div>

            <div className="premium-input-group">
              <label>Audit Adjustment Reason / Note</label>
              <input 
                type="text" 
                className="premium-input" 
                value={adjustmentNotes} 
                onChange={e => setAdjustmentNotes(e.target.value)} 
                placeholder="e.g. Supply consignment received / Damaged item write-off"
              />
            </div>
          </div>

          <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                background: adjustmentType === 'add' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
