import React from 'react';
import { Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
}

interface DeleteConfirmModalProps {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  selectedCustomer: Customer | null;
  handleDeleteCustomer: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  selectedCustomer,
  handleDeleteCustomer,
}) => {
  if (!showDeleteConfirm || !selectedCustomer) return null;

  return (
    <div className="premium-modal-overlay" style={{ zIndex: 10005 }}>
      <div className="premium-modal-content" style={{ maxWidth: '400px' }}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Trash2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
            Terminate Client Node Account?
          </h3>
          <p
            style={{
              color: '#64748b',
              fontSize: '0.82rem',
              fontWeight: 600,
              margin: '0 0 24px',
              lineHeight: 1.5,
            }}
          >
            Are you sure you want to remove <strong>{selectedCustomer.name}</strong> from the client
            index? This operation will remove all associated credit ledgers.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Keep Account
            </button>
            <button
              onClick={handleDeleteCustomer}
              style={{
                flex: 1,
                padding: '12px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
