/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

export const suppliersApi = {
  // CRM & Core Management
  findAll: () => apiClient.get('/tenant/suppliers'),
  
  findById: (id: string) => apiClient.get(`/tenant/suppliers/${id}`),
  
  create: (payload: any) => apiClient.post('/tenant/suppliers', payload),
  
  update: (id: string, payload: any) => apiClient.patch(`/tenant/suppliers/${id}`, payload),
  
  // Vendor Ledgers & Debt Control
  getLedger: (id: string) => apiClient.get(`/tenant/suppliers/${id}/ledger`),
  
  addLedgerPayment: (id: string, payload: { amount: number; reference?: string; notes?: string }) => 
    apiClient.post(`/tenant/suppliers/${id}/ledger/payment`, payload),
    
  // Analytics
  getAnalytics: () => apiClient.get('/tenant/suppliers/analytics'),
};
