import React from 'react';
import { Search, X, LayoutGrid, Table } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: 'all' | 'credit' | 'distributor' | 'key' | 'retail';
  setActiveTab: (tab: 'all' | 'credit' | 'distributor' | 'key' | 'retail') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
}) => {
  return (
    <div
      className="search-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          flex: 1,
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', width: '350px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Search customers by name, contact, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 44px',
              border: '1.5px solid #F1F5F9',
              background: '#F8FAFC',
              borderRadius: '12px',
              fontWeight: 650,
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '0px' }}>
          <button
            onClick={() => setActiveTab('all')}
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Accounts
          </button>
          <button
            onClick={() => setActiveTab('credit')}
            className={`filter-tab ${activeTab === 'credit' ? 'active' : ''}`}
          >
            Pending Payments
          </button>
          <button
            onClick={() => setActiveTab('key')}
            className={`filter-tab ${activeTab === 'key' ? 'active' : ''}`}
          >
            Key Customers
          </button>
          <button
            onClick={() => setActiveTab('distributor')}
            className={`filter-tab ${activeTab === 'distributor' ? 'active' : ''}`}
          >
            Distributors
          </button>
          <button
            onClick={() => setActiveTab('retail')}
            className={`filter-tab ${activeTab === 'retail' ? 'active' : ''}`}
          >
            Retail
          </button>
        </div>
      </div>

      {/* View Mode Toggle (Grid vs. Table) */}
      <div
        style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          gap: '2px',
        }}
      >
        <button
          onClick={() => setViewMode('grid')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            border: 'none',
            borderRadius: '9px',
            background: viewMode === 'grid' ? '#ffffff' : 'transparent',
            color: viewMode === 'grid' ? '#6366f1' : '#64748b',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s',
            lineHeight: 1,
          }}
        >
          <LayoutGrid size={14} /> Grid
        </button>
        <button
          onClick={() => setViewMode('table')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            border: 'none',
            borderRadius: '9px',
            background: viewMode === 'table' ? '#ffffff' : 'transparent',
            color: viewMode === 'table' ? '#6366f1' : '#64748b',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s',
            lineHeight: 1,
          }}
        >
          <Table size={14} /> Table
        </button>
      </div>
    </div>
  );
};
