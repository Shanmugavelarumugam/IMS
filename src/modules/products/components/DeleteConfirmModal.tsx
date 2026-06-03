import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { Product } from '../types';

interface DeleteConfirmModalProps {
  selectedProduct: Product;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  selectedProduct,
  onClose,
  onConfirm
}) => {
  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '440px' }}>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: '#fff1f2', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', margin: '0 auto 20px auto' }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>
            Terminate SKU Catalog Node?
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, fontWeight: 550 }}>
            This will permanently remove <strong style={{ color: '#0f172a' }}>{selectedProduct.name}</strong> from the active SKU database catalog directory. Historical ledger logs will be archived. This action is irreversible.
          </p>
        </div>

        <div style={{ padding: '20px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px', background: '#f8fafc' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, background: '#ffffff', border: '1.5px solid #e2e8f0', color: '#475569', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}
          >
            No, Keep Product
          </button>
          <button 
            onClick={onConfirm}
            style={{ flex: 1, background: '#dc2626', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)' }}
          >
            Yes, Terminate
          </button>
        </div>
      </div>
    </div>
  );
};
