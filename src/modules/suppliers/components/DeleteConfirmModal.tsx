import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Supplier } from '../types';

interface DeleteConfirmModalProps {
  selectedSupplier: Supplier;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  selectedSupplier,
  onClose,
  onConfirm
}) => {
  return (
    <div className="premium-modal-overlay" style={{ zIndex: 11000 }}>
      <div className="premium-modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ padding: '30px' }}>
          <div style={{ 
            height: '56px', width: '56px', background: '#fff1f2', color: '#e11d48', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 18px'
          }}>
            <Trash2 size={28} />
          </div>
          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Delete Supplier?
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 550, marginTop: '8px', lineHeight: 1.5 }}>
            You are about to remove <strong>{selectedSupplier.name}</strong> from the database. This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              onClick={onClose}
              style={{ flex: 1, background: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              style={{ flex: 1, background: '#e11d48', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)' }}
            >
              Delete Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
