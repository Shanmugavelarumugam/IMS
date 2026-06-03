import React from 'react';
import { X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast
}) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="toast-card" 
          style={{ 
            borderLeftColor: t.type === 'success' ? '#059669' : t.type === 'warning' ? '#ea580c' : t.type === 'error' ? '#e11d48' : '#6366f1' 
          }}
        >
          <span style={{ flex: 1 }}>{t.text}</span>
          <button 
            onClick={() => onRemoveToast(t.id)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, outline: 'none' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
