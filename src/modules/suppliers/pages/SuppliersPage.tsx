import { useEffect, useState } from 'react';
import { 
  Plus, Search, UserRound, Mail, Phone, MapPin, 
  Loader2, ExternalLink, TrendingUp, AlertCircle, Trash2, 
  Edit3, IndianRupee, CheckCircle2, X, Star, Calendar, 
  ShieldCheck, ArrowUpRight, ArrowDownLeft,
  LayoutGrid, Table, Download, Settings
} from 'lucide-react';
import { suppliersApi } from '../../../core/api/suppliers';

// Toggle this to true if you want to fall back to the live API endpoints.
// By default, we use local persistent storage to showcase high-fidelity interactions!
const USE_REAL_API = false;

interface LedgerEntry {
  id: string;
  date: string;
  type: 'invoice' | 'payment';
  label: string;
  amount: number;
  isCredit: boolean;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  currentBalance: number;
  type: string;
  rating: number;
  outstandingOrders: number;
  ledger: LedgerEntry[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

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

export const SuppliersPage = () => {
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

  // Form Inputs State
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState('OEM Manufacturer');
  const [formRating, setFormRating] = useState('4.5');
  const [formAddress, setFormAddress] = useState('');

  // Ledger Payment State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

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
        // LocalStorage logic
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update localStorage helper
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

  // Open onboard form
  const handleOpenOnboard = () => {
    setEditingSupplier(null);
    setFormName('');
    setFormContact('');
    setFormEmail('');
    setFormPhone('');
    setFormType('Manufacturer');
    setFormRating('4.5');
    setFormAddress('');
    setShowFormModal(true);
  };

  // Open edit form
  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormName(sup.name);
    setFormContact(sup.contactPerson);
    setFormEmail(sup.email);
    setFormPhone(sup.phone);
    setFormType(sup.type);
    setFormRating(sup.rating.toString());
    setFormAddress(sup.address);
    setShowFormModal(true);
  };

  // Save Supplier (Create or Edit)
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      addToast('error', 'Supplier Name is required');
      return;
    }

    const ratingNum = parseFloat(formRating) || 4.5;

    if (editingSupplier) {
      // Edit mode
      const updated = suppliers.map((s) => {
        if (s.id === editingSupplier.id) {
          return {
            ...s,
            name: formName,
            contactPerson: formContact,
            email: formEmail,
            phone: formPhone,
            type: formType,
            rating: Math.min(5, Math.max(1, ratingNum)),
            currentBalance: s.currentBalance, // calculated automatically/maintained
            address: formAddress,
            outstandingOrders: s.outstandingOrders, // calculated automatically/maintained
          };
        }
        return s;
      });

      updateCachedSuppliers(updated);
      
      // Update selectedSupplier if it was currently open
      if (selectedSupplier && selectedSupplier.id === editingSupplier.id) {
        const found = updated.find((x) => x.id === editingSupplier.id);
        if (found) setSelectedSupplier(found);
      }

      addToast('success', `Successfully updated supplier info for ${formName}`);
    } else {
      // Create mode
      const newId = `sup-${Math.random().toString(36).substring(2, 9)}`;
      const newSupplier: Supplier = {
        id: newId,
        name: formName,
        contactPerson: formContact,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        type: formType,
        rating: Math.min(5, Math.max(1, ratingNum)),
        currentBalance: 0, // system generated / defaults to 0 on add
        outstandingOrders: 0, // system generated / defaults to 0 on add
        ledger: []
      };

      updateCachedSuppliers([newSupplier, ...suppliers]);
      addToast('success', `Supplier ${formName} added successfully!`);
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
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    const amount = parseFloat(paymentAmount) || 0;
    if (amount <= 0) {
      addToast('error', 'Payment amount must be greater than ₹0.00');
      return;
    }

    if (amount > selectedSupplier.currentBalance) {
      addToast('warning', 'Processing surplus payment beyond current active liability');
    }

    const refCode = paymentRef.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry: LedgerEntry = {
      id: `l-pay-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      label: `Ledger Payment - Ref #${refCode}${paymentNotes ? ` (${paymentNotes})` : ''}`,
      amount,
      isCredit: false
    };

    const updated = suppliers.map((s) => {
      if (s.id === selectedSupplier.id) {
        return {
          ...s,
          currentBalance: Math.max(0, s.currentBalance - amount),
          ledger: [newEntry, ...s.ledger]
        };
      }
      return s;
    });

    updateCachedSuppliers(updated);
    
    // Update active drawer state
    const found = updated.find((x) => x.id === selectedSupplier.id);
    if (found) setSelectedSupplier(found);

    addToast('success', `Disbursed ₹${amount.toFixed(2)} to ${selectedSupplier.name}. Ref: ${refCode}`);
    
    // Reset payment states
    setPaymentAmount('');
    setPaymentRef('');
    setPaymentNotes('');
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
    // Search filter
    const matchesSearch = 
      sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Tabs filter
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

  const cardDefinitions = [
    {
      id: 'active_suppliers',
      label: 'Active Suppliers',
      value: metrics.totalCount,
      subtext: 'Onboarded partners',
      icon: UserRound,
      color: '#6366f1',
      className: 'blue'
    },
    {
      id: 'outstanding_payables',
      label: 'Outstanding Payables',
      value: `₹${metrics.totalLiability.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Pending payments',
      icon: IndianRupee,
      color: '#e11d48',
      className: 'red',
      valueColor: '#e11d48'
    },
    {
      id: 'active_purchase_orders',
      label: 'Active Purchase Orders',
      value: metrics.activeOrders,
      subtext: 'Active POs',
      icon: TrendingUp,
      color: '#059669',
      className: 'emerald'
    },
    {
      id: 'pending_deliveries',
      label: 'Pending Deliveries',
      value: metrics.pendingDeliveries,
      subtext: 'In transit',
      icon: Calendar,
      color: '#8b5cf6',
      className: 'purple',
      iconBg: '#f5f3ff'
    },
    {
      id: 'overdue_payments',
      label: 'Overdue Payments',
      value: `₹${metrics.overduePayments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Delayed ledger amount',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      iconBg: '#fff1f2',
      valueColor: '#dc2626'
    },
    {
      id: 'top_rated_suppliers',
      label: 'Top Rated Suppliers',
      value: metrics.eliteCount,
      subtext: 'Preferred Vendors',
      icon: Star,
      color: '#d97706',
      className: 'amber',
      isStar: true
    }
  ];

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* Dynamic Style Sheet Overrides & Keyframes */}
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        .stat-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
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
          font-size: 1.85rem;
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
          transition: all 0.3s ease;
        }
        .stat-card-icon-wrapper.blue {
          background: #f0f3ff;
          color: #6366f1;
        }
        .stat-card-icon-wrapper.red {
          background: #fef2f2;
          color: #e11d48;
        }
        .stat-card-icon-wrapper.amber {
          background: #fffbeb;
          color: #d97706;
        }
        .stat-card-icon-wrapper.emerald {
          background: #ecfdf5;
          color: #059669;
        }
        .supplier-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .supplier-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 26px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.015);
        }
        .supplier-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.35);
        }
        .supplier-card-premium::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: transparent;
          transition: background 0.3s ease;
        }
        .supplier-card-premium:hover::after {
          background: linear-gradient(90deg, #6366f1, #9333ea);
        }
        .type-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .type-oem { background: #eef2ff; color: #4f46e5; }
        .type-logistics { background: #fdf2f8; color: #db2777; }
        .type-other { background: #f8fafc; color: #475569; }
        
        .debt-pill-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .supplier-card-premium:hover .debt-pill-premium {
          background: #faf5ff;
          border-color: #f3e8ff;
        }
        .debt-value {
          font-size: 0.95rem;
          font-weight: 800;
        }
        .debt-value.positive { color: #e11d48; }
        .debt-value.neutral { color: #059669; }

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

        /* Premium Table Styles */
        .premium-table-container {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.015);
          margin-bottom: 32px;
          animation: fadeIn 0.4s ease;
          max-width: 1150px;
        }
        .premium-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .premium-table th {
          background: #f8fafc;
          padding: 18px 24px;
          color: #64748b;
          font-weight: 850;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1.5px solid #f1f5f9;
        }
        .premium-table td {
          padding: 16px 24px;
          border-bottom: 1.5px solid #f1f5f9;
          font-weight: 600;
          font-size: 0.88rem;
          color: #1e293b;
          transition: all 0.2s;
        }
        .premium-table tr:last-child td {
          border-bottom: none;
        }
        .premium-table tr:hover td {
          background: #f8fafc;
        }
        .table-action-btn {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          padding: 0;
        }
        .table-action-btn:hover {
          background: #6366f1;
          color: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.15);
        }

        /* Glassmorphic Modal */
        .premium-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: modalFadeIn 0.25s ease-out forwards;
        }
        .premium-modal-content {
          width: 90%;
          max-width: 580px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
        }
        .premium-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .premium-input-group label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .premium-field {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          outline: none;
          background: #f8fafc;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .premium-field:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        /* Slide-over Right Drawer */
        .right-drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.25);
          backdrop-filter: blur(4px);
          z-index: 9000;
          display: flex;
          justify-content: flex-end;
          animation: modalFadeIn 0.2s ease-out;
        }
        .right-drawer-container {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          height: 100%;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          position: relative;
          animation: drawerSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        /* Timelines */
        .ledger-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-left: 14px;
          border-left: 2px dashed #e2e8f0;
          margin-top: 10px;
        }
        .ledger-item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ledger-item::before {
          content: '';
          position: absolute;
          left: -22px;
          top: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px #cbd5e1;
        }
        .ledger-item.credit::before {
          background: #e11d48;
          box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
        }
        .ledger-item.debit::before {
          background: #059669;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
        }

        /* Toast Message Layout */
        .toasts-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 20000;
          pointer-events: none;
        }
        .toast-card {
          pointer-events: auto;
          background: #ffffff;
          border-radius: 16px;
          padding: 16px 20px;
          min-width: 320px;
          max-width: 420px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
          border: 1px solid #f1f5f9;
          animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
          position: relative;
          overflow: hidden;
        }
        .toast-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; height: 3px; width: 100%;
          animation: toastProgress 3.5s linear forwards;
        }
        .toast-card.success::after { background: #10b981; }
        .toast-card.warning::after { background: #f59e0b; }
        .toast-card.error::after { background: #ef4444; }
        .toast-card.info::after { background: #3b82f6; }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.035em', margin: 0 }}>Supplier Management</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontWeight: 600, fontSize: '0.94rem' }}>
            Track supplier performance, outstanding payments, and purchase activities.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleExportSuppliers}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              borderRadius: '14px', 
              padding: '12px 20px', 
              fontWeight: 850,
              cursor: 'pointer',
              border: '1.5px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.color = '#1e293b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <Download size={18} /> Export
          </button>

          <button 
            onClick={handleOpenOnboard}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              borderRadius: '14px', 
              padding: '12px 24px', 
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              background: 'var(--primary-glow)',
              color: 'white',
              boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.2)'
            }}
          >
            <Plus size={20} strokeWidth={2.5} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Configure Cards Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '12px' }}>
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
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
          }}
        >
          <Settings size={14} /> Configure Cards
        </button>
      </div>

      {/* 6 CORE ANALYTICS WIDGETS */}
      <div className="stats-grid">
        {cardDefinitions.filter(c => activeCardIds.includes(c.id)).map(card => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="stat-card-premium">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="stat-card-label">{card.label}</span>
                <span className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</span>
                <span className="stat-card-subtext">{card.subtext}</span>
              </div>
              <div 
                className={`stat-card-icon-wrapper ${card.className}`} 
                style={card.iconBg ? { background: card.iconBg, color: card.color } : {}}
              >
                <Icon size={20} fill={card.isStar ? card.color : 'none'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER BAR AND SMART SEARCH */}
      <div className="search-container" style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search suppliers, contacts, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 16px 10px 44px', 
                border: '1.5px solid #F1F5F9', 
                background: '#F8FAFC', 
                borderRadius: '12px', 
                fontWeight: 650, 
                fontSize: '0.85rem',
                outline: 'none', 
                boxSizing: 'border-box',
                transition: 'all 0.2s'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tab Controls */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '0px' }}>
            <button onClick={() => setActiveTab('all')} className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}>
              All Suppliers
            </button>
            <button onClick={() => setActiveTab('debt')} className={`filter-tab ${activeTab === 'debt' ? 'active' : ''}`}>
              Outstanding Payments
            </button>
            <button onClick={() => setActiveTab('elite')} className={`filter-tab ${activeTab === 'elite' ? 'active' : ''}`}>
              Top Rated
            </button>
            <button onClick={() => setActiveTab('oem')} className={`filter-tab ${activeTab === 'oem' ? 'active' : ''}`}>
              Manufacturers & Wholesalers
            </button>
            <button onClick={() => setActiveTab('logistics')} className={`filter-tab ${activeTab === 'logistics' ? 'active' : ''}`}>
              Logistics
            </button>
          </div>
        </div>

        {/* View Mode Toggle (Grid vs. Table) */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '2px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', border: 'none', borderRadius: '9px',
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? '#6366f1' : '#64748b',
              fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s',
              lineHeight: 1
            }}
          >
            <LayoutGrid size={14} /> Grid
          </button>
          <button 
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', border: 'none', borderRadius: '9px',
              background: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#6366f1' : '#64748b',
              fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
              boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s',
              lineHeight: 1
            }}
          >
            <Table size={14} /> Table
          </button>
        </div>
      </div>

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
        <div className="supplier-grid">
          {filteredSuppliers.map((sup) => {
            const isOem = ['OEM Manufacturer', 'Technology OEM', 'Raw Materials'].includes(sup.type);
            const isLogistics = ['Third-Party Logistics', 'Logistics Broker'].includes(sup.type);
            
            return (
              <div 
                key={sup.id} 
                className="supplier-card-premium"
                onClick={() => setSelectedSupplier(sup)}
              >
                {/* Header info in card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div style={{ 
                    height: '52px', 
                    width: '52px', 
                    background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#4F46E5', 
                    fontWeight: 900, 
                    fontSize: '1.35rem',
                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.05)'
                  }}>
                    {sup.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Category badge */}
                  <span className={`type-pill ${isOem ? 'type-oem' : isLogistics ? 'type-logistics' : 'type-other'}`}>
                    {sup.type}
                  </span>
                </div>

                {/* Vendor details */}
                <h3 style={{ fontWeight: 850, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{sup.name}</h3>
                
                {/* Rating display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#d97706', fontWeight: 700, marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '1px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={13} 
                        fill={i < Math.floor(sup.rating) ? '#f59e0b' : 'transparent'} 
                        color="#f59e0b" 
                      />
                    ))}
                  </div>
                  <span>{sup.rating.toFixed(1)}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>• {sup.outstandingOrders} Outstanding POs</span>
                </div>

                {/* Quick Info Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '18px', marginBottom: '22px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                     <UserRound size={16} color="#94a3b8" /> {sup.contactPerson}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                     <Mail size={16} color="#94a3b8" /> <span style={{ wordBreak: 'break-all' }}>{sup.email || 'N/A'}</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                     <MapPin size={16} color="#94a3b8" /> 
                     <span style={{ overflowX: 'auto', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       {sup.address || 'Global Sourcing'}
                     </span>
                   </div>
                </div>

                {/* Liability Card Segment */}
                <div className="debt-pill-premium">
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Outstanding Amount</span>
                     <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Pending Payment</span>
                   </div>
                   <div className={`debt-value ${sup.currentBalance > 0 ? 'positive' : 'neutral'}`}>
                     ₹{sup.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Supplier / Category</th>
                <th>Primary Contact</th>
                <th>Purchase Orders</th>
                <th style={{ textAlign: 'right' }}>Outstanding Amount</th>
                <th style={{ textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((sup) => {
                const initialLetter = sup.name.charAt(0).toUpperCase();
                const isDebtPositive = sup.currentBalance > 0;
                
                return (
                  <tr key={sup.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedSupplier(sup)}>
                    {/* 1. Vendor Node / Category */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          height: '38px', width: '38px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                          color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.94rem'
                        }}>
                          {initialLetter}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{sup.name}</span>
                          <span style={{
                            alignSelf: 'flex-start',
                            fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                            color: '#4f46e5', background: '#f0f3ff', padding: '2px 8px', borderRadius: '6px'
                          }}>
                            {sup.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Principal Contact */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{sup.contactPerson}</span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 550, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Mail size={12} color="#94a3b8" /> {sup.email}
                        </span>
                      </div>
                    </td>

                    {/* 3. Procurement Cycles */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 850, color: '#0f172a' }}>{sup.outstandingOrders}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Active POs</span>
                      </div>
                    </td>

                    {/* 4. Active Balance / Debt */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{
                          fontWeight: 900,
                          fontSize: '0.94rem',
                          color: isDebtPositive ? '#e11d48' : '#059669'
                        }}>
                          ₹{sup.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                          {isDebtPositive ? 'Outstanding' : 'Settled'}
                        </span>
                      </div>
                    </td>

                    {/* 5. Quick Actions */}
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedSupplier(sup);
                            setShowPaymentModal(true);
                          }}
                          className="table-action-btn"
                          title="Record Payment"
                          style={{ borderColor: isDebtPositive ? '#fecdd3' : '#e2e8f0', color: isDebtPositive ? '#e11d48' : '#64748b' }}
                        >
                          <IndianRupee size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSupplier(sup);
                            setShowFormModal(true);
                          }}
                          className="table-action-btn"
                          title="Edit Info"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSupplier(sup);
                            setShowDeleteConfirm(true);
                          }}
                          className="table-action-btn"
                          title="Terminate Account"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================= */}
      {/* SLIDE OVER RIGHT DETAIL DRAWER */}
      {/* ========================================= */}
      {selectedSupplier && (
        <div className="right-drawer-overlay" onClick={() => setSelectedSupplier(null)}>
          <div className="right-drawer-container" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ 
              padding: '24px 30px', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8fafc' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#6366f1" />
                <span style={{ fontWeight: 850, fontSize: '1rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supplier Profile</span>
              </div>
              <button 
                onClick={() => setSelectedSupplier(null)}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Content (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
              
              {/* Profile Card Header */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '28px' }}>
                <div style={{ 
                  height: '70px', width: '70px', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#ffffff', borderRadius: '22px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 900, fontSize: '1.8rem',
                  boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.4)'
                }}>
                  {selectedSupplier.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{selectedSupplier.name}</h2>
                  <span className="type-pill type-oem" style={{ marginTop: '6px' }}>{selectedSupplier.type}</span>
                </div>
              </div>

              {/* Rating & Action Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '32px' }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Supplier Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Star size={16} fill="#d97706" color="#d97706" /> {selectedSupplier.rating.toFixed(1)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Purchase Invoices</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                    {selectedSupplier.outstandingOrders} Active
                  </div>
                </div>
              </div>

              {/* Contact Information block */}
              <div style={{ marginBottom: '36px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  Administrative Directory
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <UserRound size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Principal Contact</div>
                      <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 650, marginTop: '2px' }}>{selectedSupplier.contactPerson}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Mail size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                      <a href={`mailto:${selectedSupplier.email}`} style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 650, marginTop: '2px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {selectedSupplier.email} <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Phone size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</div>
                      <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 650, marginTop: '2px' }}>{selectedSupplier.phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Address</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '2px', lineHeight: 1.4 }}>{selectedSupplier.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outstanding Debt & Payment box */}
              <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', padding: '20px', borderRadius: '20px', marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Outstanding</span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e11d48', margin: '2px 0 0 0' }}>
                        ₹{selectedSupplier.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    {selectedSupplier.currentBalance > 0 && (
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', fontWeight: 750, color: '#9f1239', marginTop: '4px' }}>
                        <span>Due in: 8 Days</span>
                      </div>
                    )}
                  </div>
                  {selectedSupplier.currentBalance > 0 && (
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      style={{ background: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)' }}
                    >
                      <IndianRupee size={14} /> Record Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Ledger ledger history timeline */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 18px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  Procurement Ledger Timeline
                </h4>
                
                {selectedSupplier.ledger.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No transaction history on ledger.</p>
                ) : (
                  <div className="ledger-timeline">
                    {selectedSupplier.ledger.map((item) => (
                      <div key={item.id} className={`ledger-item ${item.isCredit ? 'credit' : 'debit'}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 750, color: '#1e293b' }}>
                            {item.label}
                          </span>
                          <span style={{ 
                            fontSize: '0.82rem', 
                            fontWeight: 800, 
                            color: item.isCredit ? '#e11d48' : '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            {item.isCredit ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                            {item.isCredit ? '+' : '-'}₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                          <Calendar size={12} /> {item.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Drawer Actions */}
            <div style={{ 
              padding: '20px 30px', 
              borderTop: '1px solid #f1f5f9', 
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => handleOpenEdit(selectedSupplier)}
                style={{ 
                  flex: 1,
                  background: '#ffffff', 
                  color: '#475569', 
                  border: '1.5px solid #e2e8f0', 
                  padding: '12px 18px', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '0.88rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Edit3 size={16} /> Edit Supplier
              </button>
              
              <div style={{ position: 'relative', marginLeft: '12px' }}>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ 
                    background: '#ffffff', 
                    color: '#e11d48', 
                    border: '1.5px solid #fecdd3', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Delete Supplier"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* CREATION & ONBOARD WIZARD DIALOG MODAL */}
      {/* ========================================= */}
      {showFormModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ 
              padding: '24px 30px', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8fafc' 
            }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} style={{ padding: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Name & Contact */}
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Supplier Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Apex Core Corp"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="premium-field"
                    />
                  </div>
                  
                  <div className="premium-input-group">
                    <label>Primary Contact</label>
                    <input 
                      type="text" 
                      placeholder="Sarah Jenkins"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="premium-field"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="admin@corp.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="premium-field"
                    />
                  </div>
                  
                  <div className="premium-input-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+1 (555) 019-2834"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="premium-field"
                    />
                  </div>
                </div>

                {/* Type & Rating */}
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Supplier Type</label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="premium-field"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Wholesaler">Wholesaler</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Raw Materials">Raw Materials</option>
                    </select>
                  </div>
                  
                  <div className="premium-input-group">
                    <label>Supplier Rating (optional)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="4.5"
                      value={formRating}
                      onChange={(e) => setFormRating(e.target.value)}
                      className="premium-field"
                    />
                  </div>
                </div>

                {/* HQ Address */}
                <div className="premium-input-group">
                  <label>Business Address</label>
                  <textarea 
                    rows={2}
                    placeholder="1044 Industrial Parkway, Suite 7, Chicago, IL"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="premium-field"
                    style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  style={{ background: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ background: 'var(--primary-glow)', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* RECORD DEBT PAYMENT DIALOG MODAL */}
      {/* ========================================= */}
      {showPaymentModal && selectedSupplier && (
        <div className="premium-modal-overlay" style={{ zIndex: 11000 }}>
          <div className="premium-modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#fff1f2' 
            }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IndianRupee size={18} /> Record Ledger Payment
              </h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Info outstanding */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Outstanding Liability</div>
                  <div style={{ fontSize: '1.15rem', color: '#1e293b', fontWeight: 900, marginTop: '2px' }}>
                    ₹{selectedSupplier.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Amount input */}
                <div className="premium-input-group">
                  <label>Disbursement Amount (₹ INR) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="premium-field"
                  />
                </div>

                {/* Ref code input */}
                <div className="premium-input-group">
                  <label>Transaction Reference Check #</label>
                  <input 
                    type="text" 
                    placeholder="TXN-909283 (optional)"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="premium-field"
                  />
                </div>

                {/* Internal notes */}
                <div className="premium-input-group">
                  <label>Internal Ledger Memo</label>
                  <input 
                    type="text" 
                    placeholder="Bank wire transfer via JPMorgan (optional)"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="premium-field"
                  />
                </div>

              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{ background: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ background: '#e11d48', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)' }}
                >
                  Disburse Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {/* ========================================= */}
      {showDeleteConfirm && selectedSupplier && (
        <div className="premium-modal-overlay" style={{ zIndex: 11000 }}>
          <div className="premium-modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ padding: '30px' }}>
              <div style={{ 
                height: '56px', width: '56px', background: '#fff1f2', color: '#e11d48', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 18px'
              }}>
                <Trash2 size={28} />
              </div>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                Delete Supplier?
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 550, marginTop: '8px', lineHeight: 1.5 }}>
                You are about to remove <strong>{selectedSupplier.name}</strong> from the database. This action cannot be undone.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ flex: 1, background: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteSupplier}
                  style={{ flex: 1, background: '#e11d48', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)' }}
                >
                  Delete Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* CONFIGURE CARDS GLASSMORPHIC MODAL */}
      {/* ========================================= */}
      {showMetricsConfig && (
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
          <div style={{
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            background: '#ffffff',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            boxShadow: '0 30px 70px rgba(9, 14, 29, 0.12)',
            borderRadius: '24px',
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
              Configure Cards
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, margin: '0 0 20px 0' }}>
              Toggle visibility of operational metrics. Select exactly up to 4 active cards to show.
            </p>

            {/* Warning banner when limit is reached */}
            {activeCardIds.length >= 4 && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#b45309',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={14} color="#d97706" />
                <span>Limit Reached: Exactly 4 active cards are configured. Remove an active card to enable selecting others.</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {(() => {
                const isMaxReached = activeCardIds.length >= 4;
                return cardDefinitions.map(card => {
                  const isSelected = activeCardIds.includes(card.id);
                  const isDisabled = isMaxReached && !isSelected;
                  return (
                    <label 
                      key={card.id} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        border: isSelected ? '1.5px solid #cbd5e1' : '1.5px solid #f1f5f9',
                        borderRadius: '16px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.5 : 1,
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: `${card.color}10`, color: card.color, padding: '8px', borderRadius: '10px', display: 'flex' }}>
                          <card.icon size={16} fill={card.isStar ? card.color : 'none'} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b' }}>{card.label}</span>
                          <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 550 }}>{card.subtext}</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => {
                          if (isSelected) {
                            setActiveCardIds(activeCardIds.filter(id => id !== card.id));
                          } else {
                            setActiveCardIds([...activeCardIds, card.id]);
                          }
                        }}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#6366f1',
                          cursor: isDisabled ? 'not-allowed' : 'pointer'
                        }}
                      />
                    </label>
                  );
                });
              })()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowMetricsConfig(false)}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)'
                }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TOAST SYSTEM CONTAINER */}
      {/* ========================================= */}
      <div className="toasts-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card ${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={20} color="#10b981" />}
            {t.type === 'warning' && <AlertCircle size={20} color="#f59e0b" />}
            {t.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
            {t.type === 'info' && <ShieldCheck size={20} color="#3b82f6" />}
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', flex: 1 }}>{t.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

