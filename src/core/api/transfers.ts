/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

/**
 * Stock Transfer & Logistics API
 * Manages dynamic redistribution of stock between physical facilities/branches.
 */
export const transfersApi = {
  
  listTransfers: () => 
    apiClient.get('/tenant/transfers'),

  createTransfer: (payload: any) => 
    apiClient.post('/tenant/transfers', payload),

  getTransfer: (id: string) => 
    apiClient.get(`/tenant/transfers/${id}`),

  dispatchTransfer: (id: string) => 
    apiClient.post(`/tenant/transfers/${id}/dispatch`),

  receiveTransfer: (id: string) => 
    apiClient.post(`/tenant/transfers/${id}/receive`),

  cancelTransfer: (id: string) => 
    apiClient.post(`/tenant/transfers/${id}/cancel`),
};
