import React from 'react';
import { Search, Table, LayoutGrid } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: 'all' | 'low' | 'oos' | 'high_val';
  setActiveTab: (tab: 'all' | 'low' | 'oos' | 'high_val') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="search-container">
      <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input 
          type="text" 
          placeholder="Search by product name, SKU, or category..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px 12px 48px', 
            border: '1.5px solid #e2e8f0', 
            borderRadius: '14px', 
            fontSize: '0.9rem', 
            background: '#ffffff',
            fontWeight: 600,
            outline: 'none'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button 
          className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Products
        </button>
        <button 
          className={`filter-tab ${activeTab === 'low' ? 'active' : ''}`}
          onClick={() => setActiveTab('low')}
        >
          Low Stock
        </button>
        <button 
          className={`filter-tab ${activeTab === 'oos' ? 'active' : ''}`}
          onClick={() => setActiveTab('oos')}
        >
          Out of Stock
        </button>
        <button 
          className={`filter-tab ${activeTab === 'high_val' ? 'active' : ''}`}
          onClick={() => setActiveTab('high_val')}
        >
          High Value
        </button>
      </div>

      {/* Layout Switcher */}
      <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px', marginLeft: 'auto' }}>
        <button 
          onClick={() => setViewMode('table')}
          style={{ 
            border: 'none', 
            padding: '8px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            background: viewMode === 'table' ? '#ffffff' : 'transparent',
            color: viewMode === 'table' ? '#6366f1' : '#64748b',
            boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Table size={16} />
        </button>
        <button 
          onClick={() => setViewMode('grid')}
          style={{ 
            border: 'none', 
            padding: '8px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            background: viewMode === 'grid' ? '#ffffff' : 'transparent',
            color: viewMode === 'grid' ? '#6366f1' : '#64748b',
            boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <LayoutGrid size={16} />
        </button>
      </div>
    </div>
  );
};
