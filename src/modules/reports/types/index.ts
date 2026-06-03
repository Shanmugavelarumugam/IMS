/* types/index.ts */

export interface ReportItem {
  id: string;
  name: string;
  category: 'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax';
  generatedBy: string;
  dateGenerated: string;
  description: string;
  frequency: 'Real-time' | 'Daily' | 'Monthly' | 'Quarterly' | 'Custom';
  fileSize: string;
  status?: 'Processing' | 'Ready';
  favorite?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}
