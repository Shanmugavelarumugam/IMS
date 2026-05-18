import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Layers, 
  Calendar,
  ShoppingBag,
  UserCheck,
  Inbox,
  Star,
  CheckCircle,
  Clock,
  Search,
  ShoppingCart,
  ChevronRight,
  TrendingDown,
  PieChart,
  BarChart,
  Settings,
  Plus,
  Trash2,
  X,
  Award,
  FileText
} from 'lucide-react';
import { businessApi } from '../../../core/api/business';

const ICON_MAP = {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  Layers,
  Award,
  FileText
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
    delay: '0s' 
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
    delay: '0.08s' 
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
    delay: '0.16s' 
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
    delay: '0.24s' 
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
    delay: '0.32s'
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
    delay: '0.4s'
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
    delay: '0.48s'
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
    delay: '0.56s'
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
    delay: '0.64s'
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
    delay: '0.72s'
  }
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
  transition: 'border-color 0.2s'
};

export const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // --- Interactive State Filters ---
  const [capsuleTab, setCapsuleTab] = useState<'pending' | 'activities'>('pending');
  const [activeOrderTab, setActiveOrderTab] = useState<'All' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
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
    { date: '17 May', value: 68500, orders: 250, growth: 15, revenuePerOrder: '₹274' }
  ];

  const chartData30d = [
    { date: '01 - 07 May', value: 245000, orders: 740, growth: 11, revenuePerOrder: '₹331' },
    { date: '08 - 14 May', value: 289000, orders: 890, growth: 15, revenuePerOrder: '₹324' },
    { date: '15 - 21 May', value: 312000, orders: 940, growth: 8, revenuePerOrder: '₹331' },
    { date: '22 - 28 May', value: 333400, orders: 1020, growth: 14, revenuePerOrder: '₹326' }
  ];

  const chartData = chartRange === '7d' ? chartData7d : chartData30d;
  const maxVal = Math.max(...chartData.map(d => activeMetric === 'revenue' ? d.value : d.orders));
  
  // SVG size parameters
  const svgWidth = 680;
  const svgHeight = 200;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  // Generate spline coordinates mathematically
  const points = chartData.map((d, i) => {
    const x = paddingLeft + i * ((svgWidth - paddingLeft - paddingRight) / (chartData.length - 1));
    const val = activeMetric === 'revenue' ? d.value : d.orders;
    // Scale y to leave 10% safety margin at the top
    const y = svgHeight - paddingBottom - (val / (maxVal * 1.1)) * (svgHeight - paddingTop - paddingBottom);
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
      const cpX2 = prev.x + 2 * (curr.x - prev.x) / 3;
      const cpY2 = curr.y;
      splinePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
  }

  const fillPath = points.length > 0 
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
    { id: 'SKU-8921', name: 'Premium Wireless Headset V2', sold: 482, revenue: 43380, stock: 24, margin: 42, image: '🎧', category: 'Electronics' },
    { id: 'SKU-3104', name: 'Ergonomic Mechanical Keyboard', sold: 395, revenue: 35550, stock: 58, margin: 38, image: '⌨️', category: 'Accessories' },
    { id: 'SKU-5401', name: 'UltraSharp 27" 4K Monitor', sold: 218, revenue: 87200, stock: 15, margin: 48, image: '🖥️', category: 'Display' },
    { id: 'SKU-2093', name: 'USB-C Docking Station Multiport', sold: 184, revenue: 14720, stock: 120, margin: 35, image: '🔌', category: 'Connectivity' },
    { id: 'SKU-7742', name: 'Smart Fitness Tracker Pro', sold: 156, revenue: 12480, stock: 89, margin: 30, image: '⌚', category: 'Wearables' }
  ];

  // --- Mock Data: Top Stocked Items ---
  const topStockedItems = [
    { id: 'SKU-1024', name: 'Enterprise SSD 2TB NVMe', quantity: 620, valuation: 124000, warehouse: 'Alpha Depot', status: 'Healthy', color: '#10b981' },
    { id: 'SKU-2294', name: 'High-Density RAM 32GB DDR5', quantity: 512, valuation: 76800, warehouse: 'Retail Hub West', status: 'Healthy', color: '#10b981' },
    { id: 'SKU-4952', name: 'Smart Charging Dock 6-Port', quantity: 450, valuation: 18000, warehouse: 'Zone Storage C', status: 'High Stock', color: '#3b82f6' },
    { id: 'SKU-8831', name: 'Active Noise Cancelling Buds', quantity: 380, valuation: 38000, warehouse: 'Alpha Depot', status: 'Healthy', color: '#10b981' },
    { id: 'SKU-3320', name: 'Premium Leather Laptop Sleeve', quantity: 320, valuation: 16000, warehouse: 'Cold Storage Room 4', status: 'Overstock', color: '#f59e0b' }
  ];

  // --- Mock Data: Sales Order Summary ---
  const salesOrders = [
    { id: 'ORD-9821', customer: 'Global Technologies Inc.', date: '2026-05-17', amount: 14250, status: 'Delivered', itemsCount: 12 },
    { id: 'ORD-9822', customer: 'Nexus Solutions Corp.', date: '2026-05-16', amount: 8900, status: 'Shipped', itemsCount: 7 },
    { id: 'ORD-9823', customer: 'Horizon Ventures', date: '2026-05-16', amount: 24500, status: 'Pending', itemsCount: 18 },
    { id: 'ORD-9824', customer: 'Vortex Media Ltd', date: '2026-05-15', amount: 3200, status: 'Delivered', itemsCount: 3 },
    { id: 'ORD-9825', customer: 'Alpha Corp Ltd', date: '2026-05-15', amount: 1200, status: 'Cancelled', itemsCount: 1 }
  ];

  // --- Mock Data: Top Vendors ---
  const topVendors = [
    { id: 'VND-001', name: 'Apex Tech Wholesale', category: 'Microchips & Storage', pos: 42, spend: 284500, rating: 98, status: 'Strategic', ratingColor: '#10b981' },
    { id: 'VND-002', name: 'LogiLink Logistics', category: 'Cables & Networking', pos: 35, spend: 142000, rating: 94, status: 'Preferred', ratingColor: '#10b981' },
    { id: 'VND-003', name: 'Sovereign Designs LLC', category: 'Furniture & Ergonomics', pos: 18, spend: 95400, rating: 89, status: 'Verified', ratingColor: '#3b82f6' },
    { id: 'VND-004', name: 'LithiumPower Ind.', category: 'Batteries & Chargers', pos: 22, spend: 81200, rating: 91, status: 'Preferred', ratingColor: '#10b981' },
    { id: 'VND-005', name: 'Elegance Pack Co.', category: 'Packaging Materials', pos: 12, spend: 24500, rating: 85, status: 'Active', ratingColor: '#6366f1' }
  ];

  // --- Mock Data: Receive History (GRN) ---
  const receiveHistory = [
    { id: 'GRN-301', date: '2026-05-17 10:15 AM', vendor: 'Apex Tech Wholesale', product: 'Enterprise SSD 2TB NVMe', quantity: 150, batch: 'B-SSD992', condition: 'Optimal', status: 'Inspected' },
    { id: 'GRN-302', date: '2026-05-16 02:40 PM', vendor: 'LithiumPower Ind.', product: 'Smart Charging Dock 6-Port', quantity: 80, batch: 'B-LIP442', condition: 'Optimal', status: 'Inspected' },
    { id: 'GRN-303', date: '2026-05-16 11:10 AM', vendor: 'LogiLink Logistics', product: 'USB-C Docking Station Multiport', quantity: 200, batch: 'B-USB772', condition: 'Minor Damages (2 units)', status: 'Quarantined' },
    { id: 'GRN-304', date: '2026-05-15 04:30 PM', vendor: 'Sovereign Designs LLC', product: 'Ergonomic Mechanical Keyboard', quantity: 50, batch: 'B-KEY512', condition: 'Optimal', status: 'Inspected' },
    { id: 'GRN-305', date: '2026-05-14 09:15 AM', vendor: 'Elegance Pack Co.', product: 'Premium Leather Laptop Sleeve', quantity: 300, batch: 'B-SLV104', condition: 'Optimal', status: 'Inspected' },
    { id: 'GRN-306', date: '2026-05-13 01:20 PM', vendor: 'Apex Tech Wholesale', product: 'Smart Fitness Tracker Pro', quantity: 120, batch: 'B-FIT112', condition: 'Optimal', status: 'Inspected' }
  ];

  // --- Mock Data: Dynamic Activity Logs ---
  const dynamicActivities = [
    { id: 'ACT-001', type: 'sale', message: 'Order #ORD-9823 placed by Horizon Ventures', time: '10 mins ago', amount: '₹24,500' },
    { id: 'ACT-002', type: 'grn', message: 'SSD Shipment received from Apex Tech Wholesale', time: '1 hour ago', amount: '150 units' },
    { id: 'ACT-003', type: 'payment', message: 'Supplier payment recorded to LithiumPower Ind.', time: '3 hours ago', amount: '₹12,400' },
    { id: 'ACT-004', type: 'stock', message: 'Low Stock Alert triggered for Smart Fitness Tracker Pro', time: '5 hours ago', amount: '89 in stock' },
    { id: 'ACT-005', type: 'transfer', message: 'Stock transfer initiated from Alpha Depot to Retail Hub', time: '1 day ago', amount: '45 items' }
  ];

  // List of all metrics (initialized with standard preset + supports custom added ones)
  const [allMetrics, setAllMetrics] = useState(DEFAULT_ALL_METRICS);
  
  // IDs of active metrics currently showing in the stats-grid
  const [activeMetricIds, setActiveMetricIds] = useState<string[]>([
    'total_value',
    'active_items',
    'sales_volume',
    'low_stock'
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
  const filteredOrders = activeOrderTab === 'All' 
    ? salesOrders 
    : salesOrders.filter(o => o.status === activeOrderTab);

  const sortedSellingItems = [...topSellingItems].sort((a, b) => {
    return topSellingSort === 'sold' ? b.sold - a.sold : b.revenue - a.revenue;
  });

  const filteredGRN = receiveHistory.filter(item => 
    item.product.toLowerCase().includes(receiveSearch.toLowerCase()) || 
    item.vendor.toLowerCase().includes(receiveSearch.toLowerCase()) ||
    item.id.toLowerCase().includes(receiveSearch.toLowerCase()) ||
    item.batch.toLowerCase().includes(receiveSearch.toLowerCase())
  );

  const stats = allMetrics.filter(m => activeMetricIds.includes(m.id));

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '100vh' }}>
      <style>{`
        /* Stunning Luxury Dashboard Theme */
        .dashboard-container {
          max-width: 1600px;
          margin: 0 auto;
        }
        
        /* Stats Grid override - exactly 4 columns in a row */
        .stats-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 24px !important;
          margin-bottom: 32px !important;
        }
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Summary subgrid override - 4 columns on desktop */
        .summary-subgrid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 16px !important;
        }
        @media (max-width: 768px) {
          .summary-subgrid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .summary-subgrid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* 12-Column Responsive Layout */
        .dashboard-layout-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
          margin-top: 24px;
        }
        
        .col-main {
          grid-column: span 8;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .col-side {
          grid-column: span 4;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        @media (max-width: 1200px) {
          .col-main {
            grid-column: span 12;
          }
          .col-side {
            grid-column: span 12;
          }
        }
        
        /* Premium Card styling */
        .luxury-glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(9, 14, 29, 0.02), 0 20px 40px rgba(9, 14, 29, 0.04);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          position: relative;
        }
        .luxury-glass-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 30px 60px rgba(99, 102, 241, 0.08), 0 1px 15px rgba(9, 14, 29, 0.02);
        }
        
        /* Glowing neon gradients for metrics */
        .metric-glowing-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
          border-radius: 22px;
          padding: 24px;
          border: 1.5px solid rgba(255, 255, 255, 0.8);
          transition: all 0.35s ease;
        }
        
        /* Sparkline Animation */
        .sparkline-path {
          stroke-dasharray: 250;
          stroke-dashoffset: 250;
          animation: drawSparkline 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawSparkline {
          to { stroke-dashoffset: 0; }
        }
        
        /* Premium Tab Buttons */
        .action-tab-pill {
          padding: 8px 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255, 255, 255, 0.6);
          color: #64748b;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 6px rgba(0,0,0,0.01);
        }
        .action-tab-pill.active {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
          border-color: #6366f1;
        }
        .action-tab-pill:hover:not(.active) {
          background: #ffffff;
          color: #0f172a;
          border-color: rgba(99, 102, 241, 0.2);
          transform: translateY(-1px);
        }
        
        /* Activity Signal dot */
        .live-beacon {
          position: relative;
          padding-left: 14px;
        }
        .live-beacon::after {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          background: #10b981;
          border-radius: 50%;
          top: 50%; transform: translateY(-50%);
          left: 0;
          box-shadow: 0 0 10px #10b981;
          animation: beacon-pulse 2s infinite;
        }
        @keyframes beacon-pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        /* Table enhancements */
        .premium-tr {
          transition: all 0.2s ease;
        }
        .premium-tr:hover {
          background: rgba(99, 102, 241, 0.03) !important;
        }
        
        /* Shimmer loading progress bar */
        .progress-shimmer {
          position: relative;
          overflow: hidden;
        }
        .progress-shimmer::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: bar-shimmer 2s infinite;
        }
        @keyframes bar-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Rotation for loading */
        .spin-loader {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Aligned badge pill */
        .badge-capsule {
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 0.74rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .badge-capsule-success {
          background-color: rgba(16, 185, 129, 0.08);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .badge-capsule-warning {
          background-color: rgba(245, 158, 11, 0.08);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.15);
        }
        .badge-capsule-danger {
          background-color: rgba(239, 68, 68, 0.08);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }
        .badge-capsule-info {
          background-color: rgba(59, 130, 246, 0.08);
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .vendor-initials {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }
        
        /* Scrollbar customizing */
        .custom-scroll-bar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scroll-bar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 4px;
        }
        .custom-scroll-bar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.15);
          border-radius: 4px;
        }
        .custom-scroll-bar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.3);
        }

        /* Uploaded screenshot custom capsule card styles */
        .screenshot-tabs-container {
          display: flex;
          background: rgba(100, 116, 139, 0.08);
          border-radius: 14px;
          padding: 5px;
          margin-bottom: 20px;
          border: 1px solid rgba(0,0,0,0.01);
        }
        .screenshot-tab-btn {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .screenshot-tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
        }
        
        .screenshot-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 10px;
          border-bottom: 1.5px solid rgba(226, 232, 240, 0.5);
          transition: all 0.2s ease;
        }
        .screenshot-list-item:hover {
          background: rgba(99, 102, 241, 0.03);
          transform: translateX(4px);
        }
        .screenshot-list-item:last-child {
          border-bottom: none;
        }
        .screenshot-sec-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 10px 8px 10px;
          font-size: 0.82rem;
          font-weight: 800;
          color: #475569;
          letter-spacing: 0.07em;
        }
      `}</style>

      <div className="dashboard-container">
        
        {/* PREMIUM USER WELCOME HEADER - SLEEK LIGHT-THEMED GLASS */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 250, 252, 0.8) 100%)',
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
          gap: '20px'
        }}>
          {/* Subtle lavender accent background glow */}
          <div style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 70%)',
            right: '-30px',
            top: '-30px',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.06)', 
                color: '#4f46e5', 
                padding: '4px 12px', 
                borderRadius: '99px', 
                fontSize: '0.74rem', 
                fontWeight: 700, 
                border: '1px solid rgba(99, 102, 241, 0.12)' 
              }}>
                ✨ Viyan Enterprise
              </span>
              <span className="live-beacon" style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>
                Real-Time Sync
              </span>
            </div>
            
            <h1 style={{ fontSize: '1.9rem', fontWeight: 850, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.2, margin: 0 }}>
              Business Overview
            </h1>
            <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '4px', maxWidth: '620px', lineHeight: 1.4 }}>
              Real-time business operations panel for <strong style={{ color: '#4f46e5' }}>{business?.name || 'BURJ'}</strong>. Track stock, purchases, logistics, and sales activities.
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
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }}
              title="Sync metrics backlog"
            >
              <RefreshCw size={16} className={loading ? 'spin-loader' : ''} />
            </button>
            
            <button className="action-tab-pill" style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', 
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px', 
              borderRadius: '12px', 
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)'
            }}>
              <Calendar size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* METRICS BACKLOG ROW - SLEEK, MINIMAL & PROFESSIONAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
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
              transition: 'all 0.2s ease'
            }}
            className="action-tab-pill"
          >
            <Settings size={14} /> Configure Cards
          </button>
        </div>

        <div className="stats-grid">
          {stats.map((item) => (
            <div 
              key={item.id} 
              className="luxury-glass-card" 
              style={{ 
                animationDelay: item.delay, 
                animation: 'slideUp 0.5s ease backwards',
                background: '#ffffff',
                padding: '24px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: hoveredCard === item.id ? '0 12px 30px rgba(0, 0, 0, 0.04)' : '0 4px 12px rgba(9, 14, 29, 0.01)',
                borderColor: hoveredCard === item.id ? 'rgba(99, 102, 241, 0.35)' : 'rgba(226, 232, 240, 0.8)',
                transform: hoveredCard === item.id ? 'translateY(-4px)' : 'none',
                borderRadius: '20px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Float hover delete button */}
              {hoveredCard === item.id && (
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setActiveMetricIds(prev => prev.filter(id => id !== item.id)); 
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
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                  }}
                  title="Remove card"
                >
                  <X size={12} />
                </button>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ 
                    color: '#64748b', 
                    fontSize: '0.74rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.06em' 
                  }}>
                    {item.label}
                  </span>
                  
                  <div style={{ 
                    fontSize: '1.85rem', 
                    fontWeight: 850, 
                    color: '#0F172A', 
                    marginTop: '8px', 
                    letterSpacing: '-0.03em' 
                  }}>
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
                    transform: hoveredCard === item.id ? 'scale(1.08) rotate(3deg)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <item.icon size={18} />
                </div>
              </div>
              
              {/* Soft divider line instead of squiggly lines */}
              <div style={{ 
                height: '1px', 
                background: 'rgba(226, 232, 240, 0.5)', 
                margin: '16px 0 12px 0' 
              }} />

              {/* Dynamic Trend Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge-capsule ${item.isPositive ? 'badge-capsule-success' : 'badge-capsule-warning'}`} style={{ scale: '0.9', transformOrigin: 'left' }}>
                  {item.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span>{item.change}</span>
                </span>
                
                <span style={{ 
                  color: '#94A3B8', 
                  fontWeight: 600, 
                  fontSize: '0.78rem' 
                }}>
                  vs last week
                </span>
              </div>
            </div>
          ))}

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
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.background = 'rgba(248, 250, 252, 0.7)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.background = 'rgba(248, 250, 252, 0.4)'; }}
            >
              <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                color: '#4f46e5',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={18} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Add Highlight
              </span>
            </button>
          ))}
        </div>

        {/* 12-COLUMN CORE WORKSPACE GRID */}
        <div className="dashboard-layout-grid">
          
          {/* MAIN ZONE: LEFT COLUMN (8 Columns) */}
          <div className="col-main">
            
            {/* NEW GRAPH: OPERATIONAL ANALYTICS CARD */}
            <div className="luxury-glass-card" style={{ padding: '28px', marginBottom: '28px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.02em' }}>
                    <TrendingUp size={22} color="#6366f1" /> Operational Analytics
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>Real-time transactional cash flows, order velocities, and shipment assets</p>
                </div>

                {/* Interactive Toggles */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Metric Switcher */}
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', border: '1px solid rgba(0,0,0,0.02)' }}>
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
                        boxShadow: activeMetric === 'revenue' ? '0 3px 8px rgba(99, 102, 241, 0.12)' : 'none',
                        transition: 'all 0.2s ease'
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
                        boxShadow: activeMetric === 'orders' ? '0 3px 8px rgba(99, 102, 241, 0.12)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Orders
                    </button>
                  </div>

                  {/* Range Switcher */}
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', border: '1px solid rgba(0,0,0,0.02)' }}>
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
                        transition: 'all 0.2s ease'
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
                        transition: 'all 0.2s ease'
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
                <svg viewBox="0 0 680 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
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
                          style={{ fontSize: '0.68rem', fontWeight: 650, fill: '#94a3b8', fontFamily: 'monospace' }}
                        >
                          {activeMetric === 'revenue' 
                            ? `₹${Math.round(labelVal / 1000)}k` 
                            : Math.round(labelVal)
                          }
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
                {hoveredIdx !== null && points[hoveredIdx] && (
                  <div style={{
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
                    transition: 'left 0.15s ease-out, top 0.15s ease-out'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {chartData[hoveredIdx].date}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 850 }}>
                      {activeMetric === 'revenue' 
                        ? `₹${chartData[hoveredIdx].value.toLocaleString()}` 
                        : `${chartData[hoveredIdx].orders} Orders`
                      }
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', marginTop: '2px' }}>
                      <span style={{ 
                        color: chartData[hoveredIdx].growth >= 0 ? '#10b981' : '#ef4444', 
                        fontWeight: 750 
                      }}>
                        {chartData[hoveredIdx].growth >= 0 ? '↑' : '↓'} {Math.abs(chartData[hoveredIdx].growth)}% growth
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
            
            {/* A. SALES ORDER SUMMARY (Premium SaaS BACKLOG View) */}
            <div className="luxury-glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.02em' }}>
                    <Layers size={22} color="#a855f7" /> Sales Order Summary
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>Comprehensive ledger of order dispatch pipeline & client invoices</p>
                </div>

                {/* Filter pill tabs */}
                <div className="custom-scroll-bar" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {(['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'] as const).map((tab) => {
                    const count = tab === 'All' ? salesOrders.length : salesOrders.filter(o => o.status === tab).length;
                    return (
                      <button 
                        key={tab} 
                        onClick={() => setActiveOrderTab(tab)}
                        className={`action-tab-pill ${activeOrderTab === tab ? 'active' : ''}`}
                        style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
                      >
                        <span>{tab}</span>
                        <span style={{ 
                          background: activeOrderTab === tab ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.06)', 
                          padding: '2px 6px', 
                          borderRadius: '5px',
                          fontSize: '0.7rem'
                        }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic summary subgrid */}
              <div className="summary-subgrid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                gap: '16px', 
                background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)', 
                padding: '20px', 
                borderRadius: '18px', 
                border: '1px solid rgba(226, 232, 240, 0.7)', 
                marginBottom: '24px' 
              }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em' }}>PENDING ORDER VALUE</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#0F172A', marginTop: '6px' }}>
                    ₹{salesOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#d97706', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em' }}>PENDING DISPATCH VALUE</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#d97706', marginTop: '6px' }}>
                    ₹{salesOrders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#059669', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em' }}>FULFILLMENT RATIO</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#059669', marginTop: '6px' }}>
                    {Math.round((salesOrders.filter(o => o.status === 'Delivered').length / salesOrders.length) * 100)}%
                  </div>
                </div>
                <div>
                  <span style={{ color: '#6366f1', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em' }}>AVERAGE ORDER VALUE</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#6366f1', marginTop: '6px' }}>
                    ₹{Math.round(salesOrders.reduce((sum, o) => sum + o.amount, 0) / salesOrders.length).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Backlog Table */}
              <div className="custom-scroll-bar" style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid rgba(226, 232, 240, 0.8)' }}>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Order ID</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Client Customer</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Fulfillment Date</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Quantity</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Net Value</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="premium-tr" style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.4)' }}>
                          <td style={{ padding: '16px', fontWeight: 850, color: '#6366f1', fontFamily: 'monospace', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{order.id}</td>
                          <td style={{ padding: '16px', fontWeight: 750, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }} title={order.customer}>{order.customer}</td>
                          <td style={{ padding: '16px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{order.date}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{order.itemsCount} items</td>
                          <td style={{ padding: '16px', fontWeight: 850, color: '#0f172a', whiteSpace: 'nowrap' }}>₹{order.amount.toLocaleString()}</td>
                          <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                            <span className={`badge-capsule ${
                              order.status === 'Delivered' ? 'badge-capsule-success' : 
                              order.status === 'Shipped' ? 'badge-capsule-info' : 
                              order.status === 'Pending' ? 'badge-capsule-warning' : 'badge-capsule-danger'
                            }`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                              {order.status === 'Delivered' && <CheckCircle size={13} />}
                              {order.status === 'Pending' && <Clock size={13} />}
                              <span>{order.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b', fontSize: '0.92rem' }}>
                          No orders matched selected filter pipeline.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. TOP SELLING ITEMS (Neon Gradient Progress Bars) */}
            <div className="luxury-glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.02em' }}>
                    <TrendingUp size={22} color="#6366f1" /> Top Selling Items
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>Highest turnover velocity inventory stock SKU records</p>
                </div>

                {/* Sort controls */}
                <div style={{ display: 'flex', background: 'rgba(100, 116, 139, 0.08)', borderRadius: '10px', padding: '4px' }}>
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
                      boxShadow: topSellingSort === 'sold' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s'
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
                      boxShadow: topSellingSort === 'revenue' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Turnover Value
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sortedSellingItems.map((item, index) => {
                  const maxUnits = Math.max(...topSellingItems.map(i => i.sold));
                  const maxRevenue = Math.max(...topSellingItems.map(i => i.revenue));
                  const percentage = topSellingSort === 'sold' 
                    ? (item.sold / maxUnits) * 100 
                    : (item.revenue / maxRevenue) * 100;
                    
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Premium Rank Indicator */}
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        background: index === 0 ? 'rgba(245, 158, 11, 0.08)' :
                                    index === 1 ? 'rgba(148, 163, 184, 0.08)' :
                                    index === 2 ? 'rgba(234, 88, 12, 0.08)' : 'transparent',
                        color: index === 0 ? '#d97706' :
                               index === 1 ? '#475569' :
                               index === 2 ? '#c2410c' : '#94a3b8',
                        fontSize: '0.88rem',
                        fontWeight: 850,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>

                      {/* Sleek Item Avatar */}
                      <div style={{ 
                        fontSize: '1.4rem', 
                        width: '44px',
                        height: '44px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)', 
                        border: '1.5px solid rgba(226, 232, 240, 0.6)',
                        borderRadius: '12px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.015)'
                      }}>
                        {item.image}
                      </div>

                      {/* Content block */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.94rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </span>
                          <span style={{ fontWeight: 850, color: '#4f46e5', fontSize: '0.94rem' }}>
                            {topSellingSort === 'sold' ? `${item.sold} units` : `₹${item.revenue.toLocaleString()}`}
                          </span>
                        </div>

                        {/* Ultra-sleek micro progress slider */}
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', margin: '6px 0' }}>
                          <div 
                            className="progress-shimmer"
                            style={{ 
                              height: '100%', 
                              width: `${percentage}%`, 
                              borderRadius: '10px',
                              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                          <span>Category: <strong style={{ color: '#334155', fontWeight: 650 }}>{item.category}</strong> • Profit Margin: <strong style={{ color: '#334155', fontWeight: 650 }}>{item.margin}%</strong></span>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '5px', 
                            color: item.stock < 30 ? '#ef4444' : '#10b981', 
                            fontWeight: 755,
                            fontSize: '0.76rem'
                          }}>
                            <span style={{ 
                              width: '6px', 
                              height: '6px', 
                              borderRadius: '50%', 
                              backgroundColor: item.stock < 30 ? '#ef4444' : '#10b981',
                              display: 'inline-block'
                            }} />
                            {item.stock} left
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C. RECEIVE HISTORY (GRN ledger timelines) */}
            <div className="luxury-glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.02em' }}>
                    <Inbox size={22} color="#6366f1" /> Receive History (GRN Records)
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>Chronological ledger of newly incoming logistics & stock arrivals</p>
                </div>

                {/* Quick Search */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '10px', padding: '8px 16px', border: '1px solid rgba(0,0,0,0.03)', width: '100%', maxWidth: '240px' }}>
                  <Search size={16} color="#64748B" style={{ marginRight: '8px' }} />
                  <input 
                    type="text" 
                    placeholder="Search GRN, Product, Batch..." 
                    value={receiveSearch}
                    onChange={(e) => setReceiveSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', width: '100%', color: '#0F172A', fontWeight: 500 }}
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
                        paddingBottom: '8px'
                      }}
                    >
                      {/* Timeline Glowing indicator node */}
                      <div style={{ 
                        position: 'absolute', 
                        left: '-7px', 
                        top: '4px', 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: grn.condition === 'Optimal' ? '#10b981' : '#f59e0b',
                        boxShadow: grn.condition === 'Optimal' ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
                      }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '14px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.96rem' }}>
                            {grn.product}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                            Quantity received: <strong style={{ color: '#1e293b' }}>{grn.quantity} units</strong> • Batch: <span style={{ fontFamily: 'monospace', fontWeight: 650, color: '#6366f1' }}>{grn.batch}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px' }}>
                            Supplier: <span style={{ fontWeight: 700 }}>{grn.vendor}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span className={`badge-capsule ${
                            grn.condition === 'Optimal' ? 'badge-capsule-success' : 'badge-capsule-warning'
                          }`}>
                            {grn.status}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '8px' }}>
                            {grn.date}
                          </div>
                        </div>
                      </div>

                      {/* Package Condition Banner */}
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '8px 14px', 
                        borderRadius: '10px', 
                        backgroundColor: grn.condition === 'Optimal' ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)', 
                        border: grn.condition === 'Optimal' ? '1px dashed rgba(16,185,129,0.15)' : '1px dashed rgba(239,68,68,0.15)', 
                        fontSize: '0.76rem', 
                        color: grn.condition === 'Optimal' ? '#059669' : '#dc2626',
                        fontWeight: 700,
                        display: 'inline-block'
                      }}>
                        Package Condition: {grn.condition}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.92rem' }}>
                    No GRN logistics arrival records match search.
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="col-side">
            
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
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{salesOrders.filter(o => o.status === 'Pending').length}</span>
                    </div>

                    <div className="screenshot-list-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ChevronRight size={15} color="#94a3b8" />
                        <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Shipped</span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{salesOrders.filter(o => o.status === 'Shipped').length}</span>
                    </div>

                    <div className="screenshot-list-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ChevronRight size={15} color="#94a3b8" />
                        <span style={{ color: '#334155', fontSize: '0.94rem', fontWeight: 500 }}>To Be Delivered</span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{salesOrders.filter(o => o.status === 'Pending' || o.status === 'Shipped').length}</span>
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
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{receiveHistory.filter(r => r.status === 'Quarantined').length}</span>
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

                    <div className="screenshot-list-item" style={{ background: 'rgba(99, 102, 241, 0.04)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ChevronRight size={15} color="#6366f1" />
                        <span style={{ color: '#6366f1', fontSize: '0.94rem', fontWeight: 750 }}>Below Reorder Level</span>
                      </div>
                      <span style={{ fontWeight: 850, color: '#6366f1', fontSize: '1.1rem' }}>{topSellingItems.filter(i => i.stock < 30).length}</span>
                    </div>
                  </div>
                ) : (
                  /* Activities list subview - Gorgeous Vertical Timeline Feed */
                  <div style={{ position: 'relative', paddingLeft: '8px', marginTop: '12px' }}>
                    {/* The continuous vertical line track */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      bottom: '12px', 
                      left: '15px', 
                      width: '2px', 
                      background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 0%, rgba(226, 232, 240, 0.2) 100%)' 
                    }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {dynamicActivities.map((act) => {
                        const IconComponent = 
                          act.type === 'sale' ? ShoppingCart :
                          act.type === 'grn' ? Package :
                          act.type === 'payment' ? DollarSign : AlertTriangle;

                        const themeColor = 
                          act.type === 'sale' ? '#a855f7' :
                          act.type === 'grn' ? '#3b82f6' :
                          act.type === 'payment' ? '#10b981' : '#f59e0b';
                        
                        return (
                          <div 
                            key={act.id} 
                            style={{ 
                              display: 'flex', 
                              gap: '16px', 
                              position: 'relative',
                              alignItems: 'flex-start'
                            }}
                          >
                            {/* Centered timeline node icon with soft hover glow */}
                            <div style={{
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
                              flexShrink: 0
                            }}>
                              <IconComponent size={14} strokeWidth={2.5} />
                            </div>

                            {/* Clean, detailed activity text layout */}
                            <div style={{ 
                              flex: 1, 
                              minWidth: 0, 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-start',
                              paddingTop: '3px'
                            }}>
                              <div style={{ minWidth: 0, paddingRight: '8px' }}>
                                <div style={{ 
                                  fontSize: '0.86rem', 
                                  fontWeight: 800, 
                                  color: '#0f172a',
                                  lineHeight: 1.3
                                }}>
                                  {act.type === 'sale' ? 'Order Placed' :
                                   act.type === 'grn' ? 'Shipment Received' :
                                   act.type === 'payment' ? 'Payment Recorded' :
                                   act.message.includes('Alert') ? 'Critical Warning' : 'Stock Transfer'}
                                </div>
                                <div style={{ 
                                  fontSize: '0.8rem', 
                                  color: '#475569', 
                                  marginTop: '4px',
                                  lineHeight: 1.4,
                                  fontWeight: 500
                                }}>
                                  {act.message}
                                </div>
                              </div>
                              
                              {/* Metadata and Price/Units Badge */}
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ 
                                  fontSize: '0.85rem', 
                                  fontWeight: 800, 
                                  color: act.type === 'sale' ? '#4f46e5' : act.type === 'payment' ? '#059669' : '#1e293b'
                                }}>
                                  {act.amount}
                                </div>
                                <span style={{ 
                                  fontSize: '0.72rem', 
                                  color: '#94a3b8',
                                  fontWeight: 600,
                                  display: 'block',
                                  marginTop: '2px'
                                }}>
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em' }}>
                  <PieChart size={20} color="#a855f7" /> Stock Allocation
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Real-time inventory distribution by catalog segments</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* SVG Doughnut */}
                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                  <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
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
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: '1.1' }}>
                      {hoveredSlice === 0 ? '45%' :
                       hoveredSlice === 1 ? '28%' :
                       hoveredSlice === 2 ? '17%' :
                       hoveredSlice === 3 ? '10%' : '82%'}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {hoveredSlice !== null ? 'Share' : 'Capacity'}
                    </div>
                  </div>
                </div>

                {/* Legend list details column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '120px' }}>
                  {[
                    { label: 'Storage & SSDs', percent: 45, color: '#6366f1', value: '6,410' },
                    { label: 'Cables & Docks', percent: 28, color: '#10b981', value: '3,990' },
                    { label: 'Ergonomic Desk', percent: 17, color: '#a855f7', value: '2,420' },
                    { label: 'Packaging sleeves', percent: 10, color: '#f59e0b', value: '1,430' }
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
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: item.color, 
                          display: 'inline-block',
                          flexShrink: 0
                        }} />
                        <span style={{ 
                          fontSize: '0.74rem', 
                          fontWeight: hoveredSlice === idx ? 800 : 650, 
                          color: hoveredSlice === idx ? '#0f172a' : '#64748b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.label}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        fontWeight: 800, 
                        color: hoveredSlice === idx ? item.color : '#334155',
                        marginLeft: '8px',
                        flexShrink: 0
                      }}>
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em' }}>
                  <Package size={20} color="#10b981" /> Top Stocked Items
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Highest asset capital valuation holding items</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topStockedItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '16px 0', 
                      borderBottom: index === topStockedItems.length - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.6)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                      {/* Beautiful Quantity Badge */}
                      <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '12px', 
                        backgroundColor: item.status === 'Healthy' ? 'rgba(16, 185, 129, 0.06)' : 
                                         item.status === 'High Stock' ? 'rgba(59, 130, 246, 0.06)' : 'rgba(245, 158, 11, 0.06)', 
                        color: item.status === 'Healthy' ? '#10b981' : 
                               item.status === 'High Stock' ? '#3b82f6' : '#f59e0b', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 850, lineHeight: 1.1 }}>{item.quantity}</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 750, opacity: 0.8, letterSpacing: '0.02em' }}>QTY</span>
                      </div>

                      {/* Content block */}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ 
                          fontWeight: 800, 
                          color: '#0f172a', 
                          fontSize: '0.88rem', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }} title={item.name}>
                          {item.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.74rem', 
                          color: '#64748b', 
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#6366f1' }}>{item.id}</span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ fontWeight: 500 }}>{item.warehouse}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right column - Stacked Valuation and Status Pill */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                      <span style={{ fontWeight: 850, color: '#0f172a', fontSize: '0.92rem' }}>
                        ₹{item.valuation.toLocaleString()}
                      </span>
                      <span style={{ 
                        fontSize: '0.68rem', 
                        fontWeight: 800, 
                        padding: '2px 8px', 
                        borderRadius: '99px',
                        background: item.status === 'Healthy' ? '#ecfdf5' : 
                                    item.status === 'High Stock' ? '#eff6ff' : '#fffbeb',
                        color: item.status === 'Healthy' ? '#10b981' : 
                               item.status === 'High Stock' ? '#3b82f6' : '#f59e0b',
                        border: `1px solid ${
                          item.status === 'Healthy' ? '#d1fae5' : 
                          item.status === 'High Stock' ? '#dbeafe' : '#fef3c7'
                        }`,
                        whiteSpace: 'nowrap'
                      }}>
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em' }}>
                  <BarChart size={20} color="#6366f1" /> Shipment Velocity
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Weekly physical volume dispatched from fulfillment centers</p>
              </div>

              <div style={{ position: 'relative', width: '100%', height: '230px', marginTop: '10px' }}>
                <svg viewBox="0 0 260 230" width="100%" height="100%" style={{ overflow: 'visible' }}>
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
                          style={{ fontSize: '0.62rem', fontWeight: 650, fill: '#94a3b8', fontFamily: 'monospace' }}
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
                    { day: 'Fri', value: 240 }
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
                            filter: hoveredBar === idx ? 'drop-shadow(0 4px 10px rgba(139, 92, 246, 0.25))' : 'none'
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
                            fontFamily: 'monospace'
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
                            transition: 'color 0.2s ease'
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.02em' }}>
                  <UserCheck size={20} color="#10b981" /> Strategic Vendors
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Strategic suppliers with highest PO volume and reliability</p>
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
                      gap: '12px' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                      
                      {/* Avatar initial circle with glowing gradients */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${
                          vendor.id === 'VND-001' ? '#6366f1, #4f46e5' :
                          vendor.id === 'VND-002' ? '#10b981, #059669' :
                          vendor.id === 'VND-003' ? '#a855f7, #7c3aed' :
                          vendor.id === 'VND-004' ? '#f59e0b, #d97706' : '#64748b, #475569'
                        })`,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 850,
                        fontSize: '0.94rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                      }}>
                        {vendor.name.charAt(0)}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ 
                          fontWeight: 800, 
                          color: '#0F172A', 
                          fontSize: '0.88rem', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }} title={vendor.name}>
                          {vendor.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.74rem', 
                          color: '#64748b', 
                          marginTop: '4px', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }}>
                          {vendor.category} • <strong style={{ color: '#475569', fontWeight: 650 }}>{vendor.pos} POs</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                      <div style={{ fontWeight: 850, color: '#0F172A', fontSize: '0.92rem' }}>
                        ₹{vendor.spend.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.74rem', fontWeight: 750, color: vendor.ratingColor }}>
                        <Star size={11} fill={vendor.ratingColor} stroke="none" />
                        <span>{vendor.rating}% Rel.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modern Glassmorphic Metrics Configuration Modal */}
      {showMetricsConfig && (() => {
        const isMaxReached = activeMetricIds.length >= 4;
        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 14, 29, 0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div className="luxury-glass-card" style={{
              width: '100%',
              maxWidth: '720px',
              padding: '32px',
              background: '#ffffff',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              boxShadow: '0 30px 70px rgba(9, 14, 29, 0.12)',
              borderRadius: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}>
              <button 
                onClick={() => setShowMetricsConfig(false)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 850, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
                Configure Dashboard Cards
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, margin: '0 0 20px 0' }}>
                Tailor your Command Center overview. Toggle metrics visibility or build a bespoke card dynamically.
              </p>

              {/* Warning badge if max limits reached */}
              {isMaxReached && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#b45309',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertTriangle size={14} color="#d97706" />
                  <span>Limit Reached: Exactly 4 active cards are configured. Remove an active card to enable adding or creating new highlights.</span>
                </div>
              )}

              {/* Grid Layout inside modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Left Column: Manage Active Metrics */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Active Metrics ({activeMetricIds.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                    {allMetrics.filter(m => activeMetricIds.includes(m.id)).map(m => {
                      const IconComponent = m.icon;
                      return (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{ background: `${m.color}10`, color: m.color, padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                              <IconComponent size={16} />
                            </div>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</span>
                          </div>
                          <button 
                            onClick={() => setActiveMetricIds(prev => prev.filter(id => id !== m.id))}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: '4px', flexShrink: 0 }}
                            title="Remove card"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                    {activeMetricIds.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, border: '1.5px dashed #cbd5e1', borderRadius: '12px' }}>
                        No metrics active. Click below to add.
                      </div>
                    )}
                  </div>

                  <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '20px', marginBottom: '12px' }}>
                    Available to Add
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                    {allMetrics.filter(m => !activeMetricIds.includes(m.id)).map(m => {
                      const IconComponent = m.icon;
                      return (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{ background: `${m.color}10`, color: m.color, padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                              <IconComponent size={16} />
                            </div>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</span>
                          </div>
                          <button 
                            disabled={isMaxReached}
                            onClick={() => setActiveMetricIds(prev => [...prev, m.id])}
                            style={{ 
                              background: isMaxReached ? '#f1f5f9' : 'rgba(99, 102, 241, 0.06)', 
                              border: 'none', 
                              color: isMaxReached ? '#94a3b8' : '#4f46e5', 
                              cursor: isMaxReached ? 'not-allowed' : 'pointer', 
                              display: 'flex', 
                              padding: '6px', 
                              borderRadius: '8px', 
                              flexShrink: 0 
                            }}
                            title={isMaxReached ? "Maximum 4 active metrics allowed" : "Add card"}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Build Custom Metric Card */}
                <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '24px' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Create Custom Metric
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Card Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Stock Value by Warehouse" 
                        value={customMetricLabel} 
                        onChange={e => setCustomMetricLabel(e.target.value)}
                        style={modalInputStyle}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Metric Value</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹185,200 or 12 Items" 
                        value={customMetricValue} 
                        onChange={e => setCustomMetricValue(e.target.value)}
                        style={modalInputStyle}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Trend Text</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +14.2% or Stable" 
                          value={customMetricChange} 
                          onChange={e => setCustomMetricChange(e.target.value)}
                          style={modalInputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Trend Direction</label>
                        <select 
                          value={customMetricIsPositive ? 'up' : 'down'} 
                          onChange={e => setCustomMetricIsPositive(e.target.value === 'up')}
                          style={modalInputStyle}
                        >
                          <option value="up">Positive (+)</option>
                          <option value="down">Negative (-)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Icon Representation</label>
                        <select 
                          value={customMetricIcon} 
                          onChange={e => setCustomMetricIcon(e.target.value as keyof typeof ICON_MAP)}
                          style={modalInputStyle}
                        >
                          {Object.keys(ICON_MAP).map(key => (
                            <option key={key} value={key}>{key}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Accent Color</label>
                        <input 
                          type="color" 
                          value={customMetricColor} 
                          onChange={e => setCustomMetricColor(e.target.value)}
                          style={{ ...modalInputStyle, padding: '4px', height: '36px', cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    <button 
                      disabled={isMaxReached}
                      onClick={() => {
                        if (!customMetricLabel || !customMetricValue) return;
                        const newId = `custom_${Date.now()}`;
                        const newCard = {
                          id: newId,
                          label: customMetricLabel,
                          value: customMetricValue,
                          change: customMetricChange || '0.0%',
                          isPositive: customMetricIsPositive,
                          icon: ICON_MAP[customMetricIcon],
                          color: customMetricColor,
                          shadow: `${customMetricColor}18`,
                          sparkline: 'M 5 25 Q 30 15 60 30 T 110 10 T 155 20 T 195 8',
                          delay: '0s'
                        };
                        setAllMetrics(prev => [...prev, newCard]);
                        setActiveMetricIds(prev => [...prev, newId]);
                        // Reset inputs
                        setCustomMetricLabel('');
                        setCustomMetricValue('');
                        setCustomMetricChange('');
                      }}
                      style={{
                        background: isMaxReached ? '#cbd5e1' : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                        color: isMaxReached ? '#94a3b8' : '#ffffff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: isMaxReached ? 'not-allowed' : 'pointer',
                        boxShadow: isMaxReached ? 'none' : '0 8px 20px rgba(79, 70, 229, 0.15)',
                        marginTop: '8px',
                        textAlign: 'center'
                      }}
                    >
                      {isMaxReached ? 'Limit Reached (Max 4)' : 'Add Custom Card'}
                    </button>
                  </div>
                </div>

              </div>

              <div style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowMetricsConfig(false)}
                  style={{
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  Apply Changes
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
