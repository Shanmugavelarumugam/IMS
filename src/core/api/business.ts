import { apiClient } from './client';

/**
 * Business Context API Service
 * Used by Tenants to manage local configurations and workspace variables.
 */
export const businessApi = {
  
  // 💼 1. Context Profile
  getBusinessProfile: async () => {
    if (localStorage.getItem('is_guest') === 'true') {
      return JSON.parse(localStorage.getItem('business_session') || '{}');
    }
    return apiClient.get('/business/me');
  },
    
};
