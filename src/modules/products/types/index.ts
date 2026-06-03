export interface LedgerEntry {
  id: string;
  date: string;
  type: 'adjustment' | 'sale' | 'purchase';
  label: string;
  amount: number;
  isCredit: boolean;
}

export interface Product {
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

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  totalProducts: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  taxRate: number;
  notes?: string;
}
