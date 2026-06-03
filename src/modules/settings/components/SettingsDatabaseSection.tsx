import React from 'react';
import { Download, Trash2 } from 'lucide-react';

interface SettingsDatabaseSectionProps {
  onBackup: () => void;
  onWipeCache: () => void;
}

export const SettingsDatabaseSection: React.FC<SettingsDatabaseSectionProps> = ({
  onBackup,
  onWipeCache
}) => (
  <div>
    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Database &amp; Local Backup</h2>
    <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
      Wipe active local database instances or compile full JSON backups.
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Backup card */}
      <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Download size={24} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#065f46', margin: 0 }}>Download Local DB Registry</h4>
          <p style={{ fontSize: '0.82rem', color: '#047857', marginTop: '6px', fontWeight: 600, lineHeight: 1.5 }}>
            Compile and download all product inventories, customer directories, local settings, and purchase registries into a single offline JSON ledger backup.
          </p>
          <button
            onClick={onBackup}
            style={{
              marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#059669',
              color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none'
            }}
          >
            Export Database Backup
          </button>
        </div>
      </div>

      {/* Wipe cache card */}
      <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Trash2 size={24} color="#be123c" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#9f1239', margin: 0 }}>Reset Cache Databases</h4>
          <p style={{ fontSize: '0.82rem', color: '#be123c', marginTop: '6px', fontWeight: 600, lineHeight: 1.5 }}>
            Permanently wipe all offline local storage databases (Categories, Inventory, Invoices, Sales, Products). All customized mock records will revert to initial factory settings.
          </p>
          <button
            onClick={onWipeCache}
            style={{
              marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e11d48',
              color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none'
            }}
          >
            Wipe Database &amp; Reset
          </button>
        </div>
      </div>

    </div>
  </div>
);
