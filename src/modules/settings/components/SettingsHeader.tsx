import React from 'react';
import { Settings } from 'lucide-react';

export const SettingsHeader: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '6px' }}>
        <Settings size={16} />
        <span style={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Administration Center</span>
      </div>
      <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>System Settings</h1>
      <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 600, fontSize: '0.94rem' }}>
        Configure localized parameters, audit security policies, and manage offline databases.
      </p>
    </div>
  </div>
);
