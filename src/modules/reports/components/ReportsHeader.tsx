import React from 'react';
import { Sparkles, Download, Plus } from 'lucide-react';

interface ReportsHeaderProps {
  onExportAll: () => void;
  onOpenCustomModal: () => void;
  onOpenGenerateModal: () => void;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onExportAll,
  onOpenCustomModal,
  onOpenGenerateModal,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Reports Center
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>Configure, export, and extract analytical records.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onExportAll} className="btn-outline-violet">
          <Download size={14} /> Export Directory
        </button>
        
        <button onClick={onOpenCustomModal} className="btn-outline-violet">
          Custom Report
        </button>

        <button onClick={onOpenGenerateModal} className="btn-primary-glow">
          <Plus size={15} /> Generate Report
        </button>
      </div>
    </div>
  );
};
