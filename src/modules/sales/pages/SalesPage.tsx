import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, TrendingUp, CheckCircle2, Clock, 
  X, Trash2, User, Grid, Table, Download, Settings, FileText, ShoppingBag
} from 'lucide-react';

interface SalesItem {
  name: string;
  qty: number;
  unitPrice: number;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: 'PENDING_DISPATCH' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  dispatchDate: string;
  paymentMode: 'UPI' | 'Card' | 'Bank Transfer' | 'Net Banking' | 'Cash';
  items: SalesItem[];
  totalAmount: number;
  discountPercentage: number;
  taxAmount: number;
  notes?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

const DEFAULT_SALES: SalesOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-001',
    customerName: 'Aman Sharma (Google Dev)',
    status: 'COMPLETED',
    createdAt: '2026-05-10',
    dispatchDate: '2026-05-12',
    paymentMode: 'UPI',
    items: [
      { name: 'MacBook Pro 16" M3 Max', qty: 1, unitPrice: 289900 }
    ],
    totalAmount: 289900.00,
    discountPercentage: 0,
    taxAmount: 52182.00,
    notes: 'Direct corporate allocation dispatch.'
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2026-002',
    customerName: 'Viyan Tech Labs Bengaluru',
    status: 'PENDING_DISPATCH',
    createdAt: '2026-05-20',
    dispatchDate: '2026-05-28',
    paymentMode: 'Bank Transfer',
    items: [
      { name: 'Dell UltraSharp 32" 4K Monitor', qty: 2, unitPrice: 74900 },
      { name: 'Logitech MX Master 3S', qty: 5, unitPrice: 9500 }
    ],
    totalAmount: 197300.00,
    discountPercentage: 5,
    taxAmount: 35514.00,
    notes: 'Q2 workspace expansion peripherals order.'
  }
];

export const SalesPage = () => {
  const [sales, setSales] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Selected Detail Drawer
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigureCards, setShowConfigureCards] = useState(false);

  // Add Sales Form State
  const [formCustomer, setFormCustomer] = useState('Aman Sharma (Google Dev)');
  const [formPayment, setFormPayment] = useState<'UPI' | 'Card' | 'Bank Transfer' | 'Net Banking' | 'Cash'>('UPI');
  const [formDiscount, setFormDiscount] = useState('0');
  const [formNotes, setFormNotes] = useState('');
  
  // Dynamic Items in Form
  const [formItems, setFormItems] = useState<SalesItem[]>([{ name: 'MacBook Pro 16" M3 Max', qty: 1, unitPrice: 289900 }]);

  // Card toggles
  const [visibleCards, setVisibleCards] = useState({
    total_revenue: true,
    orders_fulfilled: true,
    outstanding_receivables: true,
    avg_order_value: true
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load cache
  useEffect(() => {
    setLoading(true);
    try {
      const cached = localStorage.getItem('ims_dummy_sales');
      if (cached) {
        setSales(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_sales', JSON.stringify(DEFAULT_SALES));
        setSales(DEFAULT_SALES);
      }
    } catch {
      setSales(DEFAULT_SALES);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCachedSales = (updated: SalesOrder[]) => {
    setSales(updated);
    try {
      localStorage.setItem('ims_dummy_sales', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Record Sale
  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (formItems.some(i => !i.name.trim() || i.qty <= 0 || i.unitPrice <= 0)) {
      addToast('error', 'Please define valid items, quantities, and prices');
      return;
    }

    const subtotal = formItems.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0);
    const discPct = parseFloat(formDiscount) || 0;
    const discountVal = subtotal * (discPct / 100);
    const taxableAmount = subtotal - discountVal;
    const gstVal = taxableAmount * 0.18; // 18% Standard GST
    const finalTotal = taxableAmount + gstVal;

    const newSO: SalesOrder = {
      id: `so-${Math.random().toString(36).substring(2, 9)}`,
      orderNumber: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: formCustomer,
      status: 'PENDING_DISPATCH',
      createdAt: new Date().toISOString().split('T')[0],
      dispatchDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days lead time
      paymentMode: formPayment,
      items: formItems,
      totalAmount: finalTotal,
      discountPercentage: discPct,
      taxAmount: gstVal,
      notes: formNotes.trim()
    };

    updateCachedSales([newSO, ...sales]);
    addToast('success', `Sales Invoice "${newSO.orderNumber}" recorded successfully`);
    setShowAddModal(false);
    setFormItems([{ name: 'MacBook Pro 16" M3 Max', qty: 1, unitPrice: 289900 }]);
    setFormDiscount('0');
    setFormNotes('');
  };

  // Dispatch/Fulfill Sale
  const handleFulfillOrder = () => {
    if (!selectedOrder) return;

    const updated = sales.map((s) => {
      if (s.id === selectedOrder.id) {
        return { ...s, status: 'COMPLETED' as const };
      }
      return s;
    });

    updateCachedSales(updated);
    const found = updated.find(x => x.id === selectedOrder.id);
    if (found) setSelectedOrder(found);

    addToast('success', `Sales Order "${selectedOrder.orderNumber}" is now dispatched and completed`);
  };

  // Void Sale
  const handleVoidOrder = () => {
    if (!selectedOrder) return;

    const updated = sales.map((s) => {
      if (s.id === selectedOrder.id) {
        return { ...s, status: 'CANCELLED' as const };
      }
      return s;
    });

    updateCachedSales(updated);
    const found = updated.find(x => x.id === selectedOrder.id);
    if (found) setSelectedOrder(found);

    addToast('warning', `Sales Order "${selectedOrder.orderNumber}" has been voided`);
  };

  // Delete Record
  const handleDeleteSO = () => {
    if (!selectedOrder) return;
    const orderNum = selectedOrder.orderNumber;
    const updated = sales.filter(s => s.id !== selectedOrder.id);
    updateCachedSales(updated);
    addToast('warning', `Removed invoice record "${orderNum}"`);
    setSelectedOrder(null);
  };

  // Dynamic form items
  const addFormItemField = () => {
    setFormItems([...formItems, { name: '', qty: 1, unitPrice: 1000 }]);
  };

  const removeFormItemField = (idx: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const updateFormItemField = (idx: number, field: keyof SalesItem, value: string | number) => {
    const next = formItems.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormItems(next);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (sales.length === 0) {
      addToast('error', 'No sales transactions to export');
      return;
    }
    const headers = ['Order Number', 'Customer', 'Payment Mode', 'Invoice Date', 'Dispatch Date', 'Status', 'Valuation'];
    const rows = sales.map(s => [
      s.orderNumber,
      `"${s.customerName.replace(/"/g, '""')}"`,
      s.paymentMode,
      s.createdAt,
      s.dispatchDate,
      s.status,
      `₹${s.totalAmount.toFixed(2)}`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viyan_sales_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Sales logs exported successfully as CSV');
  };

  // Calculations
  const totalRevenue = sales.filter(s => s.status === 'COMPLETED').reduce((sum, s) => sum + s.totalAmount, 0);
  const ordersFulfilled = sales.filter(s => s.status === 'COMPLETED').length;
  const outstandingReceivables = sales.filter(s => s.status === 'PENDING_DISPATCH').reduce((sum, s) => sum + s.totalAmount, 0);
  const completedSales = sales.filter(s => s.status === 'COMPLETED');
  const avgOrderValue = completedSales.length > 0 
    ? totalRevenue / completedSales.length 
    : 0;

  const cardDefinitions = [
    {
      id: 'total_revenue',
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Fulfillment sales volume',
      icon: TrendingUp,
      className: 'emerald',
      color: '#059669'
    },
    {
      id: 'orders_fulfilled',
      label: 'Orders Fulfilled',
      value: ordersFulfilled,
      subtext: 'Dispatched sales shipments',
      icon: CheckCircle2,
      className: 'blue',
      color: '#6366f1'
    },
    {
      id: 'outstanding_receivables',
      label: 'Outstanding Receivables',
      value: `₹${outstandingReceivables.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Pending client payments',
      icon: Clock,
      className: 'rose',
      color: '#e11d48'
    },
    {
      id: 'avg_order_value',
      label: 'Avg Order Value (AOV)',
      value: `₹${avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Average fulfilled sales ticket',
      icon: ShoppingBag,
      className: 'purple',
      color: '#8b5cf6'
    }
  ];

  // Filtering
  const filteredSales = sales.filter((s) => {
    const matchesSearch = 
      s.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'pending') return s.status === 'PENDING_DISPATCH';
    if (activeTab === 'completed') return s.status === 'COMPLETED';
    if (activeTab === 'cancelled') return s.status === 'CANCELLED';

    return true;
  });

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)', padding: '24px' }}>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
        .stat-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
        }
        .stat-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(99, 102, 241, 0.06);
          border-color: rgba(99, 102, 241, 0.2);
        }
        .stat-card-label {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .stat-card-value {
          font-size: 2.0rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .stat-card-subtext {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .stat-card-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-card-icon-wrapper.blue { background: #f0f3ff; color: #6366f1; }
        .stat-card-icon-wrapper.emerald { background: #ecfdf5; color: #059669; }
        .stat-card-icon-wrapper.purple { background: #f5f3ff; color: #8b5cf6; }
        .stat-card-icon-wrapper.rose { background: #fff1f2; color: #e11d48; }

        .search-container {
          background: #ffffff;
          padding: 14px;
          border-radius: 20px;
          border: 1.5px solid #f1f5f9;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          margin-bottom: 24px;
        }
        .filter-tab {
          border: none;
          background: transparent;
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-tab.active {
          background: #6366f1;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .filter-tab:not(.active):hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .sales-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .sales-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 26px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.015);
        }
        .sales-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 22px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.25);
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .status-badge.completed { background: #ECFDF5; color: #059669; }
        .status-badge.pending { background: #EFF6FF; color: #2563EB; }
        .status-badge.cancelled { background: #FEF2F2; color: #DC2626; }

        .premium-table-container {
          background: #ffffff;
          border-radius: 24px;
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
        }
        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .premium-table th {
          background: #f8fafc;
          padding: 18px 24px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1.5px solid #e2e8f0;
          text-align: left;
        }
        .premium-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
          vertical-align: middle;
        }
        .premium-table tr:last-child td { border-bottom: none; }
        .premium-table tr { cursor: pointer; transition: all 0.2s ease; }
        .premium-table tr:hover td { background: #f8fafc; }

        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1001;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.25s ease-out;
        }
        .drawer-sheet {
          width: 500px;
          max-width: 100%;
          background: #ffffff;
          height: 100%;
          box-shadow: -10px 0 40px rgba(15, 23, 42, 0.1);
          padding: 36px;
          box-sizing: border-box;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(6px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        .premium-modal-content {
          background: #ffffff;
          border-radius: 28px;
          padding: 36px;
          width: 580px;
          max-width: 95%;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .toast-card {
          padding: 16px 20px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border-left: 5px solid #6366f1;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #1e293b;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '6px' }}>
            <TrendingUp size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Operations Ledger</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Sales & Invoicing</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 600, fontSize: '0.94rem' }}>Fulfill client orders, track payments, review discount systems, and issue dispatch clearance nodes.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowConfigureCards(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', 
              borderRadius: '16px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#475569', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <Settings size={18} /> Configure Cards
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
              borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)', outline: 'none'
            }}
          >
            <Plus size={20} /> Record New Sale
          </button>
        </div>
      </div>

      {/* KPI METRIC GRIDS */}
      <div className="stats-grid">
        {cardDefinitions.map((c) => {
          if (!visibleCards[c.id as keyof typeof visibleCards]) return null;
          const Icon = c.icon;
          return (
            <div key={c.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{c.label}</div>
                <div className="stat-card-value">{c.value}</div>
                <div className="stat-card-subtext">{c.subtext}</div>
              </div>
              <div className={`stat-card-icon-wrapper ${c.className}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ADVANCED CONTROL PANEL */}
      <div className="search-container">
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search sales logs by ID, client or payment mode..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px',
              border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.88rem',
              fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('all')} className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}>All</button>
          <button onClick={() => setActiveTab('pending')} className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}>Pending Dispatch</button>
          <button onClick={() => setActiveTab('completed')} className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}>Fulfilled</button>
          <button onClick={() => setActiveTab('cancelled')} className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}>Voided</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                padding: '6px 10px', borderRadius: '8px', border: 'none', 
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#6366f1' : '#64748b', cursor: 'pointer', outline: 'none'
              }}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              style={{ 
                padding: '6px 10px', borderRadius: '8px', border: 'none', 
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#6366f1' : '#64748b', cursor: 'pointer', outline: 'none'
              }}
            >
              <Table size={16} />
            </button>
          </div>

          <button 
            onClick={handleExportCSV}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
              borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* CORE DATA BODY */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 700 }}>
          Retrieving sales ledgers...
        </div>
      ) : filteredSales.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: '24px' }}>
          <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.1rem', margin: 0 }}>No Invoices Map</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', fontWeight: 600 }}>We couldn't locate any completed or pending sales logs.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="sales-grid">
          {filteredSales.map((s) => (
            <div 
              key={s.id} 
              className="sales-card-premium"
              onClick={() => setSelectedOrder(s)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6366f1', fontSize: '0.8rem' }}>
                  {s.orderNumber}
                </span>
                <span className={`status-badge ${s.status === 'COMPLETED' ? 'completed' : s.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
                  {s.status === 'PENDING_DISPATCH' ? 'Pending Dispatch' : s.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                {s.customerName}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, margin: '0 0 16px 0' }}>
                Paid via: {s.paymentMode}
              </p>

              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{s.items.length} item(s)</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669' }}>
                  ₹{s.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div style={{ height: '1.5px', background: '#f1f5f9', marginBottom: '14px' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>
                <span>Order: {s.createdAt}</span>
                <span>Dispatch: {s.dispatchDate}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Client Name</th>
                <th>Payment Mode</th>
                <th>Created Date</th>
                <th>Dispatch Due</th>
                <th>Total Valuation</th>
                <th>Discount</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((s) => (
                <tr key={s.id} onClick={() => setSelectedOrder(s)}>
                  <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{s.orderNumber}</td>
                  <td>{s.customerName}</td>
                  <td style={{ color: '#475569', fontWeight: 650 }}>{s.paymentMode}</td>
                  <td>{s.createdAt}</td>
                  <td>{s.dispatchDate}</td>
                  <td style={{ fontWeight: 850, color: '#059669' }}>₹{s.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: '#e11d48' }}>{s.discountPercentage}%</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${s.status === 'COMPLETED' ? 'completed' : s.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
                      {s.status === 'PENDING_DISPATCH' ? 'Pending Dispatch' : s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedOrder && (
        <div className="drawer-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className={`status-badge ${selectedOrder.status === 'COMPLETED' ? 'completed' : selectedOrder.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
                {selectedOrder.status === 'PENDING_DISPATCH' ? 'Pending Dispatch' : selectedOrder.status}
              </span>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '14px', color: '#8b5cf6' }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{selectedOrder.orderNumber}</h2>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> {selectedOrder.customerName}
                </div>
              </div>
            </div>

            <div style={{ height: '1.5px', background: '#f1f5f9', margin: '24px 0' }}></div>

            <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
              Transaction Parameters
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Payment Mode</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginTop: '6px' }}>{selectedOrder.paymentMode}</div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Dispatch Target</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginTop: '6px' }}>{selectedOrder.dispatchDate}</div>
              </div>
            </div>

            {/* Bill items */}
            <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
              Line Items list
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>
                      {item.qty} units × ₹{item.unitPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.94rem', fontWeight: 850, color: '#0f172a' }}>
                    ₹{(item.qty * item.unitPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Tax and totals */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '20px', border: '1.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                <span>Discount applied</span>
                <span style={{ color: '#e11d48' }}>-{selectedOrder.discountPercentage}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                <span>18% Standard GST</span>
                <span>₹{selectedOrder.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Grand Total</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 950, color: '#059669' }}>
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div style={{ background: '#eef2ff', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e0e7ff', marginBottom: '24px', fontSize: '0.84rem', color: '#3730a3', fontWeight: 650, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800 }}>Notes: </span> {selectedOrder.notes}
              </div>
            )}

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedOrder.status === 'PENDING_DISPATCH' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleVoidOrder}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #fca5a5',
                      background: '#fff5f5', color: '#c53030', fontWeight: 800, fontSize: '0.88rem',
                      cursor: 'pointer', outline: 'none'
                    }}
                  >
                    Void Invoice
                  </button>
                  <button 
                    onClick={handleFulfillOrder}
                    style={{
                      flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                      background: '#059669', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem',
                      cursor: 'pointer', outline: 'none', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
                    }}
                  >
                    Authorize Dispatch
                  </button>
                </div>
              )}

              <button 
                onClick={handleDeleteSO}
                style={{ 
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  padding: '12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#ffffff',
                  color: '#be123c', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', outline: 'none'
                }}
              >
                <Trash2 size={16} /> Delete Sales Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD SALE MODAL */}
      {showAddModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Record Sales Transaction</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleRecordSale} style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Client / Customer</label>
                  <select 
                    value={formCustomer} 
                    onChange={(e) => setFormCustomer(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="Aman Sharma (Google Dev)">Aman Sharma (Google Dev)</option>
                    <option value="Viyan Tech Labs Bengaluru">Viyan Tech Labs Bengaluru</option>
                    <option value="Shanmugavel Arumugam">Shanmugavel Arumugam</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Payment Mode</label>
                  <select 
                    value={formPayment} 
                    onChange={(e) => setFormPayment(e.target.value as any)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="UPI">UPI (Immediate Settlement)</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Special Discount (%)</label>
                  <input 
                    type="number" 
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    placeholder="e.g. 5"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Internal Notes</label>
                  <input 
                    type="text" 
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Authorized under custom pricing model"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Items Dynamic Config */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, margin: 0 }}>Configure Invoice Items</h4>
                <button 
                  type="button" 
                  onClick={addFormItemField}
                  style={{
                    background: 'none', border: 'none', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              {formItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Product Name"
                    value={item.name}
                    onChange={(e) => updateFormItemField(idx, 'name', e.target.value)}
                    style={{
                      flex: 2, padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.84rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateFormItemField(idx, 'qty', parseInt(e.target.value, 10) || 0)}
                    style={{
                      width: '60px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => updateFormItemField(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeFormItemField(idx)}
                    disabled={formItems.length === 1}
                    style={{
                      background: 'none', border: 'none', color: formItems.length === 1 ? '#cbd5e1' : '#be123c', cursor: 'pointer', padding: '6px', outline: 'none'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                    background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.88rem',
                    cursor: 'pointer', outline: 'none'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                    fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', outline: 'none'
                  }}
                >
                  Record Sales Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIGURE CARDS MODAL */}
      {showConfigureCards && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Configure Cards</h3>
              <button 
                onClick={() => setShowConfigureCards(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: 16 }}>Select which KPI metric cards to display on top of the Sales hub.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {Object.keys(visibleCards).map((key) => {
                const label = key === 'total_revenue' ? 'Total Revenue' :
                              key === 'orders_fulfilled' ? 'Orders Fulfilled' :
                              key === 'outstanding_receivables' ? 'Outstanding Receivables' : 'Avg Order Value';
                return (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={visibleCards[key as keyof typeof visibleCards]}
                      onChange={(e) => setVisibleCards(prev => ({ ...prev, [key]: e.target.checked }))}
                      style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>

            <button 
              onClick={() => setShowConfigureCards(false)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                background: '#6366f1', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem',
                cursor: 'pointer', outline: 'none'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast-card" style={{ borderLeftColor: t.type === 'success' ? '#059669' : t.type === 'warning' ? '#ea580c' : t.type === 'error' ? '#e11d48' : '#6366f1' }}>
            <span style={{ flex: 1 }}>{t.text}</span>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, outline: 'none' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
