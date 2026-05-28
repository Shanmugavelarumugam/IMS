import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Boxes, Box, AlertTriangle, Building2, CheckCircle2,
  X, ArrowRightLeft, Calendar, ArrowUpRight, ArrowDownLeft,
  Grid, Table, Download, Settings, BarChart2, PlusCircle
} from 'lucide-react';

interface WarehouseStock {
  warehouseName: string;
  qty: number;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  price: number; // Unit price
  minStockLevel: number;
  status: 'ACTIVE' | 'INACTIVE';
  warehouses: WarehouseStock[];
  lastAudited: string;
  ledger: {
    id: string;
    date: string;
    type: 'adjustment' | 'transfer' | 'audit';
    label: string;
    amount: number;
    isCredit: boolean;
  }[];
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

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

export const Inventory = () => {
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

  // Adjust Form state
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustWarehouse, setAdjustWarehouse] = useState('');

  // Transfer Form state
  const [transferAmount, setTransferAmount] = useState('');
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');

  // Add Item Form State
  const [addSku, setAddSku] = useState('');
  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState('Hardware & Devices');
  const [addQty, setAddQty] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addMinStock, setAddMinStock] = useState('10');
  const [addWarehouse, setAddWarehouse] = useState('Mumbai Central Hub');

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
  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qtyVal = parseInt(adjustAmount, 10) || 0;
    if (qtyVal <= 0) {
      addToast('error', 'Adjustment quantity must be greater than 0');
      return;
    }

    if (!adjustWarehouse) {
      addToast('error', 'Please select a warehouse location');
      return;
    }

    const isCredit = adjustType === 'add';
    const signedQty = isCredit ? qtyVal : -qtyVal;

    // Check if enough stock in warehouse
    const currentWarehouse = selectedItem.warehouses.find(w => w.warehouseName === adjustWarehouse);
    const currentWhQty = currentWarehouse ? currentWarehouse.qty : 0;

    if (!isCredit && currentWhQty < qtyVal) {
      addToast('error', `Insufficient quantity at selected warehouse (Available: ${currentWhQty})`);
      return;
    }

    const newLedgerEntry = {
      id: `il-adj-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'adjustment' as const,
      label: adjustNotes.trim() || `Manual Adjustment (${isCredit ? 'Added' : 'Subtracted'}) at ${adjustWarehouse}`,
      amount: qtyVal,
      isCredit
    };

    const updated = items.map((item) => {
      if (item.id === selectedItem.id) {
        // Adjust warehouse qty
        let whExists = false;
        let nextWhs = item.warehouses.map((wh) => {
          if (wh.warehouseName === adjustWarehouse) {
            whExists = true;
            return { ...wh, qty: Math.max(0, wh.qty + signedQty) };
          }
          return wh;
        });

        if (!whExists && isCredit) {
          nextWhs.push({ warehouseName: adjustWarehouse, qty: qtyVal });
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
    setAdjustAmount('');
    setAdjustNotes('');
    setShowAdjustModal(false);
  };

  // Stock Transfer between Warehouses
  const handleStockTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qtyVal = parseInt(transferAmount, 10) || 0;
    if (qtyVal <= 0) {
      addToast('error', 'Transfer quantity must be greater than 0');
      return;
    }

    if (!transferFrom || !transferTo) {
      addToast('error', 'Please define valid source and destination branches');
      return;
    }

    if (transferFrom === transferTo) {
      addToast('error', 'Source and destination branches cannot be the same');
      return;
    }

    const sourceWh = selectedItem.warehouses.find(w => w.warehouseName === transferFrom);
    if (!sourceWh || sourceWh.qty < qtyVal) {
      addToast('error', `Insufficient quantities at source depot "${transferFrom}" (Available: ${sourceWh?.qty || 0})`);
      return;
    }

    const newLedgerEntry = {
      id: `il-tr-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'transfer' as const,
      label: `Transferred ${qtyVal} units from "${transferFrom}" to "${transferTo}"`,
      amount: qtyVal,
      isCredit: true
    };

    const updated = items.map((item) => {
      if (item.id === selectedItem.id) {
        let destExists = false;
        const nextWhs = item.warehouses.map((wh) => {
          if (wh.warehouseName === transferFrom) {
            return { ...wh, qty: wh.qty - qtyVal };
          }
          if (wh.warehouseName === transferTo) {
            destExists = true;
            return { ...wh, qty: wh.qty + qtyVal };
          }
          return wh;
        });

        if (!destExists) {
          nextWhs.push({ warehouseName: transferTo, qty: qtyVal });
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
    setTransferAmount('');
    setShowTransferModal(false);
  };

  // Add Item to Inventory
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSku.trim() || !addName.trim()) {
      addToast('error', 'SKU and Item Name are mandatory fields');
      return;
    }

    const quantity = parseInt(addQty, 10) || 0;
    const unitPrice = parseFloat(addPrice) || 0;

    const newItem: InventoryItem = {
      id: `inv-${Math.random().toString(36).substring(2, 9)}`,
      sku: addSku.toUpperCase().trim(),
      name: addName.trim(),
      category: addCategory,
      qty: quantity,
      price: unitPrice,
      minStockLevel: parseInt(addMinStock, 10) || 0,
      status: 'ACTIVE',
      warehouses: [
        { warehouseName: addWarehouse, qty: quantity }
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
    addToast('success', `Item "${addName}" registered into active inventory`);
    setAddSku('');
    setAddName('');
    setAddQty('');
    setAddPrice('');
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

  const cardDefinitions = [
    {
      id: 'total_qty',
      label: 'Total Stock Quantity',
      value: totalStockQty.toLocaleString('en-IN'),
      subtext: 'Aggregated physical units',
      icon: Boxes,
      className: 'blue',
      color: '#6366f1'
    },
    {
      id: 'net_value',
      label: 'Net Inventory Value',
      value: `₹${netInventoryVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Asset valuation',
      icon: BarChart2,
      className: 'emerald',
      color: '#059669'
    },
    {
      id: 'alerts',
      label: 'Critical Shortages',
      value: lowStockAlerts,
      subtext: 'Below minimum thresholds',
      icon: AlertTriangle,
      className: 'rose',
      color: '#e11d48',
      valueColor: lowStockAlerts > 0 ? '#e11d48' : '#0f172a'
    },
    {
      id: 'locations',
      label: 'Warehousing Depots',
      value: locationsCount,
      subtext: 'Active supply branches',
      icon: Building2,
      className: 'purple',
      color: '#8b5cf6'
    }
  ];

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

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .inventory-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 26px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.015);
        }
        .inventory-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 22px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.25);
        }

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

        .shortage-warning {
          background: #fff1f2;
          border: 1px solid #ffe4e6;
          color: #be123c;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .healthy-stock {
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          color: #059669;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

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
          width: 480px;
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
          width: 480px;
          max-width: 90%;
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

      {/* TOP HUB TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '6px' }}>
            <Boxes size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Logistics Command</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Stock Balance Hub</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 600, fontSize: '0.94rem' }}>Audit physical quantities, execute multi-depot stock transfers, and direct asset valuation metrics.</p>
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
            <Plus size={20} /> Register Item
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="stats-grid">
        {cardDefinitions.map((c) => {
          if (!visibleCards[c.id as keyof typeof visibleCards]) return null;
          const Icon = c.icon;
          return (
            <div key={c.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{c.label}</div>
                <div className="stat-card-value" style={{ color: c.valueColor || '#0f172a' }}>{c.value}</div>
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
            placeholder="Search stock balances by SKU, name or category..." 
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
          <button onClick={() => setActiveTab('shortage')} className={`filter-tab ${activeTab === 'shortage' ? 'active' : ''}`}>Shortage Alerts</button>
          <button onClick={() => setActiveTab('overstock')} className={`filter-tab ${activeTab === 'overstock' ? 'active' : ''}`}>Overstocked</button>
          <button onClick={() => setActiveTab('healthy')} className={`filter-tab ${activeTab === 'healthy' ? 'active' : ''}`}>Healthy Stock</button>
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
        <div className="inventory-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="inventory-card-premium"
              onClick={() => setSelectedItem(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366f1', background: '#f0f3ff', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                  {item.sku}
                </span>
                {item.qty <= item.minStockLevel ? (
                  <span className="shortage-warning">
                    <AlertTriangle size={12} /> Low Stock
                  </span>
                ) : (
                  <span className="healthy-stock">
                    <CheckCircle2 size={12} /> Healthy
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                {item.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, margin: '0 0 16px 0' }}>
                {item.category}
              </p>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>In-Stock Qty</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{item.qty} units</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Net Valuation</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
                    ₹{(item.qty * item.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div style={{ height: '1.5px', background: '#f1f5f9', marginBottom: '14px' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>
                <span>{item.warehouses.length} Depot Allocations</span>
                <span>Audited: {item.lastAudited}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>In-Stock Qty</th>
                <th>Unit Price</th>
                <th>Asset Valuation</th>
                <th>Alert Status</th>
                <th style={{ textAlign: 'right' }}>Audited On</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} onClick={() => setSelectedItem(item)}>
                  <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{item.sku}</td>
                  <td>{item.name}</td>
                  <td style={{ color: '#64748b', fontWeight: 650 }}>{item.category}</td>
                  <td style={{ fontWeight: 800 }}>{item.qty} units</td>
                  <td style={{ color: '#475569' }}>₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontWeight: 850, color: '#059669' }}>₹{(item.qty * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    {item.qty <= item.minStockLevel ? (
                      <span className="shortage-warning">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="healthy-stock">
                        <CheckCircle2 size={12} /> Healthy
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>{item.lastAudited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedItem && (
        <div className="drawer-overlay" onClick={() => setSelectedItem(null)}>
          <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className={`shortage-warning`} style={{ background: selectedItem.qty <= selectedItem.minStockLevel ? '#fff1f2' : '#ecfdf5', color: selectedItem.qty <= selectedItem.minStockLevel ? '#be123c' : '#059669', borderColor: selectedItem.qty <= selectedItem.minStockLevel ? '#ffe4e6' : '#d1fae5' }}>
                {selectedItem.qty <= selectedItem.minStockLevel ? 'Low Stock Level Alert' : 'Healthy Asset Level'}
              </span>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#f0f3ff', padding: '12px', borderRadius: '14px', color: '#6366f1' }}>
                <Box size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{selectedItem.name}</h2>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginTop: '2px' }}>
                  {selectedItem.sku}
                </div>
              </div>
            </div>

            {/* Warehouse Allocation Breakdown */}
            <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
              Depot Stock Allocation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selectedItem.warehouses.map((wh, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} color="#64748b" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{wh.warehouseName}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 850, color: '#0f172a' }}>{wh.qty} units</span>
                </div>
              ))}
            </div>

            {/* Transaction Ledger */}
            <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
              Physical Audit & Transaction Ledger
            </h3>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedItem.ledger?.map((entry) => (
                <div key={entry.id} style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{entry.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 650, marginTop: '4px' }}>
                      <Calendar size={12} /> {entry.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 850, color: entry.isCredit ? '#059669' : '#e11d48' }}>
                    {entry.isCredit ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                    {entry.amount} U
                  </div>
                </div>
              ))}
            </div>

            {/* Ledger Operations Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button 
                onClick={() => {
                  setAdjustWarehouse(selectedItem.warehouses[0]?.warehouseName || 'Mumbai Central Hub');
                  setShowAdjustModal(true);
                }}
                style={{ 
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  padding: '12px', borderRadius: '14px', border: 'none', background: '#6366f1',
                  color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', outline: 'none',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                }}
              >
                <PlusCircle size={18} /> Record Stock Adjustment
              </button>

              <button 
                onClick={() => {
                  setTransferFrom(selectedItem.warehouses[0]?.warehouseName || '');
                  setTransferTo(selectedItem.warehouses[1]?.warehouseName || '');
                  setShowTransferModal(true);
                }}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', 
                  borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#ffffff',
                  color: '#475569', cursor: 'pointer', outline: 'none'
                }}
                title="Transfer stock between branches"
              >
                <ArrowRightLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {showAdjustModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Record Stock Adjustment</h2>
              <button 
                onClick={() => setShowAdjustModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleStockAdjustment}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Select Depot / Location</label>
                <select 
                  value={adjustWarehouse} 
                  onChange={(e) => setAdjustWarehouse(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  {selectedItem?.warehouses.map((wh, idx) => (
                    <option key={idx} value={wh.warehouseName}>{wh.warehouseName} (Available: {wh.qty})</option>
                  ))}
                  <option value="Mumbai Central Hub">Mumbai Central Hub (Add New)</option>
                  <option value="Bangalore Tech Park Depot">Bangalore Tech Park Depot (Add New)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Adjustment Type</label>
                  <select 
                    value={adjustType} 
                    onChange={(e) => setAdjustType(e.target.value as 'add' | 'subtract')}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="add">Add (+)</option>
                    <option value="subtract">Subtract (-)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Adjustment Quantity</label>
                  <input 
                    type="number" 
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="e.g. 15"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Adjustment Log Note</label>
                <input 
                  type="text" 
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Reconciled during monthly stock count audit"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAdjustModal(false)}
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
                  Execute Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK TRANSFER */}
      {showTransferModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Stock Transfer</h2>
              <button 
                onClick={() => setShowTransferModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleStockTransfer}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Source branch</label>
                <select 
                  value={transferFrom} 
                  onChange={(e) => setTransferFrom(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Choose Source --</option>
                  {selectedItem?.warehouses.map((wh, idx) => (
                    <option key={idx} value={wh.warehouseName}>{wh.warehouseName} (Qty: {wh.qty})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Destination branch</label>
                <select 
                  value={transferTo} 
                  onChange={(e) => setTransferTo(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Choose Destination --</option>
                  <option value="Mumbai Central Hub">Mumbai Central Hub</option>
                  <option value="Bangalore Tech Park Depot">Bangalore Tech Park Depot</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Quantity to Transfer</label>
                <input 
                  type="number" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="e.g. 5"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)}
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
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW ITEM */}
      {showAddModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Register Inventory Item</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddItem}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>SKU Code</label>
                  <input 
                    type="text" 
                    value={addSku}
                    onChange={(e) => setAddSku(e.target.value)}
                    placeholder="e.g. SKU-DELL-32"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Item Name</label>
                  <input 
                    type="text" 
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="Dell UltraSharp 32'' Monitor"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Category</label>
                <select 
                  value={addCategory} 
                  onChange={(e) => setAddCategory(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="Hardware & Devices">Hardware & Devices</option>
                  <option value="Office Peripherals">Office Peripherals</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Corporate Workspace">Corporate Workspace</option>
                  <option value="Enterprise Software">Enterprise Software</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Initial Qty</label>
                  <input 
                    type="number" 
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    placeholder="e.g. 50"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Unit Price (₹)</label>
                  <input 
                    type="number" 
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                    placeholder="e.g. 74900"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Min Stock level</label>
                  <input 
                    type="number" 
                    value={addMinStock}
                    onChange={(e) => setAddMinStock(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Initial Depot</label>
                  <select 
                    value={addWarehouse} 
                    onChange={(e) => setAddWarehouse(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="Mumbai Central Hub">Mumbai Central Hub</option>
                    <option value="Bangalore Tech Park Depot">Bangalore Tech Park Depot</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
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
                  Register Item
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

            <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: 16 }}>Select which KPI metric cards to display on top of the Stock balance hub.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {Object.keys(visibleCards).map((key) => {
                const label = key === 'total_qty' ? 'Total Stock Quantity' :
                              key === 'net_value' ? 'Net Inventory Value' :
                              key === 'alerts' ? 'Critical Shortages' : 'Warehousing Depots';
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

      {/* TOAST CONTAINER */}
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
