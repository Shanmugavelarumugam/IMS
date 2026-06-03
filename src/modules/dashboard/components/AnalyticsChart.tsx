import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ChartDataItem {
  date: string;
  value: number;
  orders: number;
  growth: number;
  revenuePerOrder: string;
}

interface PointItem {
  x: number;
  y: number;
}

interface AnalyticsChartProps {
  activeMetric: 'revenue' | 'orders';
  setActiveMetric: (metric: 'revenue' | 'orders') => void;
  chartRange: '7d' | '30d';
  setChartRange: (range: '7d' | '30d') => void;
  chartData: ChartDataItem[];
  points: PointItem[];
  fillPath: string;
  splinePath: string;
  maxVal: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  svgWidth: number;
  svgHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  activeMetric,
  setActiveMetric,
  chartRange,
  setChartRange,
  chartData,
  points,
  fillPath,
  splinePath,
  maxVal,
  hoveredIdx,
  setHoveredIdx,
  svgWidth,
  svgHeight,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
}) => {
  return (
    <div className="luxury-glass-card" style={{ padding: '28px', marginBottom: '28px', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
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
            <TrendingUp size={22} color="#6366f1" /> Operational Analytics
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Real-time transactional cash flows, order velocities, and shipment assets
          </p>
        </div>

        {/* Interactive Toggles */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Metric Switcher */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '4px',
              border: '1px solid rgba(0,0,0,0.02)',
            }}
          >
            <button
              onClick={() => setActiveMetric('revenue')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeMetric === 'revenue' ? '#ffffff' : 'transparent',
                color: activeMetric === 'revenue' ? '#6366f1' : '#64748B',
                boxShadow:
                  activeMetric === 'revenue'
                    ? '0 3px 8px rgba(99, 102, 241, 0.12)'
                    : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveMetric('orders')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeMetric === 'orders' ? '#ffffff' : 'transparent',
                color: activeMetric === 'orders' ? '#6366f1' : '#64748B',
                boxShadow:
                  activeMetric === 'orders'
                    ? '0 3px 8px rgba(99, 102, 241, 0.12)'
                    : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Orders
            </button>
          </div>

          {/* Range Switcher */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '4px',
              border: '1px solid rgba(0,0,0,0.02)',
            }}
          >
            <button
              onClick={() => setChartRange('7d')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: chartRange === '7d' ? '#ffffff' : 'transparent',
                color: chartRange === '7d' ? '#0F172A' : '#64748B',
                boxShadow: chartRange === '7d' ? '0 3px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartRange('30d')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: chartRange === '30d' ? '#ffffff' : 'transparent',
                color: chartRange === '30d' ? '#0F172A' : '#64748B',
                boxShadow: chartRange === '30d' ? '0 3px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '16px' }}>
        {/* SVG Graph Drawing */}
        <svg
          viewBox="0 0 680 200"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Glowing chart fill linear gradient */}
            <linearGradient id="chart-glow-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing chart line linear gradient */}
            <linearGradient id="chart-line-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * (svgHeight - paddingTop - paddingBottom);
            const labelVal = maxVal - ratio * maxVal;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="rgba(226, 232, 240, 0.5)"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 650,
                    fill: '#94a3b8',
                    fontFamily: 'monospace',
                  }}
                >
                  {activeMetric === 'revenue'
                    ? `₹${Math.round(labelVal / 1000)}k`
                    : Math.round(labelVal)}
                </text>
              </g>
            );
          })}

          {/* Bezier spline filled area underneath */}
          {fillPath && (
            <path
              d={fillPath}
              fill="url(#chart-glow-fill)"
              style={{ transition: 'all 0.5s ease' }}
            />
          )}

          {/* Bezier Spline Stroke line */}
          {splinePath && (
            <>
              {/* Background neon soft blur glow line */}
              <path
                d={splinePath}
                fill="none"
                stroke="rgba(99, 102, 241, 0.15)"
                strokeWidth="7"
                strokeLinecap="round"
                style={{ transition: 'all 0.5s ease' }}
              />
              {/* Sharp primary glowing line */}
              <path
                d={splinePath}
                fill="none"
                stroke="url(#chart-line-gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{ transition: 'all 0.5s ease' }}
              />
            </>
          )}

          {/* Date labels on X Axis */}
          {chartData.map((d, i) => {
            const x = points[i]?.x;
            return (
              <text
                key={i}
                x={x}
                y={svgHeight - 8}
                textAnchor="middle"
                style={{ fontSize: '0.7rem', fontWeight: 700, fill: '#64748b' }}
              >
                {d.date}
              </text>
            );
          })}

          {/* Active hovered node column indicator lines */}
          {hoveredIdx !== null && points[hoveredIdx] && (
            <g>
              <line
                x1={points[hoveredIdx].x}
                y1={paddingTop}
                x2={points[hoveredIdx].x}
                y2={svgHeight - paddingBottom}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />

              {/* Active point outer pulsing ring */}
              <circle
                cx={points[hoveredIdx].x}
                cy={points[hoveredIdx].y}
                r="8"
                fill="rgba(99, 102, 241, 0.22)"
              />

              {/* Active point inner sharp node */}
              <circle
                cx={points[hoveredIdx].x}
                cy={points[hoveredIdx].y}
                r="4.5"
                fill="#6366f1"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Interactive invisible hover column rectangles */}
          {points.map((pt, i) => {
            const colWidth = (svgWidth - paddingLeft - paddingRight) / chartData.length;
            const xStart = pt.x - colWidth / 2;
            return (
              <rect
                key={i}
                x={xStart}
                y={paddingTop}
                width={colWidth}
                height={svgHeight - paddingTop - paddingBottom}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Floating Glassmorphic Tooltip Card */}
        {hoveredIdx !== null && points[hoveredIdx] && chartData[hoveredIdx] && (
          <div
            style={{
              position: 'absolute',
              left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIdx].y / svgHeight) * 100 - 32}%`,
              transform: 'translate(-50%, -100%)',
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
              border: '1px solid rgba(255,255,255,0.15)',
              pointerEvents: 'none',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              whiteSpace: 'nowrap',
              transition: 'left 0.15s ease-out, top 0.15s ease-out',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                color: '#94a3b8',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {chartData[hoveredIdx].date}
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 850 }}>
              {activeMetric === 'revenue'
                ? `₹${chartData[hoveredIdx].value.toLocaleString()}`
                : `${chartData[hoveredIdx].orders} Orders`}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.74rem',
                marginTop: '2px',
              }}
            >
              <span
                style={{
                  color: chartData[hoveredIdx].growth >= 0 ? '#10b981' : '#ef4444',
                  fontWeight: 750,
                }}
              >
                {chartData[hoveredIdx].growth >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(chartData[hoveredIdx].growth)}% growth
              </span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                {chartData[hoveredIdx].revenuePerOrder} / order
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
