import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface SearchFilterBarProps {
  activeTab: string;
  activeViewGroup: string;
  filteredCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  reportType: string;
  setReportType: (type: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  onRefresh: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  activeTab,
  activeViewGroup,
  filteredCount,
  searchQuery,
  setSearchQuery,
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  onRefresh,
}) => {
  const getSectionTitle = () => {
    if (activeTab === 'all') {
      if (activeViewGroup === 'favorites') return 'Favorite Reports';
      if (activeViewGroup === 'shared') return 'Shared Records';
      if (activeViewGroup === 'scheduled') return 'Scheduled Ledgers';
      return 'All Reports';
    }
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Reports';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {getSectionTitle()}
        </span>
        <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
          {filteredCount}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '180px' }}>
          <Search size={13} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search ledger..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '6px 10px 6px 28px', borderRadius: '8px',
              border: '1px solid #e8ecf4', background: '#ffffff', fontSize: '0.78rem',
              fontWeight: 500, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Category Dropdown */}
        <select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)} 
          style={{
            padding: '6px 10px', borderRadius: '8px', border: '1px solid #e8ecf4',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: '#ffffff', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="all">Category</option>
          <option value="audit">Audit</option>
          <option value="analytics">Analytics</option>
        </select>

        {/* Date Filter */}
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '6px 10px', borderRadius: '8px', border: '1px solid #e8ecf4',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: '#ffffff', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="all">Timeframe</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>

        <button 
          onClick={onRefresh}
          style={{
            border: '1px solid #e8ecf4', background: '#ffffff', color: 'var(--text-secondary)',
            width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none'
          }}
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  );
};
