import React from 'react';
import type { LocalizationSettings } from '../types';

interface SettingsLocalizationSectionProps {
  localization: LocalizationSettings;
  onChange: (field: keyof LocalizationSettings, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SettingsLocalizationSection: React.FC<SettingsLocalizationSectionProps> = ({
  localization,
  onChange,
  onSubmit
}) => (
  <div>
    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Currency &amp; Localization</h2>
    <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
      Set display standardizations for global currencies and time formats.
    </p>

    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label className="settings-label">Base Ledger Currency</label>
          <select
            className="settings-input"
            value={localization.currency}
            onChange={(e) => onChange('currency', e.target.value)}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>

        <div>
          <label className="settings-label">Target Timezone</label>
          <select
            className="settings-input"
            value={localization.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
          >
            <option value="IST">India Standard Time (IST - UTC+5:30)</option>
            <option value="UTC">Coordinated Universal Time (UTC)</option>
            <option value="EST">Eastern Standard Time (EST - UTC-5)</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '28px', maxWidth: '300px' }}>
        <label className="settings-label">Default Date Formatting</label>
        <select
          className="settings-input"
          value={localization.dateFormat}
          onChange={(e) => onChange('dateFormat', e.target.value)}
        >
          <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 26-05-2026)</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-05-26)</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/26/2026)</option>
        </select>
      </div>

      <button type="submit" className="settings-save-btn">
        Save Localizations
      </button>
    </form>
  </div>
);
