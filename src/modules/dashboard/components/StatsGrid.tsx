import React from 'react';
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  shadow: string;
  sparkline: string;
  delay: string;
}

interface StatsGridProps {
  stats: MetricItem[];
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  setActiveMetricIds: React.Dispatch<React.SetStateAction<string[]>>;
  setShowMetricsConfig: (show: boolean) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  hoveredCard,
  setHoveredCard,
  setActiveMetricIds,
  setShowMetricsConfig,
}) => {
  return (
    <div className="stats-grid">
      {stats.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className="luxury-glass-card"
            style={{
              animationDelay: item.delay,
              animation: 'slideUp 0.5s ease backwards',
              background: '#ffffff',
              padding: '24px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow:
                hoveredCard === item.id
                  ? '0 12px 30px rgba(0, 0, 0, 0.04)'
                  : '0 4px 12px rgba(9, 14, 29, 0.01)',
              borderColor:
                hoveredCard === item.id
                  ? 'rgba(99, 102, 241, 0.35)'
                  : 'rgba(226, 232, 240, 0.8)',
              transform: hoveredCard === item.id ? 'translateY(-4px)' : 'none',
              borderRadius: '20px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
            }}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Float hover delete button */}
            {hoveredCard === item.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMetricIds((prev) => prev.filter((id) => id !== item.id));
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#fee2e2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ef4444',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                }}
                title="Remove card"
              >
                <X size={12} />
              </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {item.label}
                </span>

                <div
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 850,
                    color: '#0F172A',
                    marginTop: '8px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {item.value}
                </div>
              </div>

              <div
                style={{
                  background: `${item.color}08`,
                  padding: '10px',
                  borderRadius: '12px',
                  color: item.color,
                  border: `1px solid ${item.color}15`,
                  transition: 'all 0.3s ease',
                  transform:
                    hoveredCard === item.id ? 'scale(1.08) rotate(3deg)' : 'scale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconComponent size={18} />
              </div>
            </div>

            {/* Soft divider line instead of squiggly lines */}
            <div
              style={{
                height: '1px',
                background: 'rgba(226, 232, 240, 0.5)',
                margin: '16px 0 12px 0',
              }}
            />

            {/* Dynamic Trend Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className={`badge-capsule ${
                  item.isPositive ? 'badge-capsule-success' : 'badge-capsule-warning'
                }`}
                style={{ scale: '0.9', transformOrigin: 'left' }}
              >
                {item.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                <span>{item.change}</span>
              </span>

              <span
                style={{
                  color: '#94A3B8',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                }}
              >
                vs last week
              </span>
            </div>
          </div>
        );
      })}

      {/* Empty slot placeholder cards (so exactly 4 slots are always present) */}
      {Array.from({ length: Math.max(0, 4 - stats.length) }).map((_, idx) => (
        <button
          key={`empty-slot-${idx}`}
          onClick={() => setShowMetricsConfig(true)}
          style={{
            background: 'rgba(248, 250, 252, 0.4)',
            border: '2px dashed rgba(99, 102, 241, 0.15)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            height: '100%',
            minHeight: '148px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.4)';
          }}
        >
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.05)',
              color: '#4f46e5',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={18} />
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Add Highlight
          </span>
        </button>
      ))}
    </div>
  );
};
