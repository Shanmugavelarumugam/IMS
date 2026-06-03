import React, { useEffect, useState } from 'react';
import { Box } from 'lucide-react';
import type { InventoryItem, ToastMessage } from '../types';

// Style sheets
import '../styles/inventory.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

// Components
import { InventoryHeader } from '../components/InventoryHeader';
import { StatsGrid } from '../components/StatsGrid';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { InventoryGrid } from '../components/InventoryGrid';
import { InventoryTable } from '../components/InventoryTable';
import { InventoryDrawer } from '../components/InventoryDrawer';
import { AdjustModal } from '../components/AdjustModal';
import { TransferModal } from '../components/TransferModal';
import { AddItemModal } from '../components/AddItemModal';
import { MetricsConfigModal } from '../components/MetricsConfigModal';
import { ToastContainer } from '../components/ToastContainer';

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'SKU-MBP-M3',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Hardware & Devices',
    qty: 45,
    price: 289900.00,
    minStockLevel: 10,
    status: 'ACTIVE',
    warehouses: [
      { warehouseName: 'Mumbai Central Hub', qty: 25 },
      { warehouseName: 'Bangalore Tech Park Depot', qty: 20 }
    ],
    lastAudited: '2026-05-10',
    ledger: [
      { id: 'il-1-1', date: '2026-05-01', type: 'audit', label: 'Bi-annual physical audit', amount: 45, isCredit: true }
    ]
  },
  {
    id: 'inv-2',
    sku: 'SKU-DELL-32',
    name: 'Dell UltraSharp 32" 4K Monitor',
    category: 'Office Peripherals',
    qty: 12,
    price: 74900.00,
    minStockLevel: 15,
    status: 'ACTIVE',
    warehouses: [
      { warehouseName: 'Mumbai Central Hub', qty: 8 },
      { warehouseName: 'Bangalore Tech Park Depot', qty: 4 }
    ],
    lastAudited: '2026-05-12',
    ledger: [
      { id: 'il-2-1', date: '2026-05-02', type: 'adjustment', label: 'Damaged shipment write-off', amount: 3, isCredit: false }
    ]
  },
  {
    id: 'inv-3',
    sku: 'SKU-LOG-MX3S',
    name: 'Logitech MX Master 3S',
    category: 'Office Peripherals',
    qty: 120,
    price: 9500.00,
    minStockLevel: 20,
    status: 'ACTIVE',
    warehouses: [
      { warehouseName: 'Mumbai Central Hub', qty: 60 },
      { warehouseName: 'Bangalore Tech Park Depot', qty: 60 }
    ],
    lastAudited: '2026-05-18',
    ledger: [
      { id: 'il-3-1', date: '2026-05-05', type: 'adjustment', label: 'Procurement arrival #PO-7712', amount: 80, isCredit: true }
    ]
  },
  {
    id: 'inv-4',
    sku: 'SKU-AWS-EC2',
    name: 'AWS EC2 Reserved Cloud Instance',
    category: 'Cloud & Infrastructure',
    qty: 999,
    price: 124000.00,
    minStockLevel: 0,
    status: 'ACTIVE',
    warehouses: [
      { warehouseName: 'Mumbai Central Hub', qty: 999 }
    ],
    lastAudited: '2026-05-01',
    ledger: [
      { id: 'il-4-1', date: '2026-05-01', type: 'audit', label: 'Cloud inventory sync', amount: 999, isCredit: true }
    ]
  },
  {
    id: 'inv-5',
    sku: 'SKU-MS-365',
    name: 'Microsoft 365 E5 Cloud License',
    category: 'Enterprise Software',
    qty: 5,
    price: 3100.00,
    minStockLevel: 50,
    status: 'ACTIVE',
    warehouses: [
      { warehouseName: 'Bangalore Tech Park Depot', qty: 5 }
    ],
    lastAudited: '2026-05-20',
    ledger: [
      { id: 'il-5-1', date: '2026-05-20', type: 'adjustment', label: 'Local employee assignment sync', amount: 45, isCredit: false }
    ]
  }
];

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'shortage' | 'overstock' | 'healthy'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Selected Detail Drawer
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Modals
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigureCards, setShowConfigureCards] = useState(false);

  // Card view configs
  const [visibleCards, setVisibleCards] = useState({
    total_qty: true,
    net_value: true,
    alerts: true,
    locations: true
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
      const cached = localStorage.getItem('ims_dummy_inventory');
      if (cached) {
        setItems(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_inventory', JSON.stringify(DEFAULT_INVENTORY));
        setItems(DEFAULT_INVENTORY);
      }
    } catch {
      setItems(DEFAULT_INVENTORY);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCachedItems = (updated: InventoryItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('ims_dummy_inventory', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Record Stock Adjustment
  const handleStockAdjustment = (
    amount: string,
    type: 'add' | 'subtract',
    notes: string,
    warehouse: string
  ) => {
    if (!selectedItem) return;

    const qtyVal = parseInt(amount, 10) || 0;
    if (qtyVal <= 0) {
      addToast('error', 'Adjustment quantity must be greater than 0');
      return;
    }

    if (!warehouse) {
      addToast('error', 'Please select a warehouse location');
      return;
    }

    const isCredit = type === 'add';
    const signedQty = isCredit ? qtyVal : -qtyVal;

    // Check if enough stock in warehouse
    const currentWarehouse = selectedItem.warehouses.find(w => w.warehouseName === warehouse);
    const currentWhQty = currentWarehouse ? currentWarehouse.qty : 0;

    if (!isCredit && currentWhQty < qtyVal) {
      addToast('error', `Insufficient quantity at selected warehouse (Available: ${currentWhQty})`);
      return;
    }

    const newLedgerEntry = {
      id: `il-adj-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'adjustment' as const,
      label: notes.trim() || `Manual Adjustment (${isCredit ? 'Added' : 'Subtracted'}) at ${warehouse}`,
      amount: qtyVal,
      isCredit
    };

    const updated = items.map((item) => {
      if (item.id === selectedItem.id) {
        // Adjust warehouse qty
        let whExists = false;
        let nextWhs = item.warehouses.map((wh) => {
          if (wh.warehouseName === warehouse) {
            whExists = true;
            return { ...wh, qty: Math.max(0, wh.qty + signedQty) };
          }
          return wh;
        });

        if (!whExists && isCredit) {
          nextWhs.push({ warehouseName: warehouse, qty: qtyVal });
        }

        // Clean out warehouses with 0 quantity
        nextWhs = nextWhs.filter(wh => wh.qty > 0 || wh.warehouseName === 'Mumbai Central Hub');

        const totalQty = nextWhs.reduce((sum, w) => sum + w.qty, 0);

        return {
          ...item,
          qty: totalQty,
          warehouses: nextWhs,
          ledger: [newLedgerEntry, ...(item.ledger || [])]
        };
      }
      return item;
    });

    updateCachedItems(updated);
    const found = updated.find(x => x.id === selectedItem.id);
    if (found) setSelectedItem(found);

    addToast('success', `Successfully adjusted stock by ${signedQty} U for "${selectedItem.name}"`);
    setShowAdjustModal(false);
  };

  // Stock Transfer between Warehouses
  const handleStockTransfer = (
    amount: string,
    fromWarehouse: string,
    toWarehouse: string
  ) => {
    if (!selectedItem) return;

    const qtyVal = parseInt(amount, 10) || 0;
    if (qtyVal <= 0) {
      addToast('error', 'Transfer quantity must be greater than 0');
      return;
    }

    if (!fromWarehouse || !toWarehouse) {
      addToast('error', 'Please define valid source and destination branches');
      return;
    }

    if (fromWarehouse === toWarehouse) {
      addToast('error', 'Source and destination branches cannot be the same');
      return;
    }

    const sourceWh = selectedItem.warehouses.find(w => w.warehouseName === fromWarehouse);
    if (!sourceWh || sourceWh.qty < qtyVal) {
      addToast('error', `Insufficient quantities at source depot "${fromWarehouse}" (Available: ${sourceWh?.qty || 0})`);
      return;
    }

    const newLedgerEntry = {
      id: `il-tr-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'transfer' as const,
      label: `Transferred ${qtyVal} units from "${fromWarehouse}" to "${toWarehouse}"`,
      amount: qtyVal,
      isCredit: true
    };

    const updated = items.map((item) => {
      if (item.id === selectedItem.id) {
        let destExists = false;
        const nextWhs = item.warehouses.map((wh) => {
          if (wh.warehouseName === fromWarehouse) {
            return { ...wh, qty: wh.qty - qtyVal };
          }
          if (wh.warehouseName === toWarehouse) {
            destExists = true;
            return { ...wh, qty: wh.qty + qtyVal };
          }
          return wh;
        });

        if (!destExists) {
          nextWhs.push({ warehouseName: toWarehouse, qty: qtyVal });
        }

        return {
          ...item,
          warehouses: nextWhs.filter(wh => wh.qty > 0 || wh.warehouseName === 'Mumbai Central Hub'),
          ledger: [newLedgerEntry, ...(item.ledger || [])]
        };
      }
      return item;
    });

    updateCachedItems(updated);
    const found = updated.find(x => x.id === selectedItem.id);
    if (found) setSelectedItem(found);

    addToast('success', `Transferred ${qtyVal} units of "${selectedItem.name}"`);
    setShowTransferModal(false);
  };

  // Add Item to Inventory
  const handleAddItem = (
    sku: string,
    name: string,
    category: string,
    qty: string,
    price: string,
    minStock: string,
    warehouse: string
  ) => {
    if (!sku.trim() || !name.trim()) {
      addToast('error', 'SKU and Item Name are mandatory fields');
      return;
    }

    const quantity = parseInt(qty, 10) || 0;
    const unitPrice = parseFloat(price) || 0;

    const newItem: InventoryItem = {
      id: `inv-${Math.random().toString(36).substring(2, 9)}`,
      sku: sku.toUpperCase().trim(),
      name: name.trim(),
      category,
      qty: quantity,
      price: unitPrice,
      minStockLevel: parseInt(minStock, 10) || 0,
      status: 'ACTIVE',
      warehouses: [
        { warehouseName: warehouse, qty: quantity }
      ],
      lastAudited: new Date().toISOString().split('T')[0],
      ledger: [
        { 
          id: `il-init-${Math.random().toString(36).substring(2, 9)}`, 
          date: new Date().toISOString().split('T')[0], 
          type: 'audit', 
          label: 'Initial stock register audit', 
          amount: quantity, 
          isCredit: true 
        }
      ]
    };

    updateCachedItems([newItem, ...items]);
    addToast('success', `Item "${name}" registered into active inventory`);
    setShowAddModal(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (items.length === 0) {
      addToast('error', 'No inventory records to export');
      return;
    }
    const headers = ['SKU', 'Product Name', 'Category', 'Total Qty', 'Unit Price', 'Total Valuation', 'Alert Level', 'Last Audited'];
    const rows = items.map(i => [
      i.sku,
      `"${i.name.replace(/"/g, '""')}"`,
      i.category,
      i.qty,
      `₹${i.price.toFixed(2)}`,
      `₹${(i.qty * i.price).toFixed(2)}`,
      i.qty <= i.minStockLevel ? 'LOW STOCK' : 'HEALTHY',
      i.lastAudited
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viyan_stock_balance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Full stock balance record successfully exported as CSV');
  };

  // Calculations
  const totalStockQty = items.reduce((sum, i) => sum + i.qty, 0);
  const netInventoryVal = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
  const lowStockAlerts = items.filter(i => i.qty <= i.minStockLevel).length;
  
  // Locations set
  const locationSet = new Set<string>();
  items.forEach(i => i.warehouses.forEach(w => locationSet.add(w.warehouseName)));
  const locationsCount = locationSet.size || 1;

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'shortage') return item.qty <= item.minStockLevel;
    if (activeTab === 'overstock') return item.qty >= 500;
    if (activeTab === 'healthy') return item.qty > item.minStockLevel;

    return true;
  });

  return (
    <div className="fade-in">
      <InventoryHeader 
        onConfigureCards={() => setShowConfigureCards(true)}
        onRegisterItem={() => setShowAddModal(true)}
      />

      <StatsGrid 
        totalStockQty={totalStockQty}
        netInventoryVal={netInventoryVal}
        lowStockAlerts={lowStockAlerts}
        locationsCount={locationsCount}
        visibleCards={visibleCards}
      />

      <SearchFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCSV={handleExportCSV}
      />

      {/* CORE CONTENT BLOCK */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 700 }}>
          Retrieving stock ledgers...
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: '24px' }}>
          <Box size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.1rem', margin: 0 }}>No Stock Matches</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', fontWeight: 600 }}>We couldn't locate any active inventory items matching your constraints.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <InventoryGrid 
          items={filteredItems}
          onSelectItem={setSelectedItem}
        />
      ) : (
        <InventoryTable 
          items={filteredItems}
          onSelectItem={setSelectedItem}
        />
      )}

      {/* DETAIL DRAWER */}
      {selectedItem && (
        <InventoryDrawer 
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRecordStockAdjustment={() => setShowAdjustModal(true)}
          onStockTransfer={() => setShowTransferModal(true)}
        />
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {showAdjustModal && selectedItem && (
        <AdjustModal 
          selectedItem={selectedItem}
          onClose={() => setShowAdjustModal(false)}
          onSubmit={handleStockAdjustment}
        />
      )}

      {/* MODAL: STOCK TRANSFER */}
      {showTransferModal && selectedItem && (
        <TransferModal 
          selectedItem={selectedItem}
          onClose={() => setShowTransferModal(false)}
          onSubmit={handleStockTransfer}
        />
      )}

      {/* MODAL: REGISTER NEW ITEM */}
      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddItem}
        />
      )}

      {/* CONFIGURE CARDS MODAL */}
      {showConfigureCards && (
        <MetricsConfigModal 
          onClose={() => setShowConfigureCards(false)}
          visibleCards={visibleCards}
          onChange={(key, val) => setVisibleCards(prev => ({ ...prev, [key]: val }))}
        />
      )}

      {/* TOAST CONTAINER */}
      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};
