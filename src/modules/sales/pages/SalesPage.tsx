import React, { useEffect, useState } from 'react';
import type { SalesOrder, ToastMessage, SalesItem } from '../types';

// Import subcomponents
import { SalesHeader } from '../components/SalesHeader';
import { StatsGrid } from '../components/StatsGrid';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { SalesGrid } from '../components/SalesGrid';
import { SalesTable } from '../components/SalesTable';
import { SalesDrawer } from '../components/SalesDrawer';
import { SalesFormModal } from '../components/SalesFormModal';
import { MetricsConfigModal } from '../components/MetricsConfigModal';
import { ToastContainer } from '../components/ToastContainer';

// Import modular styles
import '../styles/sales.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

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

export const SalesPage: React.FC = () => {
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
  const handleRecordSaleSubmit = (data: {
    customerName: string;
    paymentMode: 'UPI' | 'Card' | 'Bank Transfer' | 'Net Banking' | 'Cash';
    discountPercentage: number;
    items: SalesItem[];
    notes: string;
  }) => {
    const subtotal = data.items.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0);
    const discountVal = subtotal * (data.discountPercentage / 100);
    const taxableAmount = subtotal - discountVal;
    const gstVal = taxableAmount * 0.18; // 18% Standard GST
    const finalTotal = taxableAmount + gstVal;

    const newSO: SalesOrder = {
      id: `so-${Math.random().toString(36).substring(2, 9)}`,
      orderNumber: `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: data.customerName,
      status: 'PENDING_DISPATCH',
      createdAt: new Date().toISOString().split('T')[0],
      dispatchDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days lead time
      paymentMode: data.paymentMode,
      items: data.items,
      totalAmount: finalTotal,
      discountPercentage: data.discountPercentage,
      taxAmount: gstVal,
      notes: data.notes
    };

    updateCachedSales([newSO, ...sales]);
    addToast('success', `Sales Invoice "${newSO.orderNumber}" recorded successfully`);
    setShowAddModal(false);
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
    <div className="sales-fade-in">
      {/* TOP HEADER */}
      <SalesHeader
        onConfigureCards={() => setShowConfigureCards(true)}
        onRecordSale={() => setShowAddModal(true)}
      />

      {/* KPI METRIC GRIDS */}
      <StatsGrid
        totalRevenue={totalRevenue}
        ordersFulfilled={ordersFulfilled}
        outstandingReceivables={outstandingReceivables}
        avgOrderValue={avgOrderValue}
        visibleCards={visibleCards}
      />

      {/* ADVANCED CONTROL PANEL */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCSV={handleExportCSV}
      />

      {/* CORE DATA BODY */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 700 }}>
          Retrieving sales ledgers...
        </div>
      ) : filteredSales.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: '24px' }}>
          <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.1rem', margin: 0 }}>No Invoices Map</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', fontWeight: 600 }}>We couldn't locate any completed or pending sales logs.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <SalesGrid
          filteredSales={filteredSales}
          onSelectOrder={setSelectedOrder}
        />
      ) : (
        <SalesTable
          filteredSales={filteredSales}
          onSelectOrder={setSelectedOrder}
        />
      )}

      {/* DETAIL DRAWER */}
      <SalesDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onVoid={handleVoidOrder}
        onFulfill={handleFulfillOrder}
        onDelete={handleDeleteSO}
      />

      {/* RECORD SALE MODAL */}
      <SalesFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleRecordSaleSubmit}
        onErrorToast={(msg) => addToast('error', msg)}
      />

      {/* CONFIGURE CARDS MODAL */}
      <MetricsConfigModal
        isOpen={showConfigureCards}
        onClose={() => setShowConfigureCards(false)}
        visibleCards={visibleCards}
        onChange={(key, checked) => setVisibleCards(prev => ({ ...prev, [key]: checked }))}
      />

      {/* TOASTS */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};
