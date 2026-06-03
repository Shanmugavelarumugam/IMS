export interface WarehouseStock {
  warehouseName: string;
  qty: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: 'adjustment' | 'transfer' | 'audit';
  label: string;
  amount: number;
  isCredit: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  price: number;
  minStockLevel: number;
  status: 'ACTIVE' | 'INACTIVE';
  warehouses: WarehouseStock[];
  lastAudited: string;
  ledger: LedgerEntry[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}
