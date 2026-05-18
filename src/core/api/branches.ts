/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

/**
 * Multi-Facility & Branch Management API
 * Regulates logical mapping of Stores vs Warehouses and localized performance analytics.
 */
export const branchesApi = {
  
  listBranches: () => 
    apiClient.get('/tenant/branches'),

  createBranch: (payload: any) => 
    apiClient.post('/tenant/branches', payload),

  getBranchPerformance: () => 
    apiClient.get('/tenant/branches/performance'),

  getBranch: (id: string) => 
    apiClient.get(`/tenant/branches/${id}`),

  updateBranch: (id: string, payload: any) => 
    apiClient.patch(`/tenant/branches/${id}`, payload),

  getBranchInventory: (id: string) => 
    apiClient.get(`/tenant/branches/${id}/inventory`),

  assignUserToBranch: (id: string, userId: string) => 
    apiClient.post(`/tenant/branches/${id}/assign`, { userId }),
};
