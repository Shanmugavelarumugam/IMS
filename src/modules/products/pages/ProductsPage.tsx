import React, { useEffect, useState } from 'react';
import { Loader2, Box } from 'lucide-react';
import type { Product, LedgerEntry, ToastMessage } from '../types';

// Styling overrides
import '../styles/products.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

// Modular Components
import { ProductsHeader } from '../components/ProductsHeader';
import { StatsGrid } from '../components/StatsGrid';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { ProductGrid } from '../components/ProductGrid';
import { ProductTable } from '../components/ProductTable';
import { ProductDrawer } from '../components/ProductDrawer';
import { ProductFormModal } from '../components/ProductFormModal';
import { AdjustmentModal } from '../components/AdjustmentModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { MetricsConfigModal } from '../components/MetricsConfigModal';
import { ToastContainer } from '../components/ToastContainer';

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

export const ProductsPage: React.FC = () => {
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

  const handleOpenOnboard = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setShowFormModal(true);
  };

  // Save
  const handleSaveProduct = (
    name: string,
    sku: string,
    barcode: string,
    category: string,
    price: string,
    stock: string,
    minStock: string,
    status: 'ACTIVE' | 'INACTIVE'
  ) => {
    if (!name.trim()) {
      addToast('error', 'Product Name is required');
      return;
    }
    if (!sku.trim()) {
      addToast('error', 'SKU is required');
      return;
    }

    const parsedPrice = parseFloat(price) || 0;
    const parsedStock = parseInt(stock, 10) || 0;
    const parsedMinStock = parseInt(minStock, 10) || 0;

    if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name,
            sku,
            barcode,
            category: { name: category },
            price: parsedPrice,
            stockQty: parsedStock,
            minStockLevel: parsedMinStock,
            status
          };
        }
        return p;
      });
      updateCachedProducts(updated);

      if (selectedProduct && selectedProduct.id === editingProduct.id) {
        const found = updated.find(x => x.id === editingProduct.id);
        if (found) setSelectedProduct(found);
      }
      addToast('success', `Product "${name}" updated successfully`);
    } else {
      const newId = `prod-${Math.random().toString(36).substring(2, 9)}`;
      const newProduct: Product = {
        id: newId,
        name,
        sku,
        barcode,
        price: parsedPrice,
        stockQty: parsedStock,
        minStockLevel: parsedMinStock,
        status,
        category: { name: category },
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
      addToast('success', `Product "${name}" added successfully`);
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
  const handleRecordAdjustment = (
    amount: string,
    type: 'add' | 'subtract',
    notes: string
  ) => {
    if (!selectedProduct) return;

    const amt = parseInt(amount, 10) || 0;
    if (amt <= 0) {
      addToast('error', 'Adjustment quantity must be greater than 0');
      return;
    }

    const isCredit = type === 'add';
    const signedAmount = isCredit ? amt : -amt;

    if (!isCredit && selectedProduct.stockQty - amt < 0) {
      addToast('error', 'Stock quantity cannot fall below 0 units');
      return;
    }

    const newEntry: LedgerEntry = {
      id: `pl-adj-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'adjustment',
      label: notes.trim() || `Manual Stock Adjustment (${isCredit ? 'Added' : 'Subtracted'})`,
      amount: amt,
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
    setShowAdjustmentModal(false);
  };

  // Dynamic calculations
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stockQty), 0);
  const lowStockCount = products.filter(p => p.stockQty > 0 && p.stockQty <= p.minStockLevel).length;
  const categoryCount = new Set(products.map(p => p.category?.name)).size;

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
    <div className="fade-in">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Page Header */}
      <ProductsHeader 
        onExport={handleExportCSV}
        onAddProduct={handleOpenOnboard}
      />

      {/* Stats Highlights Grid */}
      <StatsGrid 
        totalSKUsCount={products.length}
        totalValue={totalValue}
        lowStockCount={lowStockCount}
        categoryCount={categoryCount}
        activeCardIds={activeCardIds}
        onConfigureCards={() => setShowMetricsConfig(true)}
      />

      {/* Search & Tabs Filtering Panel */}
      <SearchFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

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
        <ProductGrid 
          products={filteredProducts}
          onSelectProduct={setSelectedProduct}
        />
      ) : (
        <ProductTable 
          products={filteredProducts}
          onSelectProduct={setSelectedProduct}
        />
      )}

      {/* Slide-out Drawer Detail View */}
      {selectedProduct && (
        <ProductDrawer 
          selectedProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEditSpecs={handleOpenEdit}
          onDeleteSKU={() => setShowDeleteConfirm(true)}
          onRecordAdjustment={() => setShowAdjustmentModal(true)}
        />
      )}

      {/* Onboard / Edit Modal Form */}
      {showFormModal && (
        <ProductFormModal 
          editingProduct={editingProduct}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSaveProduct}
        />
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && selectedProduct && (
        <AdjustmentModal 
          selectedProduct={selectedProduct}
          onClose={() => setShowAdjustmentModal(false)}
          onSubmit={handleRecordAdjustment}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedProduct && (
        <DeleteConfirmModal 
          selectedProduct={selectedProduct}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteProduct}
        />
      )}

      {/* Configure Cards Modal */}
      {showMetricsConfig && (
        <MetricsConfigModal 
          onClose={() => setShowMetricsConfig(false)}
          activeCardIds={activeCardIds}
          onChangeActiveCards={(cardId, checked) => {
            if (checked) {
              setActiveCardIds(prev => [...prev, cardId]);
            } else {
              if (activeCardIds.length > 1) {
                setActiveCardIds(prev => prev.filter(id => id !== cardId));
              }
            }
          }}
        />
      )}
    </div>
  );
};
