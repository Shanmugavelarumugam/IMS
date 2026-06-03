import React from 'react';
import { X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface SettingsToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const BORDER_COLOR: Record<ToastMessage['type'], string> = {
  success: '#059669',
  warning: '#ea580c',
  error:   '#e11d48',
  info:    '#6366f1'
};

export const SettingsToastContainer: React.FC<SettingsToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="settings-toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="settings-toast-card"
          style={{ borderLeftColor: BORDER_COLOR[t.type] }}
        >
          <span style={{ flex: 1 }}>{t.text}</span>
          <button
            onClick={() => onRemove(t.id)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, outline: 'none' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
