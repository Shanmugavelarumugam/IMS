import React, { useEffect, useState } from 'react';
import { UserRound, IndianRupee, CreditCard, AlertCircle, Loader2, Settings } from 'lucide-react';

// Subcomponents imports
import { CustomersHeader } from '../components/CustomersHeader';
import { StatsGrid } from '../components/StatsGrid';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { CustomerGrid } from '../components/CustomerGrid';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerDrawer } from '../components/CustomerDrawer';
import { CustomerFormModal } from '../components/CustomerFormModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ToastContainer } from '../components/ToastContainer';
import { MetricsConfigModal } from '../components/MetricsConfigModal';

// Style imports
import '../styles/customers.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

interface LedgerEntry {
  id: string;
  date: string;
  type: 'invoice' | 'receipt';
  label: string;
  amount: number;
  isCredit: boolean; // true = invoice (adds to balance), false = receipt (payment received, subtracts)
}

interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  currentBalance: number; // outstanding receivables
  creditLimit: number;
  type: 'Distributor' | 'Wholesaler' | 'Retail Partner' | 'Key Account';
  rating: number;
  totalOrders: number;
  lastOrderDate: string;
  ledger: LedgerEntry[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Reliance Retail Ventures',
    contactPerson: 'Karan Adani',
    email: 'k.adani@relianceretail.in',
    phone: '+91 22 2278 5000',
    address: 'Maker Chambers IV, 222 Nariman Point, Mumbai, MH',
    currentBalance: 125000.0,
    creditLimit: 500000.0,
    type: 'Key Account',
    rating: 4.9,
    lastOrderDate: '2023-11-20',
    totalOrders: 14,
    ledger: [
      {
        id: 'cl-1-1',
        date: '2026-05-02',
        type: 'invoice',
        label: 'Sales Invoice #SI-4091',
        amount: 85000.0,
        isCredit: true,
      },
      {
        id: 'cl-1-2',
        date: '2026-05-08',
        type: 'receipt',
        label: 'Receipt Received - NEFT #TXN-7012',
        amount: 50000.0,
        isCredit: false,
      },
      {
        id: 'cl-1-3',
        date: '2026-05-14',
        type: 'invoice',
        label: 'Sales Invoice #SI-4210',
        amount: 90000.0,
        isCredit: true,
      },
    ],
  },
  {
    id: 'cust-2',
    name: 'Apex Distributors Delhi',
    contactPerson: 'Amit Sharma',
    email: 'a.sharma@apexdelhi.com',
    phone: '+91 11 4150 9021',
    address: '44-45 Nehru Place, Ground Floor, New Delhi, DL',
    currentBalance: 245000.0,
    creditLimit: 300000.0,
    type: 'Distributor',
    rating: 4.7,
    lastOrderDate: '2023-11-25',
    totalOrders: 28,
    ledger: [
      {
        id: 'cl-2-1',
        date: '2026-04-20',
        type: 'invoice',
        label: 'Sales Invoice #SI-3891',
        amount: 200000.0,
        isCredit: true,
      },
      {
        id: 'cl-2-2',
        date: '2026-04-28',
        type: 'receipt',
        label: 'Receipt Received - RTGS #TXN-6819',
        amount: 100000.0,
        isCredit: false,
      },
      {
        id: 'cl-2-3',
        date: '2026-05-10',
        type: 'invoice',
        label: 'Sales Invoice #SI-4188',
        amount: 145000.0,
        isCredit: true,
      },
    ],
  },
  {
    id: 'cust-3',
    name: 'Star Supermarkets Group',
    contactPerson: 'Priyah Patel',
    email: 'purchasing@starsupermarkets.co.in',
    phone: '+91 80 4012 3456',
    address: '104 Brigade Road, Haridevpur, Bengaluru, KA',
    currentBalance: 0.0,
    creditLimit: 200000.0,
    type: 'Retail Partner',
    rating: 4.5,
    lastOrderDate: '2023-11-10',
    totalOrders: 9,
    ledger: [
      {
        id: 'cl-3-1',
        date: '2026-04-10',
        type: 'invoice',
        label: 'Sales Invoice #SI-3721',
        amount: 35000.0,
        isCredit: true,
      },
      {
        id: 'cl-3-2',
        date: '2026-04-18',
        type: 'receipt',
        label: 'Receipt Received - UPI Ref #9921',
        amount: 35000.0,
        isCredit: false,
      },
    ],
  },
  {
    id: 'cust-4',
    name: 'Vedic Organic Foods',
    contactPerson: 'Dr. Rahul Verma',
    email: 'verma@vedicfoods.org',
    phone: '+91 79 2630 1144',
    address: 'Aura Heights, CG Road, Ahmedabad, GJ',
    currentBalance: 88500.0,
    creditLimit: 150000.0,
    type: 'Wholesaler',
    rating: 4.8,
    lastOrderDate: '2023-11-15',
    totalOrders: 19,
    ledger: [
      {
        id: 'cl-4-1',
        date: '2026-05-01',
        type: 'invoice',
        label: 'Sales Invoice #SI-4022',
        amount: 58500.0,
        isCredit: true,
      },
      {
        id: 'cl-4-2',
        date: '2026-05-12',
        type: 'invoice',
        label: 'Sales Invoice #SI-4199',
        amount: 30000.0,
        isCredit: true,
      },
    ],
  },
  {
    id: 'cust-5',
    name: 'HyperCity Retail India',
    contactPerson: 'Nisha Sundaram',
    email: 'n.sundaram@hypercity.com',
    phone: '+91 44 2815 4488',
    address: '33 Anna Salai, Teynampet, Chennai, TN',
    currentBalance: 12000.0,
    creditLimit: 250000.0,
    type: 'Key Account',
    rating: 4.6,
    lastOrderDate: '2023-11-18',
    totalOrders: 11,
    ledger: [
      {
        id: 'cl-5-1',
        date: '2026-05-05',
        type: 'invoice',
        label: 'Sales Invoice #SI-4102',
        amount: 12000.0,
        isCredit: true,
      },
    ],
  },
];

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeCardIds, setActiveCardIds] = useState<string[]>([
    'total_clients',
    'total_receivables',
    'total_credit_capacity',
    'active_overdue',
  ]);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'distributor' | 'key' | 'retail'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Custom Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Drawer / Selection State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modal toggles
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form Inputs State
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<
    'Distributor' | 'Wholesaler' | 'Retail Partner' | 'Key Account'
  >('Wholesaler');
  const [formRating, setFormRating] = useState('4.5');
  const [formLimit, setFormLimit] = useState('200000');
  const [formAddress, setFormAddress] = useState('');

  // Ledger Receipt State
  const [receiptAmount, setReceiptAmount] = useState('');
  const [receiptRef, setReceiptRef] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');

  // Add Toast Notification
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Load Customers
  const loadCustomers = async () => {
    try {
      setLoading(true);

      const cached = localStorage.getItem('ims_dummy_customers');
      if (cached) {
        setCustomers(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_customers', JSON.stringify(DEFAULT_CUSTOMERS));
        setCustomers(DEFAULT_CUSTOMERS);
      }
    } catch {
      addToast('error', 'Connection to client database failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Cache
  const updateCachedCustomers = (updatedList: Customer[]) => {
    setCustomers(updatedList);
    localStorage.setItem('ims_dummy_customers', JSON.stringify(updatedList));
  };

  // Export customers to CSV
  const handleExportCustomers = () => {
    try {
      const headers = [
        'Customer Name',
        'Client Category',
        'Primary Contact',
        'Email Address',
        'Phone Number',
        'Billing Address',
        'Outstanding Receivable',
        'Credit Limit',
        'Sales Orders',
        'Rating',
      ];

      const csvRows = filteredCustomers.map((cust) => [
        `"${cust.name.replace(/"/g, '""')}"`,
        `"${cust.type.replace(/"/g, '""')}"`,
        `"${cust.contactPerson.replace(/"/g, '""')}"`,
        `"${cust.email.replace(/"/g, '""')}"`,
        `"${cust.phone.replace(/"/g, '""')}"`,
        `"${cust.address.replace(/"/g, '""')}"`,
        cust.currentBalance,
        cust.creditLimit,
        cust.totalOrders,
        cust.rating.toFixed(1),
      ]);

      const csvContent = [headers.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `Client_Directory_Report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('success', 'Customer database exported successfully as CSV!');
    } catch {
      addToast('error', 'Failed to export client data.');
    }
  };

  // Open onboard form
  const handleOpenOnboard = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormContact('');
    setFormEmail('');
    setFormPhone('');
    setFormType('Wholesaler');
    setFormRating('4.5');
    setFormLimit('200000');
    setFormAddress('');
    setShowFormModal(true);
  };

  // Open edit form
  const handleOpenEdit = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormContact(cust.contactPerson);
    setFormEmail(cust.email);
    setFormPhone(cust.phone);
    setFormType(cust.type);
    setFormRating(cust.rating.toString());
    setFormLimit(cust.creditLimit.toString());
    setFormAddress(cust.address);
    setShowFormModal(true);
  };

  // Save Customer (Create or Edit)
  const handleSaveCustomer = (e: React.FormEvent, fullCustomerData?: any) => {
    e.preventDefault();

    const nameToUse = fullCustomerData ? fullCustomerData.name : formName;
    if (!nameToUse.trim()) {
      addToast('error', 'Customer Name is required');
      return;
    }

    const ratingNum = fullCustomerData ? (parseFloat(fullCustomerData.rating) || 4.5) : (parseFloat(formRating) || 4.5);
    const limitNum = fullCustomerData ? (parseFloat(fullCustomerData.creditLimit) || 200000) : (parseFloat(formLimit) || 200000);

    if (editingCustomer) {
      // Edit mode
      const updated = customers.map((c) => {
        if (c.id === editingCustomer.id) {
          return {
            ...c,
            name: nameToUse,
            contactPerson: fullCustomerData ? fullCustomerData.contactPerson : formContact,
            email: fullCustomerData ? fullCustomerData.email : formEmail,
            phone: fullCustomerData ? fullCustomerData.phone : formPhone,
            type: fullCustomerData ? fullCustomerData.type : formType,
            rating: Math.min(5, Math.max(1, ratingNum)),
            creditLimit: limitNum,
            address: fullCustomerData ? fullCustomerData.address : formAddress,
            ...(fullCustomerData || {})
          };
        }
        return c;
      });

      updateCachedCustomers(updated);

      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        const found = updated.find((x) => x.id === editingCustomer.id);
        if (found) setSelectedCustomer(found);
      }

      addToast('success', `Successfully updated profile info for ${nameToUse}`);
    } else {
      // Create mode
      const newId = `cust-${Math.random().toString(36).substring(2, 9)}`;
      const newCustomer: Customer = {
        id: newId,
        name: nameToUse,
        contactPerson: fullCustomerData ? fullCustomerData.contactPerson : formContact,
        email: fullCustomerData ? fullCustomerData.email : formEmail,
        phone: fullCustomerData ? fullCustomerData.phone : formPhone,
        address: fullCustomerData ? fullCustomerData.address : formAddress,
        type: fullCustomerData ? fullCustomerData.type : formType,
        rating: Math.min(5, Math.max(1, ratingNum)),
        lastOrderDate: new Date().toISOString().split('T')[0],
        creditLimit: limitNum,
        currentBalance: 0,
        totalOrders: 0,
        ledger: [],
        ...(fullCustomerData || {})
      };

      updateCachedCustomers([newCustomer, ...customers]);
      addToast('success', `Customer ${nameToUse} added successfully!`);
    }

    setShowFormModal(false);
  };

  // Delete Customer
  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    const name = selectedCustomer.name;
    const updated = customers.filter((c) => c.id !== selectedCustomer.id);
    updateCachedCustomers(updated);
    addToast('warning', `Removed ${name} from active client directory`);
    setSelectedCustomer(null);
    setShowDeleteConfirm(false);
  };

  // Submit Receipt Record (Receiving cash/bank payment)
  const handleRecordReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const amount = parseFloat(receiptAmount) || 0;
    if (amount <= 0) {
      addToast('error', 'Receipt amount must be greater than ₹0.00');
      return;
    }

    if (amount > selectedCustomer.currentBalance) {
      addToast('warning', 'Recording payment surplus beyond active liability.');
    }

    const refCode = receiptRef.trim() || `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry: LedgerEntry = {
      id: `l-rec-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'receipt',
      label: `Receipt Received - Ref #${refCode}${receiptNotes ? ` (${receiptNotes})` : ''}`,
      amount,
      isCredit: false,
    };

    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          currentBalance: Math.max(0, c.currentBalance - amount),
          ledger: [newEntry, ...c.ledger],
        };
      }
      return c;
    });

    updateCachedCustomers(updated);

    // Update active drawer state
    const found = updated.find((x) => x.id === selectedCustomer.id);
    if (found) setSelectedCustomer(found);

    addToast(
      'success',
      `Recorded receipt of ₹${amount.toFixed(2)} from ${selectedCustomer.name}. Ref: ${refCode}`
    );

    setReceiptAmount('');
    setReceiptRef('');
    setReceiptNotes('');
    setShowReceiptModal(false);
  };

  // Calculate metrics dynamically
  const metrics = {
    totalCount: customers.length,
    totalReceivables: customers.reduce((sum, c) => sum + c.currentBalance, 0),
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    totalLimit: customers.reduce((sum, c) => sum + c.creditLimit, 0),
    overdueCount: customers.filter((c) => c.currentBalance > c.creditLimit * 0.7).length,
    eliteCount: customers.filter((c) => c.rating >= 4.7).length,
  };

  // Filter & Search Logic
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'credit') return cust.currentBalance > 0;
    if (activeTab === 'distributor') return cust.type === 'Distributor';
    if (activeTab === 'key') return cust.type === 'Key Account';
    if (activeTab === 'retail') return cust.type === 'Retail Partner';

    return true;
  });

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          gap: '16px',
        }}
      >
        <Loader2
          className="spin"
          color="var(--primary-glow)"
          size={42}
          style={{ animation: 'spin 1.2s linear infinite' }}
        />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 650, fontSize: '0.9rem' }}>
          Initializing Client Relationship Module...
        </p>
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
      id: 'total_clients',
      label: 'Active Customers',
      value: metrics.totalCount,
      subtext: 'Registered customer accounts',
      icon: UserRound,
      color: '#6366f1',
      className: 'blue',
    },
    {
      id: 'total_receivables',
      label: 'Outstanding Receivables',
      value: `₹${metrics.totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Pending customer payments',
      icon: IndianRupee,
      color: '#059669',
      className: 'emerald',
      valueColor: '#059669',
    },
    {
      id: 'total_credit_capacity',
      label: 'Total Credit Limits',
      value: `₹${metrics.totalLimit.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
      subtext: 'Assigned customer credit',
      icon: CreditCard,
      color: '#8b5cf6',
      className: 'purple',
    },
    {
      id: 'active_overdue',
      label: 'High Risk Accounts',
      value: metrics.overdueCount,
      subtext: 'Accounts above 70% credit usage',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      valueColor: '#dc2626',
    },
  ];

  const formatRelativeDate = (dateStr: string) => {
    if (!dateStr) return 'No Orders';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const formatted = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);

    if (diffDays === 0) return `${formatted} (Today)`;
    if (diffDays === 1) return `${formatted} (Yesterday)`;
    if (diffDays < 30) return `${formatted} (${diffDays} days ago)`;
    if (diffDays < 60) return `${formatted} (1 month ago)`;
    return formatted;
  };

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* HEADER SECTION */}
      <CustomersHeader
        handleExportCustomers={handleExportCustomers}
        handleOpenOnboard={handleOpenOnboard}
      />

      {/* Configure Cards Control Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          marginTop: '12px',
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
            transition: 'all 0.2s',
          }}
          className="action-tab-pill"
        >
          <Settings size={14} /> Configure Cards
        </button>
      </div>

      {/* KPI Cards Panel */}
      <StatsGrid
        cardDefinitions={cardDefinitions}
        activeCardIds={activeCardIds}
      />

      {/* FILTER BAR AND SMART SEARCH */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Customers List / Table rendering */}
      {filteredCustomers.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #f1f5f9',
            color: '#64748b',
          }}
        >
          <AlertCircle size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>
            No Client Node Matches Found
          </h3>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
            Try clearing your search query or adjusting your filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <CustomerGrid
          filteredCustomers={filteredCustomers}
          formatRelativeDate={formatRelativeDate}
          setSelectedCustomer={setSelectedCustomer}
          handleOpenEdit={handleOpenEdit}
        />
      ) : (
        <CustomerTable
          filteredCustomers={filteredCustomers}
          formatRelativeDate={formatRelativeDate}
          setSelectedCustomer={setSelectedCustomer}
          handleOpenEdit={handleOpenEdit}
        />
      )}

      {/* SLIDE OVER RIGHT DETAIL DRAWER */}
      <CustomerDrawer
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        handleOpenEdit={handleOpenEdit}
        setShowDeleteConfirm={setShowDeleteConfirm}
        setShowReceiptModal={setShowReceiptModal}
      />

      {/* MODAL 1 - ONBOARD / EDIT CUSTOMER PROFILE */}
      <CustomerFormModal
        showFormModal={showFormModal}
        setShowFormModal={setShowFormModal}
        editingCustomer={editingCustomer}
        formName={formName}
        setFormName={setFormName}
        formContact={formContact}
        setFormContact={setFormContact}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formPhone={formPhone}
        setFormPhone={setFormPhone}
        formType={formType}
        setFormType={setFormType}
        formLimit={formLimit}
        setFormLimit={setFormLimit}
        formRating={formRating}
        setFormRating={setFormRating}
        formAddress={formAddress}
        setFormAddress={setFormAddress}
        handleSaveCustomer={handleSaveCustomer}
      />

      {/* MODAL 2 - RECORD CUSTOMER RECEIPT PAYMENT */}
      <ReceiptModal
        showReceiptModal={showReceiptModal}
        setShowReceiptModal={setShowReceiptModal}
        selectedCustomer={selectedCustomer}
        receiptAmount={receiptAmount}
        setReceiptAmount={setReceiptAmount}
        receiptRef={receiptRef}
        setReceiptRef={setReceiptRef}
        receiptNotes={receiptNotes}
        setReceiptNotes={setReceiptNotes}
        handleRecordReceipt={handleRecordReceipt}
      />

      {/* CONFIRMATION DIALOG - REMOVE CUSTOMER */}
      <DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        selectedCustomer={selectedCustomer}
        handleDeleteCustomer={handleDeleteCustomer}
      />

      {/* Dynamic Toast Container */}
      <ToastContainer toasts={toasts} />

      {/* Configure Cards Modal */}
      <MetricsConfigModal
        showMetricsConfig={showMetricsConfig}
        setShowMetricsConfig={setShowMetricsConfig}
        cardDefinitions={cardDefinitions}
        activeCardIds={activeCardIds}
        setActiveCardIds={setActiveCardIds}
      />
    </div>
  );
};
