/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

/**
 * Core Platform & Tenant Management API Service
 */
export const platformApi = {
  
  // 🔑 1. Root Bootstrap
  bootstrapRoot: (payload: any) => 
    apiClient.post('/platform/root/bootstrap', payload),

  // ⚙️ 2. Platform Admin Management
  listAdmins: (params?: { page?: number, limit?: number, search?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiClient.get(`/platform/admins${q ? `?${q}` : ''}`);
  },
  createAdmin: (payload: any) => 
    apiClient.post('/platform/admins', payload),
  getAdmin: (id: string) => 
    apiClient.get(`/platform/admins/${id}`),
  updateAdmin: (id: string, payload: any) => 
    apiClient.patch(`/platform/admins/${id}`, payload),
  deleteAdmin: (id: string) => 
    apiClient.delete(`/platform/admins/${id}`),
  suspendAdmin: (id: string) => 
    apiClient.post(`/platform/admins/${id}/suspend`),
  activateAdmin: (id: string) => 
    apiClient.post(`/platform/admins/${id}/activate`),
  resetAdminPassword: (id: string, payload: any) => 
    apiClient.post(`/platform/admins/${id}/reset-password`, payload),

  // 🏢 3. Tenant Management
  listTenants: (params?: any) => {
    const q = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/platform/tenants${q ? `?${q}` : ''}`);
  },
  createTenant: (payload: any) => 
    apiClient.post('/platform/tenants', payload),
  getTenant: (id: string) => 
    apiClient.get(`/platform/tenants/${id}`),
  updateTenant: (id: string, payload: any) => 
    apiClient.patch(`/platform/tenants/${id}`, payload),
  deleteTenant: (id: string) => 
    apiClient.delete(`/platform/tenants/${id}`),
  suspendTenant: (id: string) => 
    apiClient.post(`/platform/tenants/${id}/suspend`),
  activateTenant: (id: string) => 
    apiClient.post(`/platform/tenants/${id}/activate`),
  assignPlan: (id: string, payload: { planId: string }) => 
    apiClient.post(`/platform/tenants/${id}/assign-plan`, payload),
  getSubscription: (id: string) => 
    apiClient.get(`/platform/tenants/${id}/subscription`),
  getPayments: (id: string) => 
    apiClient.get(`/platform/tenants/${id}/payments`),
  getUserRoster: (id: string) => 
    apiClient.get(`/platform/tenants/${id}/users`),
  getRoles: (id: string) => 
    apiClient.get(`/platform/tenants/${id}/roles`),

  // 👥 4. Tenant User Management (Global)
  listTenantUsers: (params?: any) => {
    const q = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/platform/tenant-users${q ? `?${q}` : ''}`);
  },
  createTenantUser: (payload: any) => 
    apiClient.post('/platform/tenant-users', payload),
  getTenantUser: (id: string) => 
    apiClient.get(`/platform/tenant-users/${id}`),
  updateTenantUser: (id: string, payload: any) => 
    apiClient.patch(`/platform/tenant-users/${id}`, payload),
  resetTenantUserPassword: (id: string, payload: any) => 
    apiClient.post(`/platform/tenant-users/${id}/reset-password`, payload),
  deactivateTenantUser: (id: string) => 
    apiClient.patch(`/platform/tenant-users/${id}/deactivate`),
  activateTenantUser: (id: string) => 
    apiClient.patch(`/platform/tenant-users/${id}/activate`),

  // 💰 5. Subscription Plan Management
  listPlans: (params?: { status?: string }) => {
    const q = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/platform/subscription-plans${q ? `?${q}` : ''}`);
  },
  createPlan: (payload: any) => 
    apiClient.post('/platform/subscription-plans', payload),
  getPlan: (id: string) => 
    apiClient.get(`/platform/subscription-plans/${id}`),
  updatePlan: (id: string, payload: any) => 
    apiClient.patch(`/platform/subscription-plans/${id}`, payload),
  deletePlan: (id: string) => 
    apiClient.delete(`/platform/subscription-plans/${id}`),
  activatePlan: (id: string) => 
    apiClient.patch(`/platform/subscription-plans/${id}/activate`),
  deactivatePlan: (id: string) => 
    apiClient.patch(`/platform/subscription-plans/${id}/deactivate`),
  getPlanAnalytics: (id: string) => 
    apiClient.get(`/platform/subscription-plans/${id}/usage`),

  // 📋 6. Infrastructure Audit Monitoring
  listAuditLogs: (params?: any) => {
    const q = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/platform/audit-logs${q ? `?${q}` : ''}`);
  },

  // 📊 7. Analytical & Business Intelligence Aggregation
  getOverallStats: () => 
    apiClient.get('/platform/analytics/stats'),
  getRevenueChart: () => 
    apiClient.get('/platform/analytics/revenue-chart'),
  getDistribution: () => 
    apiClient.get('/platform/analytics/distribution'),
  getRecentRegistrations: () => 
    apiClient.get('/platform/analytics/recent-registrations'),
  getSystemReport: () => 
    apiClient.get('/platform/analytics/report/system'),
  getPaymentStream: () => 
    apiClient.get('/platform/analytics/payments'),
  getPaymentSummary: () => 
    apiClient.get('/platform/analytics/payments/summary'),

  // 🛠️ 8. Universal System Configuration
  getConfig: () => 
    apiClient.get('/platform/config'),
  updateConfig: (payload: any) => 
    apiClient.patch('/platform/config', payload),
};
