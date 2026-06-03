import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="premium-toast" style={{ position: 'relative' }}>
          <div 
            className="toast-bar"
            style={{
              background: 
                t.type === 'success' ? '#059669' :
                t.type === 'warning' ? '#d97706' :
                t.type === 'error' ? '#dc2626' : '#2563eb'
            }}
          />
          {t.type === 'success' && <CheckCircle2 color="#059669" size={20} />}
          {t.type === 'warning' && <AlertTriangle color="#d97706" size={20} />}
          {t.type === 'error' && <AlertCircle color="#dc2626" size={20} />}
          {t.type === 'info' && <AlertCircle color="#2563eb" size={20} />}
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
};
