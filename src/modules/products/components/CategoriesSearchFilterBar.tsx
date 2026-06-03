import React from 'react';
import { Search, Grid, Table, Download } from 'lucide-react';

interface CategoriesSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  activeTab: 'all' | 'high' | 'low' | 'empty';
  onTabChange: (t: 'all' | 'high' | 'low' | 'empty') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (m: 'grid' | 'table') => void;
  onExportCSV: () => void;
}

export const CategoriesSearchFilterBar: React.FC<CategoriesSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  onExportCSV
}) => {
  return (
    <div className="cat-search-container">
      <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search categories by name, code or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px',
            border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.88rem',
            fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'high', 'low', 'empty'] as const).map((tab) => {
          const labels: Record<string, string> = {
            all: 'All',
            high: 'High Density (≥20)',
            low: 'Low Density',
            empty: 'Empty'
          };
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`cat-filter-tab${activeTab === tab ? ' active' : ''}`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <div className="cat-view-toggle">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`cat-view-btn${viewMode === 'grid' ? ' active' : ''}`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`cat-view-btn${viewMode === 'table' ? ' active' : ''}`}
          >
            <Table size={16} />
          </button>
        </div>

        <button
          onClick={onExportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
            borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#ffffff',
            color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none'
          }}
        >
          <Download size={16} /> Export
        </button>
      </div>
    </div>
  );
};
