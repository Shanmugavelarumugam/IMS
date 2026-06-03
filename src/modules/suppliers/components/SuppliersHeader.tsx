import React from 'react';
import { Plus, Download } from 'lucide-react';

interface SuppliersHeaderProps {
  onExport: () => void;
  onAddSupplier: () => void;
}

export const SuppliersHeader: React.FC<SuppliersHeaderProps> = ({
  onExport,
  onAddSupplier
}) => {
  return (
    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.035em', margin: 0 }}>
          Supplier Management
        </h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontWeight: 600, fontSize: '0.94rem' }}>
          Monitor supplier performance, pending payments, and procurement activities.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onExport}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            borderRadius: '14px', 
            padding: '12px 20px', 
            fontWeight: 850,
            cursor: 'pointer',
            border: '1.5px solid #cbd5e1',
            background: '#ffffff',
            color: '#475569',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
            e.currentTarget.style.color = '#1e293b';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <Download size={18} /> Export
        </button>

        <button 
          onClick={onAddSupplier}
          className="btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            borderRadius: '14px', 
            padding: '12px 24px', 
            fontWeight: 800,
            cursor: 'pointer',
            border: 'none',
            background: 'var(--primary-glow)',
            color: 'white',
            boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.2)'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Add Supplier
        </button>
      </div>
    </div>
  );
};
