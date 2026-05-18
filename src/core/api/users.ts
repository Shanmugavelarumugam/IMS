/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

/**
 * Internal Staff / User Management API
 * Primarily utilized by Tenant Admins to maintain their branch workspace workforce.
 */
export const usersApi = {
  
  createUser: (payload: any) => 
    apiClient.post('/users', payload),

  listUsers: (params?: { page?: number, limit?: number }) => {
    const q = params ? new URLSearchParams(params as any).toString() : '';
    return apiClient.get(`/users${q ? `?${q}` : ''}`);
  },

  getUser: (id: string) => 
    apiClient.get(`/users/${id}`),

  updateUser: (id: string, payload: any) => 
    apiClient.patch(`/users/${id}`, payload),

  updateUserRole: (id: string, roleId: string) => 
    apiClient.patch(`/users/${id}/role`, { roleId }),

  deactivateUser: (id: string) => 
    apiClient.patch(`/users/${id}/deactivate`),

  activateUser: (id: string) => 
    apiClient.patch(`/users/${id}/activate`),
};
