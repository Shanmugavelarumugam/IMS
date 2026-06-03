import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SellingItem {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  stock: number;
  margin: number;
  image: string;
  category: string;
}

interface TopSellingItemsProps {
  topSellingItems: SellingItem[];
  sortedSellingItems: SellingItem[];
  topSellingSort: 'sold' | 'revenue';
  setTopSellingSort: (sort: 'sold' | 'revenue') => void;
}

export const TopSellingItems: React.FC<TopSellingItemsProps> = ({
  topSellingItems,
  sortedSellingItems,
  topSellingSort,
  setTopSellingSort,
}) => {
  return (
    <div className="luxury-glass-card" style={{ padding: '28px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 850,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            <TrendingUp size={22} color="#6366f1" /> Top Selling Items
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Highest turnover velocity inventory stock SKU records
          </p>
        </div>

        {/* Sort controls */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(100, 116, 139, 0.08)',
            borderRadius: '10px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setTopSellingSort('sold')}
            style={{
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: topSellingSort === 'sold' ? '#ffffff' : 'transparent',
              color: topSellingSort === 'sold' ? '#0F172A' : '#64748B',
              boxShadow:
                topSellingSort === 'sold' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Units Sold
          </button>
          <button
            onClick={() => setTopSellingSort('revenue')}
            style={{
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: topSellingSort === 'revenue' ? '#ffffff' : 'transparent',
              color: topSellingSort === 'revenue' ? '#0F172A' : '#64748B',
              boxShadow:
                topSellingSort === 'revenue' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Turnover Value
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sortedSellingItems.map((item, index) => {
          const maxUnits = Math.max(...topSellingItems.map((i) => i.sold));
          const maxRevenue = Math.max(...topSellingItems.map((i) => i.revenue));
          const percentage =
            topSellingSort === 'sold'
              ? (item.sold / maxUnits) * 100
              : (item.revenue / maxRevenue) * 100;

          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Premium Rank Indicator */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background:
                    index === 0
                      ? 'rgba(245, 158, 11, 0.08)'
                      : index === 1
                        ? 'rgba(148, 163, 184, 0.08)'
                        : index === 2
                          ? 'rgba(234, 88, 12, 0.08)'
                          : 'transparent',
                  color:
                    index === 0
                      ? '#d97706'
                      : index === 1
                        ? '#475569'
                        : index === 2
                          ? '#c2410c'
                          : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 850,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>

              {/* Sleek Item Avatar */}
              <div
                style={{
                  fontSize: '1.4rem',
                  width: '44px',
                  height: '44px',
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)',
                  border: '1.5px solid rgba(226, 232, 240, 0.6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.015)',
                }}
              >
                {item.image}
              </div>

              {/* Content block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 850, color: '#4f46e5', fontSize: '0.94rem' }}>
                    {topSellingSort === 'sold'
                      ? `${item.sold} units`
                      : `₹${item.revenue.toLocaleString()}`}
                  </span>
                </div>

                {/* Ultra-sleek micro progress slider */}
                <div
                  style={{
                    height: '6px',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '6px 0',
                  }}
                >
                  <div
                    className="progress-shimmer"
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      borderRadius: '10px',
                      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    marginTop: '4px',
                  }}
                >
                  <span>
                    Category:{' '}
                    <strong style={{ color: '#334155', fontWeight: 650 }}>
                      {item.category}
                    </strong>{' '}
                    • Profit Margin:{' '}
                    <strong style={{ color: '#334155', fontWeight: 650 }}>
                      {item.margin}%
                    </strong>
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: item.stock < 30 ? '#ef4444' : '#10b981',
                      fontWeight: 755,
                      fontSize: '0.76rem',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: item.stock < 30 ? '#ef4444' : '#10b981',
                        display: 'inline-block',
                      }}
                    />
                    {item.stock} left
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
