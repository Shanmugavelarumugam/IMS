import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, UserRound, Mail, Phone, MapPin, 
  Loader2, AlertCircle, Trash2, ExternalLink,
  Edit3, IndianRupee, CheckCircle2, X, Star, Calendar, 
  LayoutGrid, Table, Download, CreditCard, Settings,
  ShieldCheck, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

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
    currentBalance: 125000.00,
    creditLimit: 500000.00,
    type: 'Key Account',
    rating: 4.9,
    lastOrderDate: '2023-11-20',
    totalOrders: 14,
    ledger: [
      { id: 'cl-1-1', date: '2026-05-02', type: 'invoice', label: 'Sales Invoice #SI-4091', amount: 85000.00, isCredit: true },
      { id: 'cl-1-2', date: '2026-05-08', type: 'receipt', label: 'Receipt Received - NEFT #TXN-7012', amount: 50000.00, isCredit: false },
      { id: 'cl-1-3', date: '2026-05-14', type: 'invoice', label: 'Sales Invoice #SI-4210', amount: 90000.00, isCredit: true }
    ]
  },
  {
    id: 'cust-2',
    name: 'Apex Distributors Delhi',
    contactPerson: 'Amit Sharma',
    email: 'a.sharma@apexdelhi.com',
    phone: '+91 11 4150 9021',
    address: '44-45 Nehru Place, Ground Floor, New Delhi, DL',
    currentBalance: 245000.00,
    creditLimit: 300000.00,
    type: 'Distributor',
    rating: 4.7,
    lastOrderDate: '2023-11-25',
    totalOrders: 28,
    ledger: [
      { id: 'cl-2-1', date: '2026-04-20', type: 'invoice', label: 'Sales Invoice #SI-3891', amount: 200000.00, isCredit: true },
      { id: 'cl-2-2', date: '2026-04-28', type: 'receipt', label: 'Receipt Received - RTGS #TXN-6819', amount: 100000.00, isCredit: false },
      { id: 'cl-2-3', date: '2026-05-10', type: 'invoice', label: 'Sales Invoice #SI-4188', amount: 145000.00, isCredit: true }
    ]
  },
  {
    id: 'cust-3',
    name: 'Star Supermarkets Group',
    contactPerson: 'Priyah Patel',
    email: 'purchasing@starsupermarkets.co.in',
    phone: '+91 80 4012 3456',
    address: '104 Brigade Road, Haridevpur, Bengaluru, KA',
    currentBalance: 0.00,
    creditLimit: 200000.00,
    type: 'Retail Partner',
    rating: 4.5,
    lastOrderDate: '2023-11-10',
    totalOrders: 9,
    ledger: [
      { id: 'cl-3-1', date: '2026-04-10', type: 'invoice', label: 'Sales Invoice #SI-3721', amount: 35000.00, isCredit: true },
      { id: 'cl-3-2', date: '2026-04-18', type: 'receipt', label: 'Receipt Received - UPI Ref #9921', amount: 35000.00, isCredit: false }
    ]
  },
  {
    id: 'cust-4',
    name: 'Vedic Organic Foods',
    contactPerson: 'Dr. Rahul Verma',
    email: 'verma@vedicfoods.org',
    phone: '+91 79 2630 1144',
    address: 'Aura Heights, CG Road, Ahmedabad, GJ',
    currentBalance: 88500.00,
    creditLimit: 150000.00,
    type: 'Wholesaler',
    rating: 4.8,
    lastOrderDate: '2023-11-15',
    totalOrders: 19,
    ledger: [
      { id: 'cl-4-1', date: '2026-05-01', type: 'invoice', label: 'Sales Invoice #SI-4022', amount: 58500.00, isCredit: true },
      { id: 'cl-4-2', date: '2026-05-12', type: 'invoice', label: 'Sales Invoice #SI-4199', amount: 30000.00, isCredit: true }
    ]
  },
  {
    id: 'cust-5',
    name: 'HyperCity Retail India',
    contactPerson: 'Nisha Sundaram',
    email: 'n.sundaram@hypercity.com',
    phone: '+91 44 2815 4488',
    address: '33 Anna Salai, Teynampet, Chennai, TN',
    currentBalance: 12000.00,
    creditLimit: 250000.00,
    type: 'Key Account',
    rating: 4.6,
    lastOrderDate: '2023-11-18',
    totalOrders: 11,
    ledger: [
      { id: 'cl-5-1', date: '2026-05-05', type: 'invoice', label: 'Sales Invoice #SI-4102', amount: 12000.00, isCredit: true }
    ]
  }
];

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeCardIds, setActiveCardIds] = useState<string[]>(['total_clients', 'total_receivables', 'total_credit_capacity', 'active_overdue']);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'distributor' | 'key' | 'retail'>('all');
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
  const [formType, setFormType] = useState<'Distributor' | 'Wholesaler' | 'Retail Partner' | 'Key Account'>('Wholesaler');
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
      const headers = ['Customer Name', 'Client Category', 'Primary Contact', 'Email Address', 'Phone Number', 'Billing Address', 'Outstanding Receivable', 'Credit Limit', 'Sales Orders', 'Rating'];
      
      const csvRows = filteredCustomers.map(cust => [
        `"${cust.name.replace(/"/g, '""')}"`,
        `"${cust.type.replace(/"/g, '""')}"`,
        `"${cust.contactPerson.replace(/"/g, '""')}"`,
        `"${cust.email.replace(/"/g, '""')}"`,
        `"${cust.phone.replace(/"/g, '""')}"`,
        `"${cust.address.replace(/"/g, '""')}"`,
        cust.currentBalance,
        cust.creditLimit,
        cust.totalOrders,
        cust.rating.toFixed(1)
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Client_Directory_Report_${new Date().toISOString().slice(0, 10)}.csv`);
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
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      addToast('error', 'Customer Name is required');
      return;
    }

    const ratingNum = parseFloat(formRating) || 4.5;
    const limitNum = parseFloat(formLimit) || 200000;

    if (editingCustomer) {
      // Edit mode
      const updated = customers.map((c) => {
        if (c.id === editingCustomer.id) {
          return {
            ...c,
            name: formName,
            contactPerson: formContact,
            email: formEmail,
            phone: formPhone,
            type: formType,
            rating: Math.min(5, Math.max(1, ratingNum)),
            creditLimit: limitNum,
            address: formAddress
          };
        }
        return c;
      });

      updateCachedCustomers(updated);
      
      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        const found = updated.find((x) => x.id === editingCustomer.id);
        if (found) setSelectedCustomer(found);
      }

      addToast('success', `Successfully updated profile info for ${formName}`);
    } else {
      // Create mode
      const newId = `cust-${Math.random().toString(36).substring(2, 9)}`;
      const newCustomer: Customer = {
        id: newId,
        name: formName,
        contactPerson: formContact,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        type: formType,
        rating: Math.min(5, Math.max(1, ratingNum)),
        lastOrderDate: new Date().toISOString().split('T')[0],
        creditLimit: limitNum,
        currentBalance: 0,
        totalOrders: 0,
        ledger: []
      };

      updateCachedCustomers([newCustomer, ...customers]);
      addToast('success', `Customer ${formName} added successfully!`);
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
      isCredit: false
    };

    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          currentBalance: Math.max(0, c.currentBalance - amount),
          ledger: [newEntry, ...c.ledger]
        };
      }
      return c;
    });

    updateCachedCustomers(updated);
    
    // Update active drawer state
    const found = updated.find((x) => x.id === selectedCustomer.id);
    if (found) setSelectedCustomer(found);

    addToast('success', `Recorded receipt of ₹${amount.toFixed(2)} from ${selectedCustomer.name}. Ref: ${refCode}`);
    
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
        <Loader2 className="spin" color="var(--primary-glow)" size={42} style={{ animation: 'spin 1.2s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 650, fontSize: '0.9rem' }}>Initializing Client Relationship Module...</p>
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
      className: 'blue'
    },
    {
      id: 'total_receivables',
      label: 'Outstanding Receivables',
      value: `₹${metrics.totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Pending customer payments',
      icon: IndianRupee,
      color: '#059669',
      className: 'emerald',
      valueColor: '#059669'
    },
    {
      id: 'total_credit_capacity',
      label: 'Total Credit Limits',
      value: `₹${metrics.totalLimit.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
      subtext: 'Assigned customer credit',
      icon: CreditCard,
      color: '#8b5cf6',
      className: 'purple'
    },
    {
      id: 'active_overdue',
      label: 'High Risk Accounts',
      value: metrics.overdueCount,
      subtext: 'Accounts above 70% credit usage',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      valueColor: '#dc2626'
    }
  ];

  const formatRelativeDate = (dateStr: string) => {
    if (!dateStr) return 'No Orders';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const formatted = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    
    if (diffDays === 0) return `${formatted} (Today)`;
    if (diffDays === 1) return `${formatted} (Yesterday)`;
    if (diffDays < 30) return `${formatted} (${diffDays} days ago)`;
    if (diffDays < 60) return `${formatted} (1 month ago)`;
    return formatted;
  };

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* Premium Styling CSS Blocks */}
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
          font-size: 2.2rem;
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
        .stat-card-icon-wrapper.rose { background: #fff1f2; color: #dc2626; }

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

        .customer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .customer-card-premium {
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
        .customer-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.35);
        }
        .customer-card-premium::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: transparent;
          transition: background 0.3s ease;
        }
        .customer-card-premium:hover::after {
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
        .type-key { background: #eef2ff; color: #4f46e5; }
        .type-distributor { background: #fdf2f8; color: #db2777; }
        .type-wholesaler { background: #f0fdf4; color: #15803d; }
        .type-retail { background: #f8fafc; color: #475569; }

        .receivable-pill-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .customer-card-premium:hover .receivable-pill-premium {
          background: #f5fdf8;
          border-color: #dcfce7;
        }
        .receivable-value { font-size: 0.95rem; font-weight: 850; }
        .receivable-value.positive { color: #b91c1c; }
        .receivable-value.neutral { color: #16a34a; }

        /* Premium Table Styles */
        .premium-table-container {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.015);
          margin-top: 24px;
          max-width: 100%;
        }
        .premium-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          position: relative;
        }
        .premium-table th {
          background: rgba(248, 250, 252, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 10;
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
          transition: background 0.2s;
        }
        .premium-table tr:nth-child(even) td { background: #fafbff; }
        .premium-table tr:hover td { background: #f4f6ff; }
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
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #ffffff;
          border-color: #6d28d9;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
          transform: translateY(-2px);
        }

        /* Modals and Overlays */
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
          margin-bottom: 14px;
        }
        .premium-input-group label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .premium-input {
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }
        .premium-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* Sidebar/Drawer Detail View */
        .drawer-overlay {
          position: fixed;
          top: 0; right: 0; bottom: 0; left: 0;
          background: rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.3s ease;
        }
        .drawer-content {
          width: 100%;
          max-width: 460px;
          background: #ffffff;
          height: 100%;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border-left: 1px solid #f1f5f9;
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .ledger-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
          overflow-y: auto;
          flex: 1;
          padding-right: 4px;
        }
        .ledger-card {
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ledger-card.invoice { border-left: 4px solid #ef4444; }
        .ledger-card.receipt { border-left: 4px solid #10b981; }

        /* Custom Toast CSS */
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 99999;
        }
        .custom-toast {
          padding: 14px 20px;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          animation: toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-success { background: #10b981; }
        .toast-info { background: #3b82f6; }
        .toast-warning { background: #f59e0b; }
        .toast-error { background: #ef4444; }

        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.035em', margin: 0 }}>Customer Management</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontWeight: 600, fontSize: '0.94rem' }}>
            Track customer accounts, receivables, credit limits, and payment history.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleExportCustomers}
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
            <Plus size={20} strokeWidth={2.5} /> Add Customer
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

      {/* KPI Cards Panel */}
      <div className="stats-grid">
        {cardDefinitions.filter(c => activeCardIds.includes(c.id)).map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{card.label}</div>
                <div className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</div>
                <div className="stat-card-subtext">{card.subtext}</div>
              </div>
              <div className={`stat-card-icon-wrapper ${card.className}`}>
                <Icon size={20} strokeWidth={2.4} />
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
              placeholder="Search customers by name, contact, or category..."
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
              All Accounts
            </button>
            <button onClick={() => setActiveTab('credit')} className={`filter-tab ${activeTab === 'credit' ? 'active' : ''}`}>
              Pending Payments
            </button>
            <button onClick={() => setActiveTab('key')} className={`filter-tab ${activeTab === 'key' ? 'active' : ''}`}>
              Key Customers
            </button>
            <button onClick={() => setActiveTab('distributor')} className={`filter-tab ${activeTab === 'distributor' ? 'active' : ''}`}>
              Distributors
            </button>
            <button onClick={() => setActiveTab('retail')} className={`filter-tab ${activeTab === 'retail' ? 'active' : ''}`}>
              Retail
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

      {/* Main Customers List / Table rendering */}
      {filteredCustomers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid #f1f5f9', color: '#64748b' }}>
          <AlertCircle size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>No Client Node Matches Found</h3>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Try clearing your search query or adjusting your filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="customer-grid">
          {filteredCustomers.map((cust) => {
            const utilizationRatio = cust.creditLimit > 0 ? (cust.currentBalance / cust.creditLimit) * 100 : 0;
            const isHighRisk = utilizationRatio > 70;
            return (
              <div 
                key={cust.id} 
                className="customer-card-premium"
                onClick={() => setSelectedCustomer(cust)}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 850, color: '#0f172a', margin: '0 0 4px' }}>{cust.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 650 }}>
                      <span className={`type-pill ${cust.type === 'Key Account' ? 'type-key' : cust.type === 'Distributor' ? 'type-distributor' : cust.type === 'Wholesaler' ? 'type-wholesaler' : 'type-retail'}`}>
                        {cust.type}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                        <Calendar size={12} />
                        {formatRelativeDate(cust.lastOrderDate)}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="table-action-btn"
                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(cust); }}
                  >
                    <Edit3 size={14} />
                  </button>
                </div>

                {/* Card Body Contacts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserRound size={14} color="#94a3b8" />
                    <span>{cust.contactPerson}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="#94a3b8" />
                    <span>{cust.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="#94a3b8" />
                    <span style={{ textOverflow: 'ellipsis', overflowX: 'auto', whiteSpace: 'nowrap' }}>{cust.email}</span>
                  </div>
                </div>

                {/* Credit Limit / Utilization */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, marginBottom: '6px' }}>
                    <span>CREDIT UTILIZATION</span>
                    <span style={isHighRisk ? { color: '#dc2626' } : {}}>{utilizationRatio.toFixed(0)}% Used</span>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflowX: 'auto' }}>
                    <div style={{ width: `${Math.min(100, utilizationRatio)}%`, height: '100%', background: isHighRisk ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #9333ea)', borderRadius: '10px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>
                    <span>Limit: ₹{cust.creditLimit.toLocaleString('en-IN')}</span>
                    <span>Orders: {cust.totalOrders}</span>
                  </div>
                </div>

                {/* Card Ledger Receivable Summary */}
                <div className="receivable-pill-premium">
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Outstanding Credit</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Active trading liability</div>
                  </div>
                  <div className={`receivable-value ${cust.currentBalance > 0 ? 'positive' : 'neutral'}`}>
                    ₹{cust.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Category</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Amount Due</th>
                <th>Credit Limit</th>
                <th>Last Purchase</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => {
                const utilRatio = cust.creditLimit > 0 ? (cust.currentBalance / cust.creditLimit) : 0;
                let risk = 'Low';
                let riskColor = '#10b981';
                let riskBg = '#ecfdf5';
                if (utilRatio > 0.7) { risk = 'High'; riskColor = '#ef4444'; riskBg = '#fef2f2'; }
                else if (utilRatio > 0.4) { risk = 'Medium'; riskColor = '#f59e0b'; riskBg = '#fffbeb'; }
                
                let status = 'Paid';
                let statusColor = '#10b981';
                if (cust.currentBalance > 0 && utilRatio > 0.7) { status = 'Overdue'; statusColor = '#ef4444'; }
                else if (cust.currentBalance > 0) { status = 'Partial'; statusColor = '#f59e0b'; }

                return (
                <tr key={cust.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(cust)}>
                  <td style={{ fontWeight: 850 }}>
                    <div style={{ color: '#0f172a' }}>{cust.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>{cust.contactPerson}</div>
                  </td>
                  <td>
                    <span className={`type-pill ${cust.type === 'Key Account' ? 'type-key' : cust.type === 'Distributor' ? 'type-distributor' : cust.type === 'Wholesaler' ? 'type-wholesaler' : 'type-retail'}`}>
                      {cust.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: riskBg, color: riskColor, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {risk} Risk
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: statusColor, fontWeight: 700, fontSize: '0.85rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }}></div>
                      {status}
                    </div>
                  </td>
                  <td style={{ color: cust.currentBalance > 0 ? '#b91c1c' : '#16a34a', fontWeight: 850 }}>
                    ₹{cust.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: '#64748b' }}>₹{cust.creditLimit.toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: 650 }}>
                      <Calendar size={14} />
                      {formatRelativeDate(cust.lastOrderDate)}
                    </div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="table-action-btn" onClick={() => handleOpenEdit(cust)}>
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================= */}
      {/* SLIDE OVER RIGHT DETAIL DRAWER */}
      {/* ========================================= */}
      {selectedCustomer && (
        <div className="drawer-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
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
                <span style={{ fontWeight: 850, fontSize: '1rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer Profile</span>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
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
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{selectedCustomer.name}</h2>
                  <span className="type-pill type-key" style={{ marginTop: '6px' }}>{selectedCustomer.type}</span>
                </div>
              </div>

              {/* Rating & Action Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '32px' }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Trust Rating</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Star size={14} fill="#d97706" color="#d97706" /> {selectedCustomer.rating.toFixed(1)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Sales Orders</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                    {selectedCustomer.totalOrders} Active
                  </div>
                </div>
                <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Risk Profile</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const util = selectedCustomer.creditLimit > 0 ? selectedCustomer.currentBalance / selectedCustomer.creditLimit : 0;
                      if (util > 0.7) return <span style={{ color: '#ef4444' }}>High Risk</span>;
                      if (util > 0.4) return <span style={{ color: '#f59e0b' }}>Medium Risk</span>;
                      return <span style={{ color: '#10b981' }}>Low Risk</span>;
                    })()}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Collection</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const util = selectedCustomer.creditLimit > 0 ? selectedCustomer.currentBalance / selectedCustomer.creditLimit : 0;
                      if (selectedCustomer.currentBalance > 0 && util > 0.7) return <span style={{ color: '#ef4444' }}>Overdue</span>;
                      if (selectedCustomer.currentBalance > 0) return <span style={{ color: '#f59e0b' }}>Partial</span>;
                      return <span style={{ color: '#10b981' }}>Paid</span>;
                    })()}
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
                      <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 650, marginTop: '2px' }}>{selectedCustomer.contactPerson}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Mail size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                      <a href={`mailto:${selectedCustomer.email}`} style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 650, marginTop: '2px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {selectedCustomer.email} <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Phone size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</div>
                      <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 650, marginTop: '2px' }}>{selectedCustomer.phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Address</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '2px', lineHeight: 1.4 }}>{selectedCustomer.address}</div>
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
                        ₹{selectedCustomer.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    {selectedCustomer.currentBalance > 0 && (
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', fontWeight: 750, color: '#9f1239', marginTop: '4px' }}>
                        <span>Due in: 8 Days</span>
                      </div>
                    )}
                  </div>
                  {selectedCustomer.currentBalance > 0 && (
                    <button 
                      onClick={() => setShowReceiptModal(true)}
                      style={{ background: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)' }}
                    >
                      <CheckCircle2 size={16} /> Record Receipt
                    </button>
                  )}
                </div>
              </div>

              {/* Ledger ledger history timeline */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 18px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  Procurement Ledger Timeline
                </h4>
                
                {selectedCustomer.ledger.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No transaction history on ledger.</p>
                ) : (
                  <div className="ledger-timeline">
                    {selectedCustomer.ledger.map((item) => (
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
                onClick={() => handleOpenEdit(selectedCustomer)}
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
                <Edit3 size={16} /> Edit Customer
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
                  title="Delete Customer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1 - ONBOARD / EDIT CUSTOMER PROFILE */}
      {showFormModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {editingCustomer ? `Edit Profile Node: ${editingCustomer.name}` : 'Onboard New Customer Account'}
              </h2>
              <button 
                onClick={() => setShowFormModal(false)}
                style={{ border: 'none', background: '#f1f5f9', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} style={{ padding: '24px' }}>
              <div className="premium-input-group">
                <label>Company / Client Name *</label>
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="e.g. Metro Wholesale India"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="premium-input-group">
                  <label>Primary Contact Name</label>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="e.g. Siddharth Shah"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                  />
                </div>
                <div className="premium-input-group">
                  <label>Client Group Category</label>
                  <select 
                    className="premium-input"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as Customer['type'])}
                  >
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retail Partner">Retail Partner</option>
                    <option value="Key Account">Key Account</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="premium-input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="premium-input"
                    placeholder="e.g. operations@metrowholesale.in"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="premium-input-group">
                  <label>Phone Line</label>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="premium-input-group">
                  <label>Credit Allowance Limit (₹)</label>
                  <input 
                    type="number" 
                    className="premium-input"
                    placeholder="e.g. 300000"
                    value={formLimit}
                    onChange={(e) => setFormLimit(e.target.value)}
                  />
                </div>
                <div className="premium-input-group">
                  <label>Initial Trust Rating (1-5)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1"
                    max="5"
                    className="premium-input"
                    placeholder="4.5"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                  />
                </div>
              </div>

              <div className="premium-input-group">
                <label>Billing & Delivery Address</label>
                <textarea 
                  className="premium-input"
                  style={{ height: '70px', fontFamily: 'inherit', resize: 'none' }}
                  placeholder="Street name, industrial park sector, city, state..."
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button 
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  style={{ padding: '12px 20px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                >
                  {editingCustomer ? 'Update Profile' : 'Onboard Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2 - RECORD CUSTOMER RECEIPT PAYMENT */}
      {showReceiptModal && selectedCustomer && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Record Customer Payment Receipt
              </h2>
              <button 
                onClick={() => setShowReceiptModal(false)}
                style={{ border: 'none', background: '#f1f5f9', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleRecordReceipt} style={{ padding: '24px' }}>
              
              <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Receivable Balance</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                  ₹{selectedCustomer.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="premium-input-group">
                <label>Amount Received (₹) *</label>
                <input 
                  type="number" 
                  className="premium-input"
                  placeholder="e.g. 50000"
                  value={receiptAmount}
                  onChange={(e) => setReceiptAmount(e.target.value)}
                  max={selectedCustomer.currentBalance}
                  required
                />
              </div>

              <div className="premium-input-group">
                <label>Transaction Ref / Receipt Code</label>
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="e.g. UPI Ref 990142"
                  value={receiptRef}
                  onChange={(e) => setReceiptRef(e.target.value)}
                />
              </div>

              <div className="premium-input-group">
                <label>Payment Mode / Reference Memo</label>
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="e.g. NEFT Bank Transfer from HDFC"
                  value={receiptNotes}
                  onChange={(e) => setReceiptNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  style={{ padding: '11px 18px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '11px 22px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem', color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                >
                  Record Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG - REMOVE CUSTOMER */}
      {showDeleteConfirm && selectedCustomer && (
        <div className="premium-modal-overlay" style={{ zIndex: 10005 }}>
          <div className="premium-modal-content" style={{ maxWidth: '400px' }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Trash2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
                Terminate Client Node Account?
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 24px', lineHeight: 1.5 }}>
                Are you sure you want to remove <strong>{selectedCustomer.name}</strong> from the client index? This operation will remove all associated credit ledgers.
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}
                >
                  Keep Account
                </button>
                <button 
                  onClick={handleDeleteCustomer}
                  style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.82rem', color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`custom-toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={16} />}
            {toast.type === 'error' && <AlertCircle size={16} />}
            {toast.type === 'warning' && <AlertCircle size={16} />}
            {toast.type === 'info' && <AlertCircle size={16} />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
      {/* Configure Cards Modal */}
      {showMetricsConfig && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '12px' }}>
                  <Settings size={20} color="#4f46e5" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Configure Cards
                </h2>
              </div>
              <button 
                onClick={() => setShowMetricsConfig(false)}
                style={{
                  background: 'transparent', border: 'none', color: '#94a3b8',
                  cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
                Select the key performance indicators you want to monitor on your main operational dashboard.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cardDefinitions.map(card => {
                  const isActive = activeCardIds.includes(card.id);
                  const Icon = card.icon;
                  return (
                    <label 
                      key={card.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: `2px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isActive ? '#f5f7ff' : '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '12px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isActive ? 'rgba(99, 102, 241, 0.1)' : '#f1f5f9',
                          color: isActive ? '#6366f1' : '#64748b'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{card.label}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{card.subtext}</div>
                        </div>
                      </div>
                      
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: `2px solid ${isActive ? '#6366f1' : '#cbd5e1'}`,
                        background: isActive ? '#6366f1' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}>
                        {isActive && <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <input 
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActiveCardIds(prev => [...prev, card.id]);
                          } else {
                            if (activeCardIds.length > 1) {
                              setActiveCardIds(prev => prev.filter(id => id !== card.id));
                            }
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div style={{
              padding: '24px 32px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button 
                onClick={() => setShowMetricsConfig(false)}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
