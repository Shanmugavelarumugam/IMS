import React from 'react';
import { Trash2 } from 'lucide-react';

interface CategoriesDeleteConfirmModalProps {
  categoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CategoriesDeleteConfirmModal: React.FC<CategoriesDeleteConfirmModalProps> = ({
  categoryName,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="cat-premium-modal-overlay">
      <div className="cat-premium-modal-content" style={{ textAlign: 'center', width: '400px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '18px', background: '#ffe4e6',
          color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Trash2 size={24} />
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Remove Category?</h3>
        <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 650, lineHeight: 1.4, margin: '0 0 24px 0' }}>
          Are you sure you want to delete category &ldquo;{categoryName}&rdquo;? All associated taxonomy links will be dissolved. This action is irreversible.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
              background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.86rem',
              cursor: 'pointer', outline: 'none'
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
              background: '#e11d48', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem',
              cursor: 'pointer', outline: 'none'
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
