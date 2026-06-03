import React from 'react';
import { Key } from 'lucide-react';

interface SettingsSecuritySectionProps {
  twoFactor: boolean;
  sessionTimeout: string;
  apiKey: string;
  onTwoFactorChange: (v: boolean) => void;
  onSessionTimeoutChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SettingsSecuritySection: React.FC<SettingsSecuritySectionProps> = ({
  twoFactor,
  sessionTimeout,
  apiKey,
  onTwoFactorChange,
  onSessionTimeoutChange,
  onSubmit
}) => (
  <div>
    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Security Controls</h2>
    <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
      Regulate API integrations and user session timeout limits.
    </p>

    <form onSubmit={onSubmit}>
      {/* 2FA Toggle Row */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', margin: 0 }}>Two-Factor Authentication (2FA)</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>
            Enforce secure Google Authenticator/SMS logins for operations hubs.
          </p>
        </div>
        <label className="settings-toggle-switch">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={(e) => onTwoFactorChange(e.target.checked)}
          />
          <span className="settings-slider" />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <label className="settings-label">User Session Timeout (Mins)</label>
          <select
            className="settings-input"
            value={sessionTimeout}
            onChange={(e) => onSessionTimeoutChange(e.target.value)}
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="never">Never Timeout</option>
          </select>
        </div>

        <div>
          <label className="settings-label">System API Key (Standard Dev)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              readOnly
              className="settings-input"
              value={apiKey}
              style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b', fontFamily: 'monospace' }}
            />
            <Key size={16} color="#94a3b8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </div>

      <button type="submit" className="settings-save-btn">
        Confirm Security Audits
      </button>
    </form>
  </div>
);
