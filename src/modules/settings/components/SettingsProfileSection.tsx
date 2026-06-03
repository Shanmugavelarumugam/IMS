import React from 'react';
import type { ProfileSettings } from '../types';

interface SettingsProfileSectionProps {
  profile: ProfileSettings;
  onChange: (field: keyof ProfileSettings, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SettingsProfileSection: React.FC<SettingsProfileSectionProps> = ({
  profile,
  onChange,
  onSubmit
}) => (
  <div>
    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Enterprise Profile</h2>
    <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
      Identify corporate taxonomy parameters for localized GSTIN auditing.
    </p>

    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label className="settings-label">Registered Corporate Name</label>
          <input
            type="text"
            className="settings-input"
            value={profile.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
          />
        </div>
        <div>
          <label className="settings-label">Tax ID (GSTIN)</label>
          <input
            type="text"
            className="settings-input"
            value={profile.gstin}
            onChange={(e) => onChange('gstin', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label className="settings-label">Operations Email Address</label>
          <input
            type="email"
            className="settings-input"
            value={profile.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className="settings-label">Contact Phone Number</label>
          <input
            type="text"
            className="settings-input"
            value={profile.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label className="settings-label">Registered Office Address</label>
        <textarea
          rows={3}
          className="settings-input"
          value={profile.address}
          onChange={(e) => onChange('address', e.target.value)}
          style={{ fontFamily: 'inherit', resize: 'none' }}
        />
      </div>

      <button type="submit" className="settings-save-btn">
        Save Profile Configurations
      </button>
    </form>
  </div>
);
