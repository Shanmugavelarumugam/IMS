import React from 'react';
import { Search, Grid, Table, Download } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: 'all' | 'pending' | 'completed' | 'cancelled';
  setActiveTab: (tab: 'all' | 'pending' | 'completed' | 'cancelled') => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  onExportCSV: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onExportCSV,
}) => {
  return (
    <div className="search-container">
      <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search sales logs by ID, client or payment mode..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px',
            border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.88rem',
            fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('all')} className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}>All</button>
        <button onClick={() => setActiveTab('pending')} className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}>Pending Dispatch</button>
        <button onClick={() => setActiveTab('completed')} className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}>Fulfilled</button>
        <button onClick={() => setActiveTab('cancelled')} className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}>Voided</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ 
              padding: '6px 10px', borderRadius: '8px', border: 'none', 
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? '#6366f1' : '#64748b', cursor: 'pointer', outline: 'none'
            }}
          >
            <Grid size={16} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            style={{ 
              padding: '6px 10px', borderRadius: '8px', border: 'none', 
              background: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#6366f1' : '#64748b', cursor: 'pointer', outline: 'none'
            }}
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
