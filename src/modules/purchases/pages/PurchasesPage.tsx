import React, { useEffect, useState } from 'react';
import type { PurchaseOrder, POItem, ToastMessage } from '../types';

// Import subcomponents
import { PurchasesHeader } from '../components/PurchasesHeader';
import { StatsGrid } from '../components/StatsGrid';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { PurchasesGrid } from '../components/PurchasesGrid';
import { PurchasesTable } from '../components/PurchasesTable';
import { PurchasesDrawer } from '../components/PurchasesDrawer';
import { PurchasesFormModal } from '../components/PurchasesFormModal';
import { MetricsConfigModal } from '../components/MetricsConfigModal';
import { ToastContainer } from '../components/ToastContainer';

// Import modular styles
import '../styles/purchases.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

const DEFAULT_REPORTS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-001',
    supplierName: 'Acme Hardware Corporates',
    status: 'COMPLETED',
    createdAt: '2026-05-01',
    deliveryDate: '2026-05-10',
    warehouseBranch: 'Mumbai Central Hub',
    items: [
      { name: 'MacBook Pro 16" M3 Max', qty: 10, unitPrice: 289900 },
      { name: 'Dell UltraSharp 32" 4K Monitor', qty: 5, unitPrice: 74900 }
    ],
    totalAmount: 3273500.00,
    notes: 'Standard bi-annual hardware replenishment cycle.'
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-002',
    supplierName: 'Logitech Retail Distributors',
    status: 'PENDING',
    createdAt: '2026-05-15',
    deliveryDate: '2026-05-28',
    warehouseBranch: 'Bangalore Tech Park Depot',
    items: [
      { name: 'Logitech MX Master 3S', qty: 50, unitPrice: 9500 }
    ],
    totalAmount: 475000.00,
    notes: 'Urgent stock replenishment to satisfy pending employee work requests.'
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-003',
    supplierName: 'Global SaaS Providers',
    status: 'DRAFT',
    createdAt: '2026-05-25',
    deliveryDate: '2026-06-01',
    warehouseBranch: 'Mumbai Central Hub',
    items: [
      { name: 'Microsoft 365 E5 Cloud License', qty: 100, unitPrice: 3100 }
    ],
    totalAmount: 310000.00,
    notes: 'Draft order for Q3 cloud provisioning allocations.'
  }
];

export const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Selected Detail Drawer
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigureCards, setShowConfigureCards] = useState(false);

  // Card configuration
  const [visibleCards, setVisibleCards] = useState({
    active_drafts: true,
    historic_exp: true,
    accounts_payable: true,
    fulfillment_rate: true
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
      const cached = localStorage.getItem('ims_dummy_purchases');
      if (cached) {
        setPurchases(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_purchases', JSON.stringify(DEFAULT_REPORTS));
        setPurchases(DEFAULT_REPORTS);
      }
    } catch {
      setPurchases(DEFAULT_REPORTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCachedPurchases = (updated: PurchaseOrder[]) => {
    setPurchases(updated);
    try {
      localStorage.setItem('ims_dummy_purchases', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Create PO
  const handleCreatePOSubmit = (data: {
    supplierName: string;
    warehouseBranch: string;
    deliveryDate: string;
    items: POItem[];
    notes: string;
  }) => {
    const totalVal = data.items.reduce((sum, i) => sum + (i.qty * i.unitPrice), 0);

    const newPO: PurchaseOrder = {
      id: `po-${Math.random().toString(36).substring(2, 9)}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName: data.supplierName,
      status: 'DRAFT',
      createdAt: new Date().toISOString().split('T')[0],
      deliveryDate: data.deliveryDate || new Date().toISOString().split('T')[0],
      warehouseBranch: data.warehouseBranch,
      items: data.items,
      totalAmount: totalVal,
      notes: data.notes
    };

    updateCachedPurchases([newPO, ...purchases]);
    addToast('success', `Purchase Order "${newPO.poNumber}" created as DRAFT`);
    setShowAddModal(false);
  };

  // Update Status (Fulfill/Cancel)
  const handleStatusUpdate = (status: 'PENDING' | 'COMPLETED' | 'CANCELLED') => {
    if (!selectedPO) return;

    const updated = purchases.map((p) => {
      if (p.id === selectedPO.id) {
        return { ...p, status };
      }
      return p;
    });

    updateCachedPurchases(updated);
    const found = updated.find(x => x.id === selectedPO.id);
    if (found) setSelectedPO(found);

    addToast('success', `Purchase Order status updated to "${status}"`);
  };

  // Delete PO
  const handleDeletePO = () => {
    if (!selectedPO) return;
    const poNum = selectedPO.poNumber;
    const updated = purchases.filter(p => p.id !== selectedPO.id);
    updateCachedPurchases(updated);
    addToast('warning', `Removed Purchase Order "${poNum}" from registry`);
    setSelectedPO(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (purchases.length === 0) {
      addToast('error', 'No purchase records to export');
      return;
    }
    const headers = ['PO Number', 'Supplier', 'Warehouse Branch', 'Date Created', 'Delivery Date', 'Status', 'Valuation'];
    const rows = purchases.map(p => [
      p.poNumber,
      `"${p.supplierName.replace(/"/g, '""')}"`,
      p.warehouseBranch,
      p.createdAt,
      p.deliveryDate,
      p.status,
      `₹${p.totalAmount.toFixed(2)}`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viyan_purchase_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Purchase registry successfully exported as CSV');
  };

  // Calculations
  const activeDrafts = purchases.filter(p => p.status === 'DRAFT').length;
  const historicSpend = purchases.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.totalAmount, 0);
  const outstandingPayables = purchases.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.totalAmount, 0);
  const fulfillmentRate = purchases.length > 0 
    ? Math.round((purchases.filter(p => p.status === 'COMPLETED').length / purchases.length) * 100) 
    : 0;

  // Filtering
  const filteredPOs = purchases.filter((po) => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.warehouseBranch.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'draft') return po.status === 'DRAFT';
    if (activeTab === 'pending') return po.status === 'PENDING';
    if (activeTab === 'completed') return po.status === 'COMPLETED';

    return true;
  });

  return (
    <div className="purchases-fade-in">
      {/* TOP HEADER */}
      <PurchasesHeader
        onConfigureCards={() => setShowConfigureCards(true)}
        onCreateOrder={() => setShowAddModal(true)}
      />

      {/* DYNAMIC KPI CARDS */}
      <StatsGrid
        activeDrafts={activeDrafts}
        historicSpend={historicSpend}
        outstandingPayables={outstandingPayables}
        fulfillmentRate={fulfillmentRate}
        visibleCards={visibleCards}
      />

      {/* SEARCH AND FILTERS CONTAINER */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCSV={handleExportCSV}
      />

      {/* DATA CORE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 700 }}>
          Synchronizing procurement nodes...
        </div>
      ) : filteredPOs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: '24px' }}>
          <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.1rem', margin: 0 }}>No Purchase Records</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', fontWeight: 600 }}>We couldn't locate any active PO cycles matching your constraints.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <PurchasesGrid
          filteredPOs={filteredPOs}
          onSelectPO={setSelectedPO}
        />
      ) : (
        <PurchasesTable
          filteredPOs={filteredPOs}
          onSelectPO={setSelectedPO}
        />
      )}

      {/* DETAIL DRAWER */}
      <PurchasesDrawer
        po={selectedPO}
        onClose={() => setSelectedPO(null)}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDeletePO}
      />

      {/* CREATE PO MODAL */}
      <PurchasesFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreatePOSubmit}
        onErrorToast={(msg) => addToast('error', msg)}
      />

      {/* CONFIGURE CARDS MODAL */}
      <MetricsConfigModal
        isOpen={showConfigureCards}
        onClose={() => setShowConfigureCards(false)}
        visibleCards={visibleCards}
        onChange={(key, checked) => setVisibleCards(prev => ({ ...prev, [key]: checked }))}
      />

      {/* TOAST CONTAINER */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};
