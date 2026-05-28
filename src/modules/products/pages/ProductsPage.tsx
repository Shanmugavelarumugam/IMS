import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Box, Loader2, ExternalLink, AlertCircle, Trash2, 
  Edit3, IndianRupee, CheckCircle2, X, Calendar, 
  ShieldCheck, ArrowUpRight, ArrowDownLeft, MoreVertical,
  LayoutGrid, Table, Download, Settings, Layers, AlertTriangle
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  type: 'adjustment' | 'sale' | 'purchase';
  label: string;
  amount: number;
  isCredit: boolean; // true = addition, false = subtraction
}

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stockQty: number;
  minStockLevel: number;
  status: 'ACTIVE' | 'INACTIVE';
  category: {
    name: string;
  };
  ledger: LedgerEntry[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  { 
    id: 'prod-1', 
    name: 'MacBook Pro 16" M3 Max', 
    sku: 'LAP-MBP-16-M3', 
    barcode: '890123001', 
    price: 3499.00, 
    stockQty: 45, 
    minStockLevel: 10, 
    status: 'ACTIVE', 
    category: { name: 'Hardware' },
    ledger: [
      { id: 'pl-1-1', date: '2026-05-01', type: 'adjustment', label: 'Initial Inventory Setup', amount: 50, isCredit: true },
      { id: 'pl-1-2', date: '2026-05-10', type: 'sale', label: 'Order Dispatch #SO-9921', amount: 5, isCredit: false }
    ]
  },
  { 
    id: 'prod-2', 
    name: 'Dell UltraSharp 32" 4K', 
    sku: 'MON-DELL-32', 
    barcode: '890123002', 
    price: 899.00, 
    stockQty: 12, 
    minStockLevel: 15, 
    status: 'ACTIVE', 
    category: { name: 'Peripherals' },
    ledger: [
      { id: 'pl-2-1', date: '2026-05-02', type: 'adjustment', label: 'Initial Inventory Setup', amount: 15, isCredit: true },
      { id: 'pl-2-2', date: '2026-05-15', type: 'sale', label: 'Damaged Stock Write-off', amount: 3, isCredit: false }
    ]
  },
  { 
    id: 'prod-3', 
    name: 'Logitech MX Master 3S', 
    sku: 'ACC-LOG-MX3S', 
    barcode: '890123003', 
    price: 99.00, 
    stockQty: 120, 
    minStockLevel: 20, 
    status: 'ACTIVE', 
    category: { name: 'Accessories' },
    ledger: [
      { id: 'pl-3-1', date: '2026-05-03', type: 'adjustment', label: 'Initial Inventory Setup', amount: 120, isCredit: true }
    ]
  },
  { 
    id: 'prod-4', 
    name: 'AWS EC2 Reserved Instance', 
    sku: 'CLD-AWS-EC2-R', 
    barcode: '890123004', 
    price: 1500.00, 
    stockQty: 999, 
    minStockLevel: 0, 
    status: 'ACTIVE', 
    category: { name: 'Cloud Infra' },
    ledger: [
      { id: 'pl-4-1', date: '2026-05-01', type: 'adjustment', label: 'Bulk Provisioning', amount: 999, isCredit: true }
    ]
  },
  { 
    id: 'prod-5', 
    name: 'Microsoft 365 E5 License', 
    sku: 'LIC-MS365-E5', 
    barcode: '890123005', 
    price: 38.00, 
    stockQty: 500, 
    minStockLevel: 50, 
    status: 'ACTIVE', 
    category: { name: 'Software' },
    ledger: [
      { id: 'pl-5-1', date: '2026-05-05', type: 'adjustment', label: 'Licensing Import', amount: 500, isCredit: true }
    ]
  },
  { 
    id: 'prod-6', 
    name: 'Cisco Catalyst 9300', 
    sku: 'NET-CIS-9300', 
    barcode: '890123006', 
    price: 4200.00, 
    stockQty: 5, 
    minStockLevel: 8, 
    status: 'ACTIVE', 
    category: { name: 'Networking' },
    ledger: [
      { id: 'pl-6-1', date: '2026-05-01', type: 'adjustment', label: 'Initial Setup', amount: 5, isCredit: true }
    ]
  },
  { 
    id: 'prod-7', 
    name: 'Apple iPad Pro 12.9"', 
    sku: 'TAB-IPAD-12', 
    barcode: '890123007', 
    price: 1099.00, 
    stockQty: 30, 
    minStockLevel: 15, 
    status: 'ACTIVE', 
    category: { name: 'Hardware' },
    ledger: [
      { id: 'pl-7-1', date: '2026-05-02', type: 'adjustment', label: 'Initial Setup', amount: 30, isCredit: true }
    ]
  },
  { 
    id: 'prod-8', 
    name: 'Herman Miller Aeron', 
    sku: 'FURN-HM-AER', 
    barcode: '890123008', 
    price: 1400.00, 
    stockQty: 0, 
    minStockLevel: 10, 
    status: 'ACTIVE', 
    category: { name: 'Office' },
    ledger: [
      { id: 'pl-8-1', date: '2026-05-01', type: 'adjustment', label: 'Initial Setup', amount: 10, isCredit: true },
      { id: 'pl-8-2', date: '2026-05-18', type: 'sale', label: 'Full Stock Clearance Sale', amount: 10, isCredit: false }
    ]
  }
];

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'oos' | 'high_val'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [activeCardIds, setActiveCardIds] = useState<string[]>(['total_skus', 'total_value', 'low_stock', 'categories']);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Drawer / Selection State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal toggles
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form Inputs State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCategory, setFormCategory] = useState('Hardware');
  const [formPrice, setFormPrice] = useState('999');
  const [formStock, setFormStock] = useState('10');
  const [formMinStock, setFormMinStock] = useState('5');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Adjustment State
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  // Add Toast Notification
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Load Products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const cached = localStorage.getItem('ims_dummy_products');
      if (cached) {
        setProducts(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_products', JSON.stringify(DEFAULT_PRODUCTS));
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch {
      addToast('error', 'Connection to product inventory failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update localStorage helper
  const updateCachedProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    localStorage.setItem('ims_dummy_products', JSON.stringify(updatedList));
  };

  // Export to CSV
  const handleExportCSV = () => {
    try {
      const headers = ['Product Name', 'SKU', 'Barcode', 'Category', 'List Price', 'Stock Level', 'Min Stock Alert', 'Status'];
      const csvRows = filteredProducts.map(p => [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.sku.replace(/"/g, '""')}"`,
        `"${p.barcode.replace(/"/g, '""')}"`,
        `"${p.category.name.replace(/"/g, '""')}"`,
        p.price,
        p.stockQty,
        p.minStockLevel,
        p.status
      ]);

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Product_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('success', 'Product directory exported successfully as CSV!');
    } catch {
      addToast('error', 'Failed to export product data.');
    }
  };

  // Onboard Form
  const handleOpenOnboard = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku('');
    setFormBarcode('');
    setFormCategory('Hardware');
    setFormPrice('999');
    setFormStock('10');
    setFormMinStock('5');
    setFormStatus('ACTIVE');
    setShowFormModal(true);
  };

  // Edit Form
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormBarcode(p.barcode);
    setFormCategory(p.category?.name || 'Hardware');
    setFormPrice(p.price.toString());
    setFormStock(p.stockQty.toString());
    setFormMinStock(p.minStockLevel.toString());
    setFormStatus(p.status || 'ACTIVE');
    setShowFormModal(true);
  };

  // Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('error', 'Product Name is required');
      return;
    }
    if (!formSku.trim()) {
      addToast('error', 'SKU is required');
      return;
    }

    const parsedPrice = parseFloat(formPrice) || 0;
    const parsedStock = parseInt(formStock, 10) || 0;
    const parsedMinStock = parseInt(formMinStock, 10) || 0;

    if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            sku: formSku,
            barcode: formBarcode,
            category: { name: formCategory },
            price: parsedPrice,
            stockQty: parsedStock,
            minStockLevel: parsedMinStock,
            status: formStatus
          };
        }
        return p;
      });
      updateCachedProducts(updated);

      if (selectedProduct && selectedProduct.id === editingProduct.id) {
        const found = updated.find(x => x.id === editingProduct.id);
        if (found) setSelectedProduct(found);
      }
      addToast('success', `Product "${formName}" updated successfully`);
    } else {
      const newId = `prod-${Math.random().toString(36).substring(2, 9)}`;
      const newProduct: Product = {
        id: newId,
        name: formName,
        sku: formSku,
        barcode: formBarcode,
        price: parsedPrice,
        stockQty: parsedStock,
        minStockLevel: parsedMinStock,
        status: formStatus,
        category: { name: formCategory },
        ledger: [
          {
            id: `pl-add-${Math.random().toString(36).substring(2, 9)}`,
            date: new Date().toISOString().split('T')[0],
            type: 'adjustment',
            label: 'Initial Catalog Onboarding',
            amount: parsedStock,
            isCredit: true
          }
        ]
      };
      updateCachedProducts([newProduct, ...products]);
      addToast('success', `Product "${formName}" added successfully`);
    }
    setShowFormModal(false);
  };

  // Delete
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    const name = selectedProduct.name;
    const updated = products.filter(p => p.id !== selectedProduct.id);
    updateCachedProducts(updated);
    addToast('warning', `Removed "${name}" from inventory catalog`);
    setSelectedProduct(null);
    setShowDeleteConfirm(false);
  };

  // Stock Adjustment
  const handleRecordAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const amount = parseInt(adjustmentAmount, 10) || 0;
    if (amount <= 0) {
      addToast('error', 'Adjustment quantity must be greater than 0');
      return;
    }

    const isCredit = adjustmentType === 'add';
    const signedAmount = isCredit ? amount : -amount;

    if (!isCredit && selectedProduct.stockQty - amount < 0) {
      addToast('error', 'Stock quantity cannot fall below 0 units');
      return;
    }

    const newEntry: LedgerEntry = {
      id: `pl-adj-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'adjustment',
      label: adjustmentNotes.trim() || `Manual Stock Adjustment (${isCredit ? 'Added' : 'Subtracted'})`,
      amount,
      isCredit
    };

    const updated = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          stockQty: p.stockQty + signedAmount,
          ledger: [newEntry, ...(p.ledger || [])]
        };
      }
      return p;
    });

    updateCachedProducts(updated);
    const found = updated.find(x => x.id === selectedProduct.id);
    if (found) setSelectedProduct(found);

    addToast('success', `Adjusted stock by ${signedAmount} U for "${selectedProduct.name}"`);
    setAdjustmentAmount('');
    setAdjustmentNotes('');
    setShowAdjustmentModal(false);
  };

  // Dynamic calculations
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stockQty), 0);
  const lowStockCount = products.filter(p => p.stockQty > 0 && p.stockQty <= p.minStockLevel).length;
  const categoryCount = new Set(products.map(p => p.category?.name)).size;

  const cardDefinitions = [
    {
      id: 'total_skus',
      label: 'Total Products',
      value: products.length,
      subtext: 'Active inventory items',
      icon: Box,
      className: 'blue',
      color: '#6366f1'
    },
    {
      id: 'total_value',
      label: 'Total Inventory Value',
      value: `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Current inventory valuation',
      icon: IndianRupee,
      className: 'emerald',
      color: '#059669',
      valueColor: '#059669'
    },
    {
      id: 'low_stock',
      label: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: 'Items below threshold',
      icon: AlertTriangle,
      className: 'rose',
      color: '#e11d48',
      valueColor: lowStockCount > 0 ? '#e11d48' : '#0f172a'
    },
    {
      id: 'categories',
      label: 'Categories',
      value: categoryCount,
      subtext: 'Active categories',
      icon: Layers,
      className: 'purple',
      color: '#8b5cf6'
    }
  ];

  // Filtering Logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.barcode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'low') return prod.stockQty > 0 && prod.stockQty <= prod.minStockLevel;
    if (activeTab === 'oos') return prod.stockQty <= 0;
    if (activeTab === 'high_val') return prod.price >= 1000;

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

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .product-card-premium {
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
        .product-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.35);
        }
        .product-card-premium::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: transparent;
          transition: background 0.3s ease;
        }
        .product-card-premium:hover::after {
          background: linear-gradient(90deg, #6366f1, #9333ea);
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .stock-pill-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .product-card-premium:hover .stock-pill-premium {
          background: #faf5ff;
          border-color: #f3e8ff;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

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

        /* Detail Drawer */
        .drawer-overlay {
          position: fixed;
          top: 0; right: 0; bottom: 0; left: 0;
          background: rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          animation: drawerBackdrop 0.3s ease forwards;
        }
        .drawer-sheet {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 480px;
          background: #ffffff;
          box-shadow: -10px 0 40px rgba(15, 23, 42, 0.08);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          animation: drawerSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 520px) {
          .drawer-sheet { width: 100%; }
        }

        /* Toast container */
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 11000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .premium-toast {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 320px;
          max-width: 420px;
          animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toast-bar {
          width: 4px;
          height: 100%;
          position: absolute;
          left: 0; top: 0; bottom: 0;
          border-radius: 16px 0 0 16px;
        }

        /* Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes drawerBackdrop {
          to { opacity: 1; }
        }
        @keyframes drawerSlide {
          to { transform: translateX(0); }
        }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(50px) translateY(10px); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
      `}</style>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="premium-toast" style={{ position: 'relative' }}>
            <div 
              className="toast-bar"
              style={{
                background: 
                  t.type === 'success' ? '#059669' :
                  t.type === 'warning' ? '#d97706' :
                  t.type === 'error' ? '#dc2626' : '#2563eb'
              }}
            />
            {t.type === 'success' && <CheckCircle2 color="#059669" size={20} />}
            {t.type === 'warning' && <AlertTriangle color="#d97706" size={20} />}
            {t.type === 'error' && <AlertCircle color="#dc2626" size={20} />}
            {t.type === 'info' && <AlertCircle color="#2563eb" size={20} />}
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.0rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>Product Inventory</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.94rem', fontWeight: 550 }}>Manage products, inventory levels, pricing, and category organization.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleExportCSV} 
            className="table-action-btn" 
            style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ffffff', color: '#64748b' }}
            title="Export CSV"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handleOpenOnboard}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Plus size={18} strokeWidth={2.5} /> Add Product
          </button>
        </div>
      </div>

      {/* Configure Cards Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
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
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.05)',
            transition: 'all 0.2s'
          }}
        >
          <Settings size={14} /> Configure Cards
        </button>
      </div>

      {/* Stats Highlights Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
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

      {/* Search & Tabs Filtering Panel */}
      <div className="search-container">
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search by product name, SKU, or category..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 48px', 
              border: '1.5px solid #e2e8f0', 
              borderRadius: '14px', 
              fontSize: '0.9rem', 
              background: '#ffffff',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Products
          </button>
          <button 
            className={`filter-tab ${activeTab === 'low' ? 'active' : ''}`}
            onClick={() => setActiveTab('low')}
          >
            Low Stock
          </button>
          <button 
            className={`filter-tab ${activeTab === 'oos' ? 'active' : ''}`}
            onClick={() => setActiveTab('oos')}
          >
            Out of Stock
          </button>
          <button 
            className={`filter-tab ${activeTab === 'high_val' ? 'active' : ''}`}
            onClick={() => setActiveTab('high_val')}
          >
            High Value
          </button>
        </div>

        {/* Layout Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px', marginLeft: 'auto' }}>
          <button 
            onClick={() => setViewMode('table')}
            style={{ 
              border: 'none', 
              padding: '8px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              background: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#6366f1' : '#64748b',
              boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Table size={16} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ 
              border: 'none', 
              padding: '8px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? '#6366f1' : '#64748b',
              boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Loading / Table / Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '35vh', gap: '16px' }}>
          <Loader2 className="spin" color="#6366f1" size={42} style={{ animation: 'spin 1.2s linear infinite' }} />
          <p style={{ color: '#64748b', fontWeight: 650, fontSize: '0.9rem' }}>Hydrating product catalog matrix...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #f1f5f9', padding: '60px 40px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
          <Box size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>No products match your query</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.88rem', fontWeight: 550 }}>Try redefining your filters or register a new SKU product.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="product-grid">
          {filteredProducts.map((prod) => {
            const isLow = prod.stockQty > 0 && prod.stockQty <= prod.minStockLevel;
            const isOut = prod.stockQty <= 0;
            return (
              <div 
                key={prod.id} 
                className="product-card-premium"
                onClick={() => setSelectedProduct(prod)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ height: '44px', width: '44px', background: 'linear-gradient(135deg, #f0f3ff 0%, #e0e7ff 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    <Box size={22} />
                  </div>
                  <div>
                    {isOut ? (
                      <span className="status-pill" style={{ background: '#ffe4e6', color: '#e11d48' }}>Out of Stock</span>
                    ) : isLow ? (
                      <span className="status-pill" style={{ background: '#fef3c7', color: '#d97706' }}>Low Stock</span>
                    ) : (
                      <span className="status-pill" style={{ background: '#ecfdf5', color: '#059669' }}>Active</span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', lineBreak: 'anywhere' }}>{prod.name}</h3>
                
                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                  <code style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px' }}>
                    {prod.sku}
                  </code>
                  <span className="category-pill" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    {prod.category?.name}
                  </span>
                </div>

                <div className="stock-pill-premium" style={{ marginBottom: '18px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>In Stock</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: isOut ? '#e11d48' : isLow ? '#d97706' : '#0f172a' }}>
                      {prod.stockQty} Units
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Min Alert</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{prod.minStockLevel} U</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>
                    ₹{prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View specs <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="premium-table-container">
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>SKU / Barcode</th>
                  <th>Category</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ width: '60px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => {
                  const isLow = prod.stockQty > 0 && prod.stockQty <= prod.minStockLevel;
                  const isOut = prod.stockQty <= 0;
                  return (
                    <tr key={prod.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(prod)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ height: '40px', width: '40px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            <Box size={20} />
                          </div>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{prod.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <code style={{ fontSize: '0.78rem', fontWeight: 850, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                            {prod.sku}
                          </code>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{prod.barcode || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill">
                          {prod.category?.name}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: isOut ? '#e11d48' : isLow ? '#d97706' : '#0f172a' }}>
                            {prod.stockQty} U
                          </span>
                          {isOut ? (
                            <div className="status-pill" style={{ background: '#ffe4e6', color: '#e11d48' }}>OOS</div>
                          ) : isLow ? (
                            <div className="status-pill" style={{ background: '#fef3c7', color: '#d97706' }}>LOW</div>
                          ) : (
                            <div className="status-pill" style={{ background: '#ecfdf5', color: '#059669' }}>OK</div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
                        ₹{prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => setSelectedProduct(prod)} className="table-action-btn">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Drawer Detail View */}
      {selectedProduct && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedProduct(null)} />
          <div className="drawer-sheet">
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '10px', borderRadius: '12px', color: '#ffffff' }}>
                  <Box size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0, lineBreak: 'anywhere' }}>
                    {selectedProduct.name}
                  </h2>
                  <code style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4f46e5', marginTop: '2px', display: 'inline-block' }}>
                    {selectedProduct.sku}
                  </code>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              
              {/* Actions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                <button 
                  onClick={() => handleOpenEdit(selectedProduct)}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    padding: '12px',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Edit3 size={16} /> Edit Specs
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    background: '#fff1f2',
                    border: '1.5px solid #ffe4e6',
                    padding: '12px',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#e11d48',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Trash2 size={16} /> Delete SKU
                </button>
              </div>

              {/* Status and Ledger Highlights Card */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: '24px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Stock Availability</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 950, color: selectedProduct.stockQty <= 0 ? '#e11d48' : selectedProduct.stockQty <= selectedProduct.minStockLevel ? '#d97706' : '#059669' }}>
                    {selectedProduct.stockQty} U
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Unit Catalog Price</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                    ₹{selectedProduct.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Minimum Stock Alert Level</span>
                  <span style={{ fontSize: '1.0rem', fontWeight: 800, color: '#1e293b' }}>
                    {selectedProduct.minStockLevel} U
                  </span>
                </div>
              </div>

              {/* Specs List */}
              <h3 style={{ fontSize: '0.85rem', fontWeight: 850, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Specification Metadata
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Layers size={16} color="#94a3b8" style={{ marginTop: '3px' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Classification Category</span>
                    <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>{selectedProduct.category?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Calendar size={16} color="#94a3b8" style={{ marginTop: '3px' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Standard UPC/Barcode Code</span>
                    <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>{selectedProduct.barcode || 'None Registered'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={16} color="#94a3b8" style={{ marginTop: '3px' }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>System Integrity Status</span>
                    <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>
                      {selectedProduct.status === 'ACTIVE' ? 'Trading Enabled' : 'Temporarily Archived'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjust Stock Trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 850, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Stock adjustment log
                </h3>
                <button 
                  onClick={() => setShowAdjustmentModal(true)}
                  style={{
                    background: '#6366f1',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> Record Adjustment
                </button>
              </div>

              {/* Stock Ledger Timeline */}
              {selectedProduct.ledger && selectedProduct.ledger.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedProduct.ledger.map((entry) => (
                    <div 
                      key={entry.id} 
                      style={{ 
                        background: '#ffffff', 
                        border: '1.5px solid #f1f5f9', 
                        borderRadius: '16px', 
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                          {entry.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                          {entry.date}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span 
                          style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: 900,
                            color: entry.isCredit ? '#059669' : '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {entry.isCredit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                          {entry.isCredit ? '+' : '-'}{entry.amount} U
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                  No historical ledger transaction logs found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Onboard / Edit Modal Form */}
      {showFormModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {editingProduct ? 'Update SKU Specification' : 'Add Product'}
              </h2>
              <button 
                onClick={() => setShowFormModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ padding: '32px' }}>
                <div className="premium-input-group">
                  <label>Product Name / Model</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)} 
                    placeholder="e.g. Dell Precision 5570 Laptop"
                  />
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>SKU Code</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      value={formSku} 
                      onChange={e => setFormSku(e.target.value)} 
                      placeholder="e.g. LAP-DELL-5570"
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Universal Barcode</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      value={formBarcode} 
                      onChange={e => setFormBarcode(e.target.value)} 
                      placeholder="e.g. 890123019"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Classification Category</label>
                    <select 
                      className="premium-input"
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      style={{ background: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="Hardware">Hardware</option>
                      <option value="Peripherals">Peripherals</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Software">Software</option>
                      <option value="Networking">Networking</option>
                      <option value="Cloud Infra">Cloud Infra</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                  <div className="premium-input-group">
                    <label>System Status</label>
                    <select 
                      className="premium-input"
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                      style={{ background: '#ffffff', cursor: 'pointer' }}
                    >
                      <option value="ACTIVE">ACTIVE (Enabled)</option>
                      <option value="INACTIVE">INACTIVE (Archived)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Unit Catalog Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="premium-input" 
                      value={formPrice} 
                      onChange={e => setFormPrice(e.target.value)} 
                      placeholder="999"
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Minimum Stock Alert Level</label>
                    <input 
                      type="number" 
                      className="premium-input" 
                      value={formMinStock} 
                      onChange={e => setFormMinStock(e.target.value)} 
                      placeholder="5"
                    />
                  </div>
                </div>

                {!editingProduct && (
                  <div className="premium-input-group">
                    <label>Initial Opening Stock Quantity (Units)</label>
                    <input 
                      type="number" 
                      className="premium-input" 
                      value={formStock} 
                      onChange={e => setFormStock(e.target.value)} 
                      placeholder="10"
                    />
                  </div>
                )}
              </div>

              <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc' }}>
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  {editingProduct ? 'Save Specifications' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && selectedProduct && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Adjust Stock Quantity
              </h2>
              <button 
                onClick={() => setShowAdjustmentModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleRecordAdjustment}>
              <div style={{ padding: '32px' }}>
                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 20px 0', lineHeight: 1.5, fontWeight: 550 }}>
                  Adjust active stock levels for <strong style={{ color: '#0f172a' }}>{selectedProduct.name}</strong>. Current level: {selectedProduct.stockQty} U.
                </p>

                <div className="premium-input-group">
                  <label>Adjustment Action</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <label 
                      style={{ 
                        flex: 1, 
                        border: `1.5px solid ${adjustmentType === 'add' ? '#6366f1' : '#e2e8f0'}`, 
                        background: adjustmentType === 'add' ? '#f5f7ff' : '#ffffff',
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: adjustmentType === 'add' ? '#6366f1' : '#475569'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="adjType" 
                        checked={adjustmentType === 'add'} 
                        onChange={() => setAdjustmentType('add')} 
                        style={{ display: 'none' }}
                      />
                      Add Stock (+)
                    </label>
                    <label 
                      style={{ 
                        flex: 1, 
                        border: `1.5px solid ${adjustmentType === 'subtract' ? '#dc2626' : '#e2e8f0'}`, 
                        background: adjustmentType === 'subtract' ? '#fff1f2' : '#ffffff',
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: adjustmentType === 'subtract' ? '#dc2626' : '#475569'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="adjType" 
                        checked={adjustmentType === 'subtract'} 
                        onChange={() => setAdjustmentType('subtract')} 
                        style={{ display: 'none' }}
                      />
                      Deduct Stock (-)
                    </label>
                  </div>
                </div>

                <div className="premium-input-group">
                  <label>Adjustment Quantity (Units)</label>
                  <input 
                    type="number" 
                    className="premium-input" 
                    value={adjustmentAmount} 
                    onChange={e => setAdjustmentAmount(e.target.value)} 
                    placeholder="e.g. 5"
                    min="1"
                  />
                </div>

                <div className="premium-input-group">
                  <label>Audit Adjustment Reason / Note</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={adjustmentNotes} 
                    onChange={e => setAdjustmentNotes(e.target.value)} 
                    placeholder="e.g. Supply consignment received / Damaged item write-off"
                  />
                </div>
              </div>

              <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAdjustmentModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: adjustmentType === 'add' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                  }}
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedProduct && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#fff1f2', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', margin: '0 auto 20px auto' }}>
                <AlertCircle size={28} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>
                Terminate SKU Catalog Node?
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, fontWeight: 550 }}>
                This will permanently remove <strong style={{ color: '#0f172a' }}>{selectedProduct.name}</strong> from the active SKU database catalog directory. Historical ledger logs will be archived. This action is irreversible.
              </p>
            </div>

            <div style={{ padding: '20px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px', background: '#f8fafc' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, background: '#ffffff', border: '1.5px solid #e2e8f0', color: '#475569', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}
              >
                No, Keep Product
              </button>
              <button 
                onClick={handleDeleteProduct}
                style={{ flex: 1, background: '#dc2626', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)' }}
              >
                Yes, Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Cards Modal */}
      {showMetricsConfig && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
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
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
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
            
            <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
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
