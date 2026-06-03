import React from 'react';
import {
  ShoppingCart,
  ShoppingBag,
  Package,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  PieChart,
  BarChart,
  UserCheck,
  Star,
} from 'lucide-react';

interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'All' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemsCount: number;
}

interface ReceiveGRN {
  id: string;
  date: string;
  vendor: string;
  product: string;
  quantity: number;
  batch: string;
  condition: string;
  status: string;
}

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

interface ActivityLog {
  id: string;
  type: string;
  message: string;
  time: string;
  amount: string;
}

interface StockedItem {
  id: string;
  name: string;
  quantity: number;
  valuation: number;
  warehouse: string;
  status: string;
  color: string;
}

interface VendorItem {
  id: string;
  name: string;
  category: string;
  pos: number;
  spend: number;
  rating: number;
  status: string;
  ratingColor: string;
}

interface ActivityPanelProps {
  capsuleTab: 'pending' | 'activities';
  setCapsuleTab: (tab: 'pending' | 'activities') => void;
  salesOrders: SalesOrder[];
  receiveHistory: ReceiveGRN[];
  topSellingItems: SellingItem[];
  dynamicActivities: ActivityLog[];
  hoveredSlice: number | null;
  setHoveredSlice: (slice: number | null) => void;
  hoveredBar: number | null;
  setHoveredBar: (bar: number | null) => void;
  topStockedItems: StockedItem[];
  topVendors: VendorItem[];
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({
  capsuleTab,
  setCapsuleTab,
  salesOrders,
  receiveHistory,
  topSellingItems,
  dynamicActivities,
  hoveredSlice,
  setHoveredSlice,
  hoveredBar,
  setHoveredBar,
  topStockedItems,
  topVendors,
}) => {
  return (
    <>
      {/* 1. UPLOADED CUSTOM WIDGET: PENDING ACTIONS & RECENT ACTIVITIES (High Fidelity Replica) */}
      <div className="luxury-glass-card" style={{ padding: '24px', border: '1.5px solid rgba(99,102,241,0.12)' }}>
        {/* Capsule toggle layout exactly matching your screenshot */}
        <div className="screenshot-tabs-container">
          <button
            className={`screenshot-tab-btn ${capsuleTab === 'pending' ? 'active' : ''}`}
            onClick={() => setCapsuleTab('pending')}
          >
            Pending Actions
          </button>
          <button
            className={`screenshot-tab-btn ${capsuleTab === 'activities' ? 'active' : ''}`}
            onClick={() => setCapsuleTab('activities')}
          >
            Recent Activities
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {capsuleTab === 'pending' ? (
            <div>
              {/* SALES GROUP */}
              <div className="screenshot-sec-header" style={{ color: '#f97316' }}>
                <ShoppingCart size={16} />
                <span>SALES</span>
              </div>

              <div className="screenshot-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#94a3b8" />
                  <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Packed</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
                  {salesOrders.filter((o) => o.status === 'Pending').length}
                </span>
              </div>

              <div className="screenshot-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#94a3b8" />
                  <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Shipped</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
                  {salesOrders.filter((o) => o.status === 'Shipped').length}
                </span>
              </div>

              <div className="screenshot-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#94a3b8" />
                  <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Delivered</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
                  {salesOrders.filter((o) => o.status === 'Pending' || o.status === 'Shipped').length}
                </span>
              </div>

              <div className="screenshot-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#94a3b8" />
                  <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Invoiced</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>2</span>
              </div>

              {/* PURCHASES GROUP */}
              <div className="screenshot-sec-header" style={{ color: '#ea580c' }}>
                <ShoppingBag size={16} />
                <span>PURCHASES</span>
              </div>

              <div className="screenshot-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#94a3b8" />
                  <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Received</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
                  {receiveHistory.filter((r) => r.status === 'Quarantined').length}
                </span>
              </div>

              <div className="screenshot-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#94a3b8" />
                  <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>Receive In Progress</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>1</span>
              </div>

              {/* INVENTORY GROUP */}
              <div className="screenshot-sec-header" style={{ color: '#b45309' }}>
                <Package size={16} />
                <span>INVENTORY</span>
              </div>

              <div
                className="screenshot-list-item"
                style={{
                  background: 'rgba(99, 102, 241, 0.04)',
                  borderRadius: '10px',
                  border: '1px solid rgba(99, 102, 241, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={15} color="#6366f1" />
                  <span style={{ color: '#6366f1', fontSize: '0.94rem', fontWeight: 750 }}>
                    Below Reorder Level
                  </span>
                </div>
                <span style={{ fontWeight: 850, color: '#6366f1', fontSize: '1.1rem' }}>
                  {topSellingItems.filter((i) => i.stock < 30).length}
                </span>
              </div>
            </div>
          ) : (
            /* Activities list subview - Gorgeous Vertical Timeline Feed */
            <div style={{ position: 'relative', paddingLeft: '8px', marginTop: '12px' }}>
              {/* The continuous vertical line track */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  bottom: '12px',
                  left: '15px',
                  width: '2px',
                  background:
                    'linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 0%, rgba(226, 232, 240, 0.2) 100%)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {dynamicActivities.map((act) => {
                  const IconComponent =
                    act.type === 'sale'
                      ? ShoppingCart
                      : act.type === 'grn'
                        ? Package
                        : act.type === 'payment'
                          ? DollarSign
                          : AlertTriangle;

                  const themeColor =
                    act.type === 'sale'
                      ? '#a855f7'
                      : act.type === 'grn'
                        ? '#3b82f6'
                        : act.type === 'payment'
                          ? '#10b981'
                          : '#f59e0b';

                  return (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        position: 'relative',
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Centered timeline node icon with soft hover glow */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: `2.5px solid ${themeColor}`,
                          boxShadow: `0 0 12px ${themeColor}1a`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: themeColor,
                          zIndex: 2,
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={14} strokeWidth={2.5} />
                      </div>

                      {/* Clean, detailed activity text layout */}
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          paddingTop: '3px',
                        }}
                      >
                        <div style={{ minWidth: 0, paddingRight: '8px' }}>
                          <div
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 800,
                              color: '#0f172a',
                              lineHeight: 1.3,
                            }}
                          >
                            {act.type === 'sale'
                              ? 'Order Placed'
                              : act.type === 'grn'
                                ? 'Shipment Received'
                                : act.type === 'payment'
                                  ? 'Payment Recorded'
                                  : act.message.includes('Alert')
                                    ? 'Critical Warning'
                                    : 'Stock Transfer'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: '#475569',
                              marginTop: '4px',
                              lineHeight: 1.4,
                              fontWeight: 500,
                            }}
                          >
                            {act.message}
                          </div>
                        </div>

                        {/* Metadata and Price/Units Badge */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              color:
                                act.type === 'sale'
                                  ? '#4f46e5'
                                  : act.type === 'payment'
                                    ? '#059669'
                                    : '#1e293b',
                            }}
                          >
                            {act.amount}
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: '#94a3b8',
                              fontWeight: 600,
                              display: 'block',
                              marginTop: '2px',
                            }}
                          >
                            {act.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. WAREHOUSE ALLOCATION CHART */}
      <div className="luxury-glass-card" style={{ padding: '24px', marginTop: '28px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 850,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            <PieChart size={20} color="#a855f7" /> Stock Allocation
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>
            Real-time inventory distribution by catalog segments
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          {/* SVG Doughnut */}
          <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
            <svg
              width="130"
              height="130"
              viewBox="0 0 120 120"
              style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
            >
              {/* Background Ring */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="12"
              />

              {/* Slice 1 (45%): Enterprise SSDs */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="transparent"
                stroke="#6366f1"
                strokeWidth={hoveredSlice === 0 ? 16 : 12}
                strokeDasharray="282.74"
                strokeDashoffset="0"
                style={{ transition: 'stroke-width 0.25s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSlice(0)}
                onMouseLeave={() => setHoveredSlice(null)}
              />

              {/* Slice 2 (28%): Accessories */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="transparent"
                stroke="#10b981"
                strokeWidth={hoveredSlice === 1 ? 16 : 12}
                strokeDasharray="282.74"
                strokeDashoffset="-127.23" // 0.45 * 282.74
                style={{ transition: 'stroke-width 0.25s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSlice(1)}
                onMouseLeave={() => setHoveredSlice(null)}
              />

              {/* Slice 3 (17%): Office */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="transparent"
                stroke="#a855f7"
                strokeWidth={hoveredSlice === 2 ? 16 : 12}
                strokeDasharray="282.74"
                strokeDashoffset="-206.40" // (0.45 + 0.28) * 282.74
                style={{ transition: 'stroke-width 0.25s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSlice(2)}
                onMouseLeave={() => setHoveredSlice(null)}
              />

              {/* Slice 4 (10%): Packages */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth={hoveredSlice === 3 ? 16 : 12}
                strokeDasharray="282.74"
                strokeDashoffset="-254.47" // (0.45 + 0.28 + 0.17) * 282.74
                style={{ transition: 'stroke-width 0.25s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSlice(3)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            </svg>

            {/* Center Label (absolute positioned over SVG center) */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: '1.1',
                }}
              >
                {hoveredSlice === 0
                  ? '45%'
                  : hoveredSlice === 1
                    ? '28%'
                    : hoveredSlice === 2
                      ? '17%'
                      : hoveredSlice === 3
                        ? '10%'
                        : '82%'}
              </div>
              <div
                style={{
                  fontSize: '0.62rem',
                  color: '#64748b',
                  fontWeight: 800,
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {hoveredSlice !== null ? 'Share' : 'Capacity'}
              </div>
            </div>
          </div>

          {/* Legend list details column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1,
              minWidth: '120px',
            }}
          >
            {[
              { label: 'Storage & SSDs', percent: 45, color: '#6366f1', value: '6,410' },
              { label: 'Cables & Docks', percent: 28, color: '#10b981', value: '3,990' },
              { label: 'Ergonomic Desk', percent: 17, color: '#a855f7', value: '2,420' },
              { label: 'Packaging sleeves', percent: 10, color: '#f59e0b', value: '1,430' },
            ].map((item, idx) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  background: hoveredSlice === idx ? 'rgba(0,0,0,0.02)' : 'transparent',
                  transition: 'background 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: hoveredSlice === idx ? 800 : 650,
                      color: hoveredSlice === idx ? '#0f172a' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: hoveredSlice === idx ? item.color : '#334155',
                    marginLeft: '8px',
                    flexShrink: 0,
                  }}
                >
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TOP STOCKED ITEMS (Asset Valuation layout) */}
      <div className="luxury-glass-card" style={{ padding: '24px', marginTop: '28px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 850,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            <Package size={20} color="#10b981" /> Top Stocked Items
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>
            Highest asset capital valuation holding items
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topStockedItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                padding: '16px 0',
                borderBottom:
                  index === topStockedItems.length - 1
                    ? 'none'
                    : '1px solid rgba(226, 232, 240, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'transform 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                {/* Beautiful Quantity Badge */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor:
                      item.status === 'Healthy'
                        ? 'rgba(16, 185, 129, 0.06)'
                        : item.status === 'High Stock'
                          ? 'rgba(59, 130, 246, 0.06)'
                          : 'rgba(245, 158, 11, 0.06)',
                    color:
                      item.status === 'Healthy'
                        ? '#10b981'
                        : item.status === 'High Stock'
                          ? '#3b82f6'
                          : '#f59e0b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '0.94rem', fontWeight: 850, lineHeight: 1.1 }}>
                    {item.quantity}
                  </span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 750, opacity: 0.8, letterSpacing: '0.02em' }}>
                    QTY
                  </span>
                </div>

                {/* Content block */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#64748b',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#6366f1' }}>
                      {item.id}
                    </span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span style={{ fontWeight: 500 }}>{item.warehouse}</span>
                  </div>
                </div>
              </div>

              {/* Right column - Stacked Valuation and Status Pill */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontWeight: 850, color: '#0f172a', fontSize: '0.92rem' }}>
                  ₹{item.valuation.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background:
                      item.status === 'Healthy'
                        ? '#ecfdf5'
                        : item.status === 'High Stock'
                          ? '#eff6ff'
                          : '#fffbeb',
                    color:
                      item.status === 'Healthy'
                        ? '#10b981'
                        : item.status === 'High Stock'
                          ? '#3b82f6'
                          : '#f59e0b',
                    border: `1px solid ${
                      item.status === 'Healthy'
                        ? '#d1fae5'
                        : item.status === 'High Stock'
                          ? '#dbeafe'
                          : '#fef3c7'
                    }`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WEEKLY SHIPMENT VELOCITY BAR CHART */}
      <div className="luxury-glass-card" style={{ padding: '24px', marginTop: '28px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 850,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            <BarChart size={20} color="#6366f1" /> Shipment Velocity
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>
            Weekly physical volume dispatched from fulfillment centers
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '230px', marginTop: '10px' }}>
          <svg
            viewBox="0 0 260 230"
            width="100%"
            height="100%"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Glowing bar gradients */}
              <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>

              <linearGradient id="bar-hover-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            {/* Horizontal Threshold Grid Lines */}
            {[0, 0.33, 0.66, 1].map((ratio, idx) => {
              const y = 25 + ratio * 170;
              const labelVal = Math.round(300 - ratio * 300);
              return (
                <g key={idx}>
                  <line
                    x1="30"
                    y1={y}
                    x2="260"
                    y2={y}
                    stroke="rgba(226, 232, 240, 0.4)"
                    strokeDasharray="3,3"
                    strokeWidth="1"
                  />
                  <text
                    x="22"
                    y={y + 3}
                    textAnchor="end"
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 650,
                      fill: '#94a3b8',
                      fontFamily: 'monospace',
                    }}
                  >
                    {labelVal}
                  </text>
                </g>
              );
            })}

            {/* Render 5 Daily Bars */}
            {[
              { day: 'Mon', value: 140 },
              { day: 'Tue', value: 220 },
              { day: 'Wed', value: 185 },
              { day: 'Thu', value: 290 },
              { day: 'Fri', value: 240 },
            ].map((item, idx) => {
              const barWidth = 26;
              const gap = 20;
              const paddingLeft = 40;
              const x = paddingLeft + idx * (barWidth + gap);

              const h = (item.value / 300) * 170;
              const y = 195 - h;

              return (
                <g key={item.day}>
                  {/* Interactive Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={h}
                    rx="5"
                    ry="5"
                    fill={hoveredBar === idx ? 'url(#bar-hover-gradient)' : 'url(#bar-gradient)'}
                    style={{
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      filter:
                        hoveredBar === idx
                          ? 'drop-shadow(0 4px 10px rgba(139, 92, 246, 0.25))'
                          : 'none',
                    }}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Text values directly on top of bars */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 850,
                      fill: hoveredBar === idx ? '#ec4899' : '#64748b',
                      transition: 'color 0.2s ease',
                      fontFamily: 'monospace',
                    }}
                  >
                    {item.value}
                  </text>

                  {/* Day Labels at bottom axis */}
                  <text
                    x={x + barWidth / 2}
                    y="215"
                    textAnchor="middle"
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      fill: hoveredBar === idx ? '#4f46e5' : '#64748b',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 5. STRATEGIC VENDORS (Procurement Rating list) */}
      <div className="luxury-glass-card" style={{ padding: '24px', marginTop: '28px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 850,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            <UserCheck size={20} color="#10b981" /> Strategic Vendors
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>
            Strategic suppliers with highest PO volume and reliability
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topVendors.map((vendor, index) => (
            <div
              key={vendor.id}
              style={{
                padding: '16px 0',
                borderBottom: index === topVendors.length - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                {/* Avatar initial circle with glowing gradients */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${
                      vendor.id === 'VND-001'
                        ? '#6366f1, #4f46e5'
                        : vendor.id === 'VND-002'
                          ? '#10b981, #059669'
                          : vendor.id === 'VND-003'
                            ? '#a855f7, #7c3aed'
                            : vendor.id === 'VND-004'
                              ? '#f59e0b, #d97706'
                              : '#64748b, #475569'
                    })`,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 850,
                    fontSize: '0.94rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  {vendor.name.charAt(0)}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={vendor.name}
                  >
                    {vendor.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#64748b',
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {vendor.category} •{' '}
                    <strong style={{ color: '#475569', fontWeight: 650 }}>{vendor.pos} POs</strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                <div style={{ fontWeight: 850, color: '#0F172A', fontSize: '0.92rem' }}>
                  ₹{vendor.spend.toLocaleString()}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.74rem',
                    fontWeight: 750,
                    color: vendor.ratingColor,
                  }}
                >
                  <Star size={11} fill={vendor.ratingColor} stroke="none" />
                  <span>{vendor.rating}% Rel.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
