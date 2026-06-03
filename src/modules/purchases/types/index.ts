/* types/index.ts */

export interface POItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  deliveryDate: string;
  warehouseBranch: string;
  items: POItem[];
  totalAmount: number;
  notes?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}
