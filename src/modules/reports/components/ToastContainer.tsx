import React from 'react';
import { X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="alert-toasts-box">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="alert-toast-item" 
          style={{ 
            borderLeftColor: 
              t.type === 'success' 
                ? '#059669' 
                : t.type === 'warning' 
                  ? '#ea580c' 
                  : t.type === 'error' 
                    ? '#e11d48' 
                    : '#7c3aed' 
          }}
        >
          <span style={{ flex: 1 }}>{t.text}</span>
          <button 
            type="button"
            onClick={() => onRemoveToast(t.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, outline: 'none' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
