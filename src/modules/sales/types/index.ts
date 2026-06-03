/* types/index.ts */

export interface SalesItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: 'PENDING_DISPATCH' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  dispatchDate: string;
  paymentMode: 'UPI' | 'Card' | 'Bank Transfer' | 'Net Banking' | 'Cash';
  items: SalesItem[];
  totalAmount: number;
  discountPercentage: number;
  taxAmount: number;
  notes?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}
