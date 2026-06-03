import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`custom-toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={16} />}
          {toast.type === 'error' && <AlertCircle size={16} />}
          {toast.type === 'warning' && <AlertCircle size={16} />}
          {toast.type === 'info' && <AlertCircle size={16} />}
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
