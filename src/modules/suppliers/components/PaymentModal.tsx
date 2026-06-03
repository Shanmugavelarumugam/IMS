import React, { useState } from 'react';
import { IndianRupee, X } from 'lucide-react';
import type { Supplier } from '../types';

interface PaymentModalProps {
  selectedSupplier: Supplier;
  onClose: () => void;
  onSubmit: (amount: string, ref: string, notes: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  selectedSupplier,
  onClose,
  onSubmit
}) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paymentAmount, paymentRef, paymentNotes);
  };

  return (
    <div className="premium-modal-overlay" style={{ zIndex: 11000 }}>
      <div className="premium-modal-content" style={{ maxWidth: '440px' }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#fff1f2' 
        }}>
          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IndianRupee size={18} /> Record Ledger Payment
          </h3>
          <button 
            onClick={onClose}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Info outstanding */}
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Outstanding Liability</div>
              <div style={{ fontSize: '1.15rem', color: '#1e293b', fontWeight: 900, marginTop: '2px' }}>
                ₹{selectedSupplier.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Amount input */}
            <div className="premium-input-group">
              <label>Disbursement Amount (₹ INR) *</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="premium-field"
              />
            </div>

            {/* Ref code input */}
            <div className="premium-input-group">
              <label>Transaction Reference Check #</label>
              <input 
                type="text" 
                placeholder="TXN-909283 (optional)"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="premium-field"
              />
            </div>

            {/* Internal notes */}
            <div className="premium-input-group">
              <label>Internal Ledger Memo</label>
              <input 
                type="text" 
                placeholder="Bank wire transfer via JPMorgan (optional)"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="premium-field"
              />
            </div>

          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{ background: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{ background: '#e11d48', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)' }}
            >
              Disburse Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
