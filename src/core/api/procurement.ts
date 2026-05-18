/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

export const procurementApi = {
  // Purchase Orders (PO)
  listPOs: () => apiClient.get('/procurement/po'),
  
  createPO: (payload: any) => apiClient.post('/procurement/po', payload),
  
  updatePOStatus: (id: string, status: string) => 
    apiClient.patch(`/procurement/po/${id}/status`, { status }),

  // Goods Receipt Note (GRN)
  listGRNs: () => apiClient.get('/procurement/grn'),
  
  createGRN: (payload: any) => apiClient.post('/procurement/grn', payload),

  // Invoices & Finance
  listInvoices: () => apiClient.get('/procurement/invoices'),
  
  createInvoice: (payload: any) => apiClient.post('/procurement/invoices', payload),
  
  recordPayment: (payload: any) => apiClient.post('/procurement/payments', payload),

  // Analytics & Monitoring
  getAnalytics: () => apiClient.get('/procurement/analytics'),
};
