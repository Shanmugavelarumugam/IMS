import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="toasts-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-card ${t.type}`}>
          {t.type === 'success' && <CheckCircle2 size={20} color="#10b981" />}
          {t.type === 'warning' && <AlertCircle size={20} color="#f59e0b" />}
          {t.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
          {t.type === 'info' && <ShieldCheck size={20} color="#3b82f6" />}
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', flex: 1 }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
};
