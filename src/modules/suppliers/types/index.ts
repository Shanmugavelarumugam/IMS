export interface LedgerEntry {
  id: string;
  date: string;
  type: 'invoice' | 'payment';
  label: string;
  amount: number;
  isCredit: boolean;
}

export interface Supplier {
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

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}
