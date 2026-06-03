import React from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  business: { name: string } | null;
  loading: boolean;
  refreshData: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  business,
  loading,
  refreshData,
}) => {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 250, 252, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '24px 32px',
        color: '#1e293b',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.03)',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}
    >
      {/* Subtle lavender accent background glow */}
      <div
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 70%)',
          right: '-30px',
          top: '-30px',
          pointerEvents: 'none',
        }}
      />

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.06)',
              color: '#4f46e5',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '0.74rem',
              fontWeight: 700,
              border: '1px solid rgba(99, 102, 241, 0.12)',
            }}
          >
            ✨ Viyan Enterprise
          </span>
          <span
            className="live-beacon"
            style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}
          >
            Real-Time Sync
          </span>
        </div>

        <h1
          style={{
            fontSize: '1.9rem',
            fontWeight: 850,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Business Overview
        </h1>
        <p
          style={{
            color: '#475569',
            fontSize: '0.88rem',
            marginTop: '4px',
            maxWidth: '620px',
            lineHeight: 1.4,
          }}
        >
          Real-time business operations panel for{' '}
          <strong style={{ color: '#4f46e5' }}>
            {business?.name || 'BURJ'}
          </strong>
          . Track stock, purchases, logistics, and sales activities.
        </p>
      </div>

      {/* Action Row inside banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2 }}>
        <button
          onClick={refreshData}
          className="action-tab-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            color: '#475569',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
          }}
          title="Sync metrics backlog"
        >
          <RefreshCw
            size={16}
            className={loading ? 'spin-loader' : ''}
          />
        </button>

        <button
          className="action-tab-pill"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)',
          }}
        >
          <Calendar size={16} /> Export Report
        </button>
      </div>
    </div>
  );
};
