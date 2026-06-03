import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, UserRound } from 'lucide-react';
import { suppliersApi } from '../../../core/api/suppliers';
import type { Supplier, LedgerEntry, ToastMessage } from '../types';

// Styling overrides
import '../styles/suppliers.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

// Modular Components
import { SuppliersHeader } from '../components/SuppliersHeader';
import { StatsGrid } from '../components/StatsGrid';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { SupplierGrid } from '../components/SupplierGrid';
import { SupplierTable } from '../components/SupplierTable';
import { SupplierDrawer } from '../components/SupplierDrawer';
import { SupplierFormModal } from '../components/SupplierFormModal';
import { PaymentModal } from '../components/PaymentModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { MetricsConfigModal } from '../components/MetricsConfigModal';
import { ToastContainer } from '../components/ToastContainer';

// Toggle this to true if you want to fall back to the live API endpoints.
// By default, we use local persistent storage to showcase high-fidelity interactions!
const USE_REAL_API = false;

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Apex Core Industrial',
    contactPerson: 'Sarah Jenkins',
    email: 's.jenkins@apexcore.io',
    phone: '+1 (555) 019-2834',
    address: '1044 Industrial Parkway, Sector 7, Chicago, IL',
    currentBalance: 14500.00,
    type: 'OEM Manufacturer',
    rating: 4.8,
    outstandingOrders: 3,
    ledger: [
      { id: 'l-1-1', date: '2026-05-10', type: 'invoice', label: 'Purchase Invoice #PI-8821', amount: 8500.00, isCredit: true },
      { id: 'l-1-2', date: '2026-05-12', type: 'payment', label: 'Ledger Payment - Ref #TXN-9021', amount: 3000.00, isCredit: false },
      { id: 'l-1-3', date: '2026-05-15', type: 'invoice', label: 'Purchase Invoice #PI-8910', amount: 9000.00, isCredit: true }
    ]
  },
  {
    id: 'sup-2',
    name: 'Vanguard Electronics',
    contactPerson: 'Kenji Tanaka',
    email: 'k.tanaka@vanguard-elec.jp',
    phone: '+81 3-5555-0143',
    address: '2-3-14 Akihabara, Chiyoda-ku, Tokyo, Japan',
    currentBalance: 28450.50,
    type: 'Technology OEM',
    rating: 4.9,
    outstandingOrders: 5,
    ledger: [
      { id: 'l-2-1', date: '2026-05-01', type: 'invoice', label: 'Purchase Invoice #PI-8701', amount: 20000.00, isCredit: true },
      { id: 'l-2-2', date: '2026-05-05', type: 'payment', label: 'Ledger Payment - Ref #TXN-8812', amount: 10000.00, isCredit: false },
      { id: 'l-2-3', date: '2026-05-14', type: 'invoice', label: 'Purchase Invoice #PI-8904', amount: 18450.50, isCredit: true }
    ]
  },
  {
    id: 'sup-3',
    name: 'Starlight Packaging Group',
    contactPerson: 'Elena Rostova',
    email: 'e.rostova@starlight-pack.eu',
    phone: '+49 89 2019 3421',
    address: 'Kaiserstraße 12, 80801 München, Germany',
    currentBalance: 0.00,
    type: 'Raw Materials',
    rating: 4.5,
    outstandingOrders: 0,
    ledger: [
      { id: 'l-3-1', date: '2026-04-20', type: 'invoice', label: 'Purchase Invoice #PI-8622', amount: 4500.00, isCredit: true },
      { id: 'l-3-2', date: '2026-04-25', type: 'payment', label: 'Ledger Payment - Ref #TXN-8704', amount: 4500.00, isCredit: false }
    ]
  },
  {
    id: 'sup-4',
    name: 'Nova Global Logistics',
    contactPerson: 'Marcus Vance',
    email: 'm.vance@novaglobal.com',
    phone: '+1 (555) 012-9988',
    address: '500 Portside Terminal, Suite 12B, Newark, NJ',
    currentBalance: 3200.00,
    type: 'Third-Party Logistics',
    rating: 4.7,
    outstandingOrders: 2,
    ledger: [
      { id: 'l-4-1', date: '2026-05-08', type: 'invoice', label: 'Logistics Services #LI-3091', amount: 5200.00, isCredit: true },
      { id: 'l-4-2', date: '2026-05-12', type: 'payment', label: 'Ledger Payment - Ref #TXN-8991', amount: 2000.00, isCredit: false }
    ]
  },
  {
    id: 'sup-5',
    name: 'Aura Bio-Synthetics',
    contactPerson: 'Dr. Liam Patel',
    email: 'liam.patel@aurabio.org',
    phone: '+44 20 7946 0958',
    address: '88 Science Park Dr, Cambridge, UK',
    currentBalance: 9800.00,
    type: 'Chemicals & Synthetics',
    rating: 4.6,
    outstandingOrders: 1,
    ledger: [
      { id: 'l-5-1', date: '2026-05-02', type: 'invoice', label: 'Purchase Invoice #PI-8803', amount: 9800.00, isCredit: true }
    ]
  }
];

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'debt' | 'elite' | 'oem' | 'logistics'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  // Card Configurations
  const [activeCardIds, setActiveCardIds] = useState<string[]>([
    'active_suppliers',
    'outstanding_payables',
    'active_purchase_orders',
    'top_rated_suppliers'
  ]);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);
  
  // Custom Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Drawer / Selection State
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Modal toggles
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add Toast Notification
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Load suppliers (from LocalStorage or Real API)
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (USE_REAL_API) {
        const response = await suppliersApi.findAll();
        setSuppliers(Array.isArray(response) ? response : []);
      } else {
        const cached = localStorage.getItem('ims_dummy_suppliers');
        if (cached) {
          setSuppliers(JSON.parse(cached));
        } else {
          localStorage.setItem('ims_dummy_suppliers', JSON.stringify(DEFAULT_SUPPLIERS));
          setSuppliers(DEFAULT_SUPPLIERS);
        }
      }
    } catch (err) {
      setError((err as Error).message || 'Failed fetching supply network data');
      addToast('error', 'Connection to supply ledger failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCachedSuppliers = (updatedList: Supplier[]) => {
    setSuppliers(updatedList);
    if (!USE_REAL_API) {
      localStorage.setItem('ims_dummy_suppliers', JSON.stringify(updatedList));
    }
  };

  // Export suppliers to CSV
  const handleExportSuppliers = () => {
    try {
      const headers = ['Supplier Name', 'Category / Type', 'Primary Contact', 'Email Address', 'Phone Number', 'Address', 'Outstanding Amount', 'Active POs', 'Rating'];
      
      const csvRows = filteredSuppliers.map(sup => [
        `"${sup.name.replace(/"/g, '""')}"`,
        `"${sup.type.replace(/"/g, '""')}"`,
        `"${sup.contactPerson.replace(/"/g, '""')}"`,
        `"${sup.email.replace(/"/g, '""')}"`,
        `"${sup.phone.replace(/"/g, '""')}"`,
        `"${sup.address.replace(/"/g, '""')}"`,
        sup.currentBalance,
        sup.outstandingOrders,
        sup.rating.toFixed(1)
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Supplier_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast('success', 'Supplier database exported successfully as CSV!');
    } catch {
      addToast('error', 'Failed to export supplier data.');
    }
  };

  const handleOpenOnboard = () => {
    setEditingSupplier(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setShowFormModal(true);
  };

  // Save Supplier (Create or Edit)
  const handleSaveSupplier = (
    name: string,
    contact: string,
    email: string,
    phone: string,
    type: string,
    rating: string,
    address: string
  ) => {
    if (!name.trim()) {
      addToast('error', 'Supplier Name is required');
      return;
    }

    const ratingNum = parseFloat(rating) || 4.5;

    if (editingSupplier) {
      const updated = suppliers.map((s) => {
        if (s.id === editingSupplier.id) {
          return {
            ...s,
            name,
            contactPerson: contact,
            email,
            phone,
            type,
            rating: Math.min(5, Math.max(1, ratingNum)),
            address
          };
        }
        return s;
      });

      updateCachedSuppliers(updated);
      
      if (selectedSupplier && selectedSupplier.id === editingSupplier.id) {
        const found = updated.find((x) => x.id === editingSupplier.id);
        if (found) setSelectedSupplier(found);
      }

      addToast('success', `Successfully updated supplier info for ${name}`);
    } else {
      const newId = `sup-${Math.random().toString(36).substring(2, 9)}`;
      const newSupplier: Supplier = {
        id: newId,
        name,
        contactPerson: contact,
        email,
        phone,
        address,
        type,
        rating: Math.min(5, Math.max(1, ratingNum)),
        currentBalance: 0,
        outstandingOrders: 0,
        ledger: []
      };

      updateCachedSuppliers([newSupplier, ...suppliers]);
      addToast('success', `Supplier ${name} added successfully!`);
    }

    setShowFormModal(false);
  };

  // Delete Supplier
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;
    const name = selectedSupplier.name;
    const updated = suppliers.filter((s) => s.id !== selectedSupplier.id);
    updateCachedSuppliers(updated);
    addToast('warning', `Terminated partner node agreement with ${name}`);
    setSelectedSupplier(null);
    setShowDeleteConfirm(false);
  };

  // Submit Ledger Payment
  const handleRecordPayment = (
    amount: string,
    ref: string,
    notes: string
  ) => {
    if (!selectedSupplier) return;

    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      addToast('error', 'Payment amount must be greater than ₹0.00');
      return;
    }

    if (amt > selectedSupplier.currentBalance) {
      addToast('warning', 'Processing surplus payment beyond current active liability');
    }

    const refCode = ref.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry: LedgerEntry = {
      id: `l-pay-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      label: `Ledger Payment - Ref #${refCode}${notes ? ` (${notes})` : ''}`,
      amount: amt,
      isCredit: false
    };

    const updated = suppliers.map((s) => {
      if (s.id === selectedSupplier.id) {
        return {
          ...s,
          currentBalance: Math.max(0, s.currentBalance - amt),
          ledger: [newEntry, ...s.ledger]
        };
      }
      return s;
    });

    updateCachedSuppliers(updated);
    
    const found = updated.find((x) => x.id === selectedSupplier.id);
    if (found) setSelectedSupplier(found);

    addToast('success', `Disbursed ₹${amt.toFixed(2)} to ${selectedSupplier.name}. Ref: ${refCode}`);
    setShowPaymentModal(false);
  };

  // Calculate metrics dynamically
  const metrics = {
    totalCount: suppliers.length,
    totalLiability: suppliers.reduce((sum, s) => sum + s.currentBalance, 0),
    activeOrders: suppliers.reduce((sum, s) => sum + s.outstandingOrders, 0),
    pendingDeliveries: suppliers.reduce((sum, s) => sum + (s.outstandingOrders > 0 ? Math.floor(s.outstandingOrders * 0.8) + 1 : 0), 0),
    overduePayments: suppliers.reduce((sum, s) => sum + (s.currentBalance > 12000 ? s.currentBalance * 0.35 : 0), 0),
    eliteCount: suppliers.filter((s) => s.rating >= 4.7).length,
  };

  // Filter & Search Logic
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch = 
      sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'debt') return sup.currentBalance > 0;
    if (activeTab === 'elite') return sup.rating >= 4.7;
    if (activeTab === 'oem') return ['OEM Manufacturer', 'Technology OEM', 'Raw Materials', 'Manufacturer', 'Distributor', 'Wholesaler'].includes(sup.type);
    if (activeTab === 'logistics') return ['Third-Party Logistics', 'Logistics Broker', 'Logistics'].includes(sup.type);

    return true;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
        <Loader2 className="spin" color="var(--primary-glow)" size={42} style={{ animation: 'spin 1.2s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 650, fontSize: '0.9rem' }}>Initializing Procurement Control Node...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <SuppliersHeader 
        onExport={handleExportSuppliers}
        onAddSupplier={handleOpenOnboard}
      />

      <StatsGrid 
        totalCount={metrics.totalCount}
        totalLiability={metrics.totalLiability}
        activeOrders={metrics.activeOrders}
        pendingDeliveries={metrics.pendingDeliveries}
        overduePayments={metrics.overduePayments}
        eliteCount={metrics.eliteCount}
        activeCardIds={activeCardIds}
        onConfigureCards={() => setShowMetricsConfig(true)}
      />

      <SearchFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* ERROR HANDLER */}
      {error && (
        <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '16px', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, border: '1px solid #FEE2E2', marginBottom: '24px' }}>
          <AlertCircle size={22} /> {error}
        </div>
      )}

      {/* MAIN RENDER GRID */}
      {filteredSuppliers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '90px 20px', background: '#ffffff', border: '2px dashed #E2E8F0', borderRadius: '24px', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ height: '76px', width: '76px', background: '#F0F5FF', color: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <UserRound size={36} />
          </div>
          <h3 style={{ fontWeight: 850, fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>No Registered Suppliers</h3>
          <p style={{ color: '#64748b', marginTop: '8px', maxWidth: '420px', margin: '8px auto', fontSize: '0.9rem', fontWeight: 550, lineHeight: 1.5 }}>
            Get started by adding a supplier to track outstanding balances, purchase orders, and ledger timelines.
          </p>
          <button 
            onClick={handleOpenOnboard}
            className="btn-primary" 
            style={{ marginTop: '20px', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', border: 'none' }}
          >
            Add Supplier
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <SupplierGrid 
          suppliers={filteredSuppliers}
          onSelectSupplier={setSelectedSupplier}
        />
      ) : (
        <SupplierTable 
          suppliers={filteredSuppliers}
          onSelectSupplier={setSelectedSupplier}
          onRecordPayment={(sup) => {
            setSelectedSupplier(sup);
            setShowPaymentModal(true);
          }}
          onEditSupplier={handleOpenEdit}
          onDeleteSupplier={(sup) => {
            setSelectedSupplier(sup);
            setShowDeleteConfirm(true);
          }}
        />
      )}

      {/* SLIDE OVER RIGHT DETAIL DRAWER */}
      {selectedSupplier && (
        <SupplierDrawer 
          selectedSupplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onRecordPayment={(sup) => {
            setSelectedSupplier(sup);
            setShowPaymentModal(true);
          }}
          onEditSupplier={handleOpenEdit}
          onDeleteSupplier={(sup) => {
            setSelectedSupplier(sup);
            setShowDeleteConfirm(true);
          }}
        />
      )}

      {/* CREATION & ONBOARD WIZARD DIALOG MODAL */}
      {showFormModal && (
        <SupplierFormModal 
          editingSupplier={editingSupplier}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSaveSupplier}
        />
      )}

      {/* RECORD DEBT PAYMENT DIALOG MODAL */}
      {showPaymentModal && selectedSupplier && (
        <PaymentModal 
          selectedSupplier={selectedSupplier}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handleRecordPayment}
        />
      )}

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {showDeleteConfirm && selectedSupplier && (
        <DeleteConfirmModal 
          selectedSupplier={selectedSupplier}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteSupplier}
        />
      )}

      {/* CONFIGURE CARDS GLASSMORPHIC MODAL */}
      {showMetricsConfig && (
        <MetricsConfigModal 
          onClose={() => setShowMetricsConfig(false)}
          activeCardIds={activeCardIds}
          setActiveCardIds={setActiveCardIds}
        />
      )}

      {/* TOAST SYSTEM CONTAINER */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
