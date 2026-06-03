import { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Layers,
  ShoppingBag,
  ShoppingCart,
  Settings,
  Award,
  FileText,
  Inbox,
  Search,
} from 'lucide-react';
import { businessApi } from '../../../core/api/business';

// Subcomponents imports
import { DashboardHeader } from '../components/DashboardHeader';
import { StatsGrid } from '../components/StatsGrid';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { SalesOrderTable } from '../components/SalesOrderTable';
import { TopSellingItems } from '../components/TopSellingItems';
import { ActivityPanel } from '../components/ActivityPanel';
import { MetricsModal } from '../components/MetricsModal';

// Style imports
import '../styles/dashboard.css';
import '../styles/metrics.css';
import '../styles/chart.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

const ICON_MAP = {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  Layers,
  Award,
  FileText,
};

const DEFAULT_ALL_METRICS = [
  {
    id: 'total_value',
    label: 'Total Asset Value',
    value: '₹333,400',
    change: '+14.2%',
    isPositive: true,
    icon: DollarSign,
    color: '#6366f1',
    shadow: 'rgba(99, 102, 241, 0.18)',
    sparkline: 'M 5 35 Q 30 10 60 25 T 110 8 T 155 20 T 195 5',
    delay: '0s',
  },
  {
    id: 'active_items',
    label: 'Active Items',
    value: '2,350',
    change: '+8.4%',
    isPositive: true,
    icon: Package,
    color: '#10b981',
    shadow: 'rgba(16, 185, 129, 0.18)',
    sparkline: 'M 5 25 Q 30 30 60 12 T 110 20 T 155 8 T 195 10',
    delay: '0.08s',
  },
  {
    id: 'sales_volume',
    label: 'Sales Revenue',
    value: '₹68,500',
    change: '+18.4%',
    isPositive: true,
    icon: ShoppingBag,
    color: '#a855f7',
    shadow: 'rgba(168, 85, 247, 0.18)',
    sparkline: 'M 5 30 Q 30 12 60 18 T 110 28 T 155 8 T 195 5',
    delay: '0.16s',
  },
  {
    id: 'low_stock',
    label: 'Critical Low Stock',
    value: '7 Items',
    change: '-23.1%',
    isPositive: true,
    icon: AlertTriangle,
    color: '#f59e0b',
    shadow: 'rgba(245, 158, 11, 0.18)',
    sparkline: 'M 5 10 Q 30 18 60 22 T 110 12 T 155 28 T 195 32',
    delay: '0.24s',
  },
  {
    id: 'todays_sales',
    label: "Today's Sales",
    value: '₹12,450',
    change: '+9.2%',
    isPositive: true,
    icon: TrendingUp,
    color: '#059669',
    shadow: 'rgba(5, 150, 105, 0.18)',
    sparkline: 'M 5 15 Q 35 8 65 30 T 115 15 T 160 5 T 195 18',
    delay: '0.32s',
  },
  {
    id: 'po_pending',
    label: 'Purchase Orders Pending',
    value: '18 Orders',
    change: '+4.1%',
    isPositive: false,
    icon: ShoppingCart,
    color: '#d97706',
    shadow: 'rgba(217, 119, 6, 0.18)',
    sparkline: 'M 5 25 Q 30 15 60 30 T 110 10 T 155 20 T 195 8',
    delay: '0.4s',
  },
  {
    id: 'stock_by_warehouse',
    label: 'Stock Value by Warehouse',
    value: '₹185,200',
    change: '+11.5%',
    isPositive: true,
    icon: Layers,
    color: '#6366f1',
    shadow: 'rgba(99, 102, 241, 0.18)',
    sparkline: 'M 5 35 Q 30 20 60 10 T 110 32 T 155 12 T 195 15',
    delay: '0.48s',
  },
  {
    id: 'out_of_stock',
    label: 'Out of Stock Items',
    value: '3 Items',
    change: '-40.0%',
    isPositive: true,
    icon: AlertTriangle,
    color: '#ef4444',
    shadow: 'rgba(239, 68, 68, 0.18)',
    sparkline: 'M 5 5 Q 30 22 60 15 T 110 35 T 155 10 T 195 28',
    delay: '0.56s',
  },
  {
    id: 'top_selling',
    label: 'Top Selling Products',
    value: 'Paracetamol',
    change: 'Fast Moving',
    isPositive: true,
    icon: Award,
    color: '#8b5cf6',
    shadow: 'rgba(139, 92, 246, 0.18)',
    sparkline: 'M 5 35 Q 30 25 60 5 T 110 20 T 155 30 T 195 8',
    delay: '0.64s',
  },
  {
    id: 'recent_txs',
    label: 'Recent Transactions',
    value: '42 Today',
    change: '+15.2%',
    isPositive: true,
    icon: FileText,
    color: '#10b981',
    shadow: 'rgba(16, 185, 129, 0.18)',
    sparkline: 'M 5 18 Q 30 30 60 10 T 110 25 T 155 8 T 195 12',
    delay: '0.72s',
  },
];

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: '0.85rem',
  fontWeight: 650,
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // --- Interactive State Filters ---
  const [capsuleTab, setCapsuleTab] = useState<'pending' | 'activities'>('pending');
  const [activeOrderTab, setActiveOrderTab] = useState<
    'All' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
  >('All');
  const [topSellingSort, setTopSellingSort] = useState<'sold' | 'revenue'>('sold');
  const [receiveSearch, setReceiveSearch] = useState('');

  // --- Interactive Graph States & Mock Datasets ---
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders'>('revenue');
  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const chartData7d = [
    { date: '11 May', value: 48200, orders: 120, growth: 12, revenuePerOrder: '₹401' },
    { date: '12 May', value: 62400, orders: 180, growth: 14, revenuePerOrder: '₹346' },
    { date: '13 May', value: 41200, orders: 145, growth: -5, revenuePerOrder: '₹284' },
    { date: '14 May', value: 73800, orders: 220, growth: 18, revenuePerOrder: '₹335' },
    { date: '15 May', value: 89500, orders: 310, growth: 21, revenuePerOrder: '₹288' },
    { date: '16 May', value: 54000, orders: 190, growth: 8, revenuePerOrder: '₹284' },
    { date: '17 May', value: 68500, orders: 250, growth: 15, revenuePerOrder: '₹274' },
  ];

  const chartData30d = [
    { date: '01 - 07 May', value: 245000, orders: 740, growth: 11, revenuePerOrder: '₹331' },
    { date: '08 - 14 May', value: 289000, orders: 890, growth: 15, revenuePerOrder: '₹324' },
    { date: '15 - 21 May', value: 312000, orders: 940, growth: 8, revenuePerOrder: '₹331' },
    { date: '22 - 28 May', value: 333400, orders: 1020, growth: 14, revenuePerOrder: '₹326' },
  ];

  const chartData = chartRange === '7d' ? chartData7d : chartData30d;
  const maxVal = Math.max(
    ...chartData.map((d) => (activeMetric === 'revenue' ? d.value : d.orders))
  );

  // SVG size parameters
  const svgWidth = 680;
  const svgHeight = 200;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  // Generate spline coordinates mathematically
  const points = chartData.map((d, i) => {
    const x =
      paddingLeft +
      i * ((svgWidth - paddingLeft - paddingRight) / (chartData.length - 1));
    const val = activeMetric === 'revenue' ? d.value : d.orders;
    // Scale y to leave 10% safety margin at the top
    const y =
      svgHeight -
      paddingBottom -
      (val / (maxVal * 1.1)) * (svgHeight - paddingTop - paddingBottom);
    return { x, y };
  });

  let splinePath = '';
  if (points.length > 0) {
    splinePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 3;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (2 * (curr.x - prev.x)) / 3;
      const cpY2 = curr.y;
      splinePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
  }

  const fillPath =
    points.length > 0
      ? `${splinePath} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`
      : '';

  useEffect(() => {
    const loadCtx = async () => {
      try {
        const data = await businessApi.getBusinessProfile();
        setBusiness(data);
      } catch {
        // Safe fallback
      }
    };
    loadCtx();
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  // --- Mock Data: Top Selling Items ---
  const topSellingItems = [
    {
      id: 'SKU-8921',
      name: 'Premium Wireless Headset V2',
      sold: 482,
      revenue: 43380,
      stock: 24,
      margin: 42,
      image: '🎧',
      category: 'Electronics',
    },
    {
      id: 'SKU-3104',
      name: 'Ergonomic Mechanical Keyboard',
      sold: 395,
      revenue: 35550,
      stock: 58,
      margin: 38,
      image: '⌨️',
      category: 'Accessories',
    },
    {
      id: 'SKU-5401',
      name: 'UltraSharp 27" 4K Monitor',
      sold: 218,
      revenue: 87200,
      stock: 15,
      margin: 48,
      image: '🖥️',
      category: 'Display',
    },
    {
      id: 'SKU-2093',
      name: 'USB-C Docking Station Multiport',
      sold: 184,
      revenue: 14720,
      stock: 120,
      margin: 35,
      image: '🔌',
      category: 'Connectivity',
    },
    {
      id: 'SKU-7742',
      name: 'Smart Fitness Tracker Pro',
      sold: 156,
      revenue: 12480,
      stock: 89,
      margin: 30,
      image: '⌚',
      category: 'Wearables',
    },
  ];

  // --- Mock Data: Top Stocked Items ---
  const topStockedItems = [
    {
      id: 'SKU-1024',
      name: 'Enterprise SSD 2TB NVMe',
      quantity: 620,
      valuation: 124000,
      warehouse: 'Alpha Depot',
      status: 'Healthy',
      color: '#10b981',
    },
    {
      id: 'SKU-2294',
      name: 'High-Density RAM 32GB DDR5',
      quantity: 512,
      valuation: 76800,
      warehouse: 'Retail Hub West',
      status: 'Healthy',
      color: '#10b981',
    },
    {
      id: 'SKU-4952',
      name: 'Smart Charging Dock 6-Port',
      quantity: 450,
      valuation: 18000,
      warehouse: 'Zone Storage C',
      status: 'High Stock',
      color: '#3b82f6',
    },
    {
      id: 'SKU-8831',
      name: 'Active Noise Cancelling Buds',
      quantity: 380,
      valuation: 38000,
      warehouse: 'Alpha Depot',
      status: 'Healthy',
      color: '#10b981',
    },
    {
      id: 'SKU-3320',
      name: 'Premium Leather Laptop Sleeve',
      quantity: 320,
      valuation: 16000,
      warehouse: 'Cold Storage Room 4',
      status: 'Overstock',
      color: '#f59e0b',
    },
  ];

  // --- Mock Data: Sales Order Summary ---
  const salesOrders = [
    {
      id: 'ORD-9821',
      customer: 'Global Technologies Inc.',
      date: '2026-05-17',
      amount: 14250,
      status: 'Delivered',
      itemsCount: 12,
    },
    {
      id: 'ORD-9822',
      customer: 'Nexus Solutions Corp.',
      date: '2026-05-16',
      amount: 8900,
      status: 'Shipped',
      itemsCount: 7,
    },
    {
      id: 'ORD-9823',
      customer: 'Horizon Ventures',
      date: '2026-05-16',
      amount: 24500,
      status: 'Pending',
      itemsCount: 18,
    },
    {
      id: 'ORD-9824',
      customer: 'Vortex Media Ltd',
      date: '2026-05-15',
      amount: 3200,
      status: 'Delivered',
      itemsCount: 3,
    },
    {
      id: 'ORD-9825',
      customer: 'Alpha Corp Ltd',
      date: '2026-05-15',
      amount: 1200,
      status: 'Cancelled',
      itemsCount: 1,
    },
  ] as const;

  // --- Mock Data: Top Vendors ---
  const topVendors = [
    {
      id: 'VND-001',
      name: 'Apex Tech Wholesale',
      category: 'Microchips & Storage',
      pos: 42,
      spend: 284500,
      rating: 98,
      status: 'Strategic',
      ratingColor: '#10b981',
    },
    {
      id: 'VND-002',
      name: 'LogiLink Logistics',
      category: 'Cables & Networking',
      pos: 35,
      spend: 142000,
      rating: 94,
      status: 'Preferred',
      ratingColor: '#10b981',
    },
    {
      id: 'VND-003',
      name: 'Sovereign Designs LLC',
      category: 'Furniture & Ergonomics',
      pos: 18,
      spend: 95400,
      rating: 89,
      status: 'Verified',
      ratingColor: '#3b82f6',
    },
    {
      id: 'VND-004',
      name: 'LithiumPower Ind.',
      category: 'Batteries & Chargers',
      pos: 22,
      spend: 81200,
      rating: 91,
      status: 'Preferred',
      ratingColor: '#10b981',
    },
    {
      id: 'VND-005',
      name: 'Elegance Pack Co.',
      category: 'Packaging Materials',
      pos: 12,
      spend: 24500,
      rating: 85,
      status: 'Active',
      ratingColor: '#6366f1',
    },
  ];

  // --- Mock Data: Receive History (GRN) ---
  const receiveHistory = [
    {
      id: 'GRN-301',
      date: '2026-05-17 10:15 AM',
      vendor: 'Apex Tech Wholesale',
      product: 'Enterprise SSD 2TB NVMe',
      quantity: 150,
      batch: 'B-SSD992',
      condition: 'Optimal',
      status: 'Inspected',
    },
    {
      id: 'GRN-302',
      date: '2026-05-16 02:40 PM',
      vendor: 'LithiumPower Ind.',
      product: 'Smart Charging Dock 6-Port',
      quantity: 80,
      batch: 'B-LIP442',
      condition: 'Optimal',
      status: 'Inspected',
    },
    {
      id: 'GRN-303',
      date: '2026-05-16 11:10 AM',
      vendor: 'LogiLink Logistics',
      product: 'USB-C Docking Station Multiport',
      quantity: 200,
      batch: 'B-USB772',
      condition: 'Minor Damages (2 units)',
      status: 'Quarantined',
    },
    {
      id: 'GRN-304',
      date: '2026-05-15 04:30 PM',
      vendor: 'Sovereign Designs LLC',
      product: 'Ergonomic Mechanical Keyboard',
      quantity: 50,
      batch: 'B-KEY512',
      condition: 'Optimal',
      status: 'Inspected',
    },
    {
      id: 'GRN-305',
      date: '2026-05-14 09:15 AM',
      vendor: 'Elegance Pack Co.',
      product: 'Premium Leather Laptop Sleeve',
      quantity: 300,
      batch: 'B-SLV104',
      condition: 'Optimal',
      status: 'Inspected',
    },
    {
      id: 'GRN-306',
      date: '2026-05-13 01:20 PM',
      vendor: 'Apex Tech Wholesale',
      product: 'Smart Fitness Tracker Pro',
      quantity: 120,
      batch: 'B-FIT112',
      condition: 'Optimal',
      status: 'Inspected',
    },
  ];

  // --- Mock Data: Dynamic Activity Logs ---
  const dynamicActivities = [
    {
      id: 'ACT-001',
      type: 'sale',
      message: 'Order #ORD-9823 placed by Horizon Ventures',
      time: '10 mins ago',
      amount: '₹24,500',
    },
    {
      id: 'ACT-002',
      type: 'grn',
      message: 'SSD Shipment received from Apex Tech Wholesale',
      time: '1 hour ago',
      amount: '150 units',
    },
    {
      id: 'ACT-003',
      type: 'payment',
      message: 'Supplier payment recorded to LithiumPower Ind.',
      time: '3 hours ago',
      amount: '₹12,400',
    },
    {
      id: 'ACT-004',
      type: 'stock',
      message: 'Low Stock Alert triggered for Smart Fitness Tracker Pro',
      time: '5 hours ago',
      amount: '89 in stock',
    },
    {
      id: 'ACT-005',
      type: 'transfer',
      message: 'Stock transfer initiated from Alpha Depot to Retail Hub',
      time: '1 day ago',
      amount: '45 items',
    },
  ];

  // List of all metrics (initialized with standard preset + supports custom added ones)
  const [allMetrics, setAllMetrics] = useState(DEFAULT_ALL_METRICS);

  // IDs of active metrics currently showing in the stats-grid
  const [activeMetricIds, setActiveMetricIds] = useState<string[]>([
    'total_value',
    'active_items',
    'sales_volume',
    'low_stock',
  ]);

  // Modal display togglers
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);

  // Form state for creating a new custom card
  const [customMetricLabel, setCustomMetricLabel] = useState('');
  const [customMetricValue, setCustomMetricValue] = useState('');
  const [customMetricChange, setCustomMetricChange] = useState('');
  const [customMetricIsPositive, setCustomMetricIsPositive] = useState(true);
  const [customMetricIcon, setCustomMetricIcon] = useState<keyof typeof ICON_MAP>('DollarSign');
  const [customMetricColor, setCustomMetricColor] = useState('#6366f1');

  // Filtered lists
  const filteredOrders =
    activeOrderTab === 'All'
      ? salesOrders
      : salesOrders.filter((o) => o.status === activeOrderTab);

  const sortedSellingItems = [...topSellingItems].sort((a, b) => {
    return topSellingSort === 'sold' ? b.sold - a.sold : b.revenue - a.revenue;
  });

  const filteredGRN = receiveHistory.filter(
    (item) =>
      item.product.toLowerCase().includes(receiveSearch.toLowerCase()) ||
      item.vendor.toLowerCase().includes(receiveSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(receiveSearch.toLowerCase()) ||
      item.batch.toLowerCase().includes(receiveSearch.toLowerCase())
  );

  const stats = allMetrics.filter((m) => activeMetricIds.includes(m.id));

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        padding: '24px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="dashboard-container">
        {/* PREMIUM USER WELCOME HEADER */}
        <DashboardHeader
          business={business}
          loading={loading}
          refreshData={refreshData}
        />

        {/* METRICS HIGHLIGHT SECTION CONTROL BAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            marginTop: '8px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
            }}
          >
            Operational Highlights
          </h3>
          <button
            onClick={() => setShowMetricsConfig(true)}
            style={{
              background: 'rgba(99, 102, 241, 0.06)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              color: '#4f46e5',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.05)',
              transition: 'all 0.2s ease',
            }}
            className="action-tab-pill"
          >
            <Settings size={14} /> Configure Cards
          </button>
        </div>

        {/* STATS GRID COMPONENT */}
        <StatsGrid
          stats={stats}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          setActiveMetricIds={setActiveMetricIds}
          setShowMetricsConfig={setShowMetricsConfig}
        />

        {/* 12-COLUMN CORE WORKSPACE GRID */}
        <div className="dashboard-layout-grid">
          {/* MAIN ZONE: LEFT COLUMN (8 Columns) */}
          <div className="col-main">
            {/* NEW GRAPH: OPERATIONAL ANALYTICS CARD */}
            <AnalyticsChart
              activeMetric={activeMetric}
              setActiveMetric={setActiveMetric}
              chartRange={chartRange}
              setChartRange={setChartRange}
              chartData={chartData}
              points={points}
              fillPath={fillPath}
              splinePath={splinePath}
              maxVal={maxVal}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              paddingLeft={paddingLeft}
              paddingRight={paddingRight}
              paddingTop={paddingTop}
              paddingBottom={paddingBottom}
            />

            {/* A. SALES ORDER SUMMARY (Premium SaaS BACKLOG View) */}
            <SalesOrderTable
              salesOrders={salesOrders as any}
              filteredOrders={filteredOrders as any}
              activeOrderTab={activeOrderTab}
              setActiveOrderTab={setActiveOrderTab}
            />

            {/* B. TOP SELLING ITEMS */}
            <TopSellingItems
              topSellingItems={topSellingItems}
              sortedSellingItems={sortedSellingItems}
              topSellingSort={topSellingSort}
              setTopSellingSort={setTopSellingSort}
            />

            {/* C. RECEIVE HISTORY (GRN ledger timelines) */}
            <div className="luxury-glass-card" style={{ padding: '28px' }}>
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
                    <Inbox size={22} color="#6366f1" /> Receive History (GRN Records)
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
                    Chronological ledger of newly incoming logistics & stock arrivals
                  </p>
                </div>

                {/* Quick Search */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    border: '1px solid rgba(0,0,0,0.03)',
                    width: '100%',
                    maxWidth: '240px',
                  }}
                >
                  <Search size={16} color="#64748B" style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Search GRN, Product, Batch..."
                    value={receiveSearch}
                    onChange={(e) => setReceiveSearch(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.8rem',
                      width: '100%',
                      color: '#0F172A',
                      fontWeight: 500,
                    }}
                  />
                </div>
              </div>

              {/* Timeline layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredGRN.length > 0 ? (
                  filteredGRN.map((grn) => (
                    <div
                      key={grn.id}
                      style={{
                        position: 'relative',
                        paddingLeft: '24px',
                        borderLeft: '2.5px solid rgba(99, 102, 241, 0.15)',
                        paddingBottom: '8px',
                      }}
                    >
                      {/* Timeline Glowing indicator node */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-7px',
                          top: '4px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: grn.condition === 'Optimal' ? '#10b981' : '#f59e0b',
                          boxShadow:
                            grn.condition === 'Optimal' ? '0 0 10px #10b981' : '0 0 10px #f59e0b',
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          gap: '14px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.96rem' }}>
                            {grn.product}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                            Quantity received:{' '}
                            <strong style={{ color: '#1e293b' }}>{grn.quantity} units</strong> •
                            Batch:{' '}
                            <span style={{ fontFamily: 'monospace', fontWeight: 650, color: '#6366f1' }}>
                              {grn.batch}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px' }}>
                            Supplier: <span style={{ fontWeight: 700 }}>{grn.vendor}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span
                            className={`badge-capsule ${
                              grn.condition === 'Optimal'
                                ? 'badge-capsule-success'
                                : 'badge-capsule-warning'
                            }`}
                          >
                            {grn.status}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '8px' }}>
                            {grn.date}
                          </div>
                        </div>
                      </div>

                      {/* Package Condition Banner */}
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          backgroundColor:
                            grn.condition === 'Optimal'
                              ? 'rgba(16,185,129,0.04)'
                              : 'rgba(239,68,68,0.04)',
                          border:
                            grn.condition === 'Optimal'
                              ? '1px dashed rgba(16,185,129,0.15)'
                              : '1px dashed rgba(239,68,68,0.15)',
                          fontSize: '0.76rem',
                          color: grn.condition === 'Optimal' ? '#059669' : '#dc2626',
                          fontWeight: 700,
                          display: 'inline-block',
                        }}
                      >
                        Package Condition: {grn.condition}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.92rem' }}
                  >
                    No GRN logistics arrival records match search.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDE ZONE: RIGHT COLUMN (4 Columns) */}
          <div className="col-side">
            <ActivityPanel
              capsuleTab={capsuleTab}
              setCapsuleTab={setCapsuleTab}
              salesOrders={salesOrders as any}
              receiveHistory={receiveHistory}
              topSellingItems={topSellingItems}
              dynamicActivities={dynamicActivities}
              hoveredSlice={hoveredSlice}
              setHoveredSlice={setHoveredSlice}
              hoveredBar={hoveredBar}
              setHoveredBar={setHoveredBar}
              topStockedItems={topStockedItems}
              topVendors={topVendors}
            />
          </div>
        </div>
      </div>

      {/* METRICS CONFIGURATION MODAL */}
      <MetricsModal
        showMetricsConfig={showMetricsConfig}
        setShowMetricsConfig={setShowMetricsConfig}
        activeMetricIds={activeMetricIds}
        setActiveMetricIds={setActiveMetricIds}
        allMetrics={allMetrics}
        setAllMetrics={setAllMetrics}
        iconMap={ICON_MAP}
        customMetricLabel={customMetricLabel}
        setCustomMetricLabel={setCustomMetricLabel}
        customMetricValue={customMetricValue}
        setCustomMetricValue={setCustomMetricValue}
        customMetricChange={customMetricChange}
        setCustomMetricChange={setCustomMetricChange}
        customMetricIsPositive={customMetricIsPositive}
        setCustomMetricIsPositive={setCustomMetricIsPositive}
        customMetricIcon={customMetricIcon}
        setCustomMetricIcon={setCustomMetricIcon}
        customMetricColor={customMetricColor}
        setCustomMetricColor={setCustomMetricColor}
        modalInputStyle={modalInputStyle}
      />
    </div>
  );
};
