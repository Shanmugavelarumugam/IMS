/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, API_BASE_URL, handleResponse, getAuthHeaders } from './client';

export interface LoginPayload {
  email: string;
  password: string;
  companyCode?: string;
}

export const authApi = {
  register: (payload: any) => apiClient.post('/auth/register', payload),

  login: async (payload: LoginPayload) => {
    // Internal direct fetch here purely because we manually parse specific successful results to store local keys.
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_session', JSON.stringify(data.user));
    
    if (data.business) {
      localStorage.setItem('business_session', JSON.stringify(data.business));
    } else {
      localStorage.removeItem('business_session');
    }
    return data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await handleResponse(res);
    localStorage.setItem('access_token', data.accessToken);
    return data;
  },
  
  logout: async () => {
    try {
      if (localStorage.getItem('is_guest') !== 'true') {
        const res = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        await handleResponse(res);
      }
    } catch {
      // Silently handled if server fails. State is cleared natively below.
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_session');
      localStorage.removeItem('business_session');
      localStorage.removeItem('is_guest');
    }
  },

  changePassword: (payload: any) => apiClient.patch('/auth/change-password', payload),
  forgotPassword: (payload: any) => apiClient.post('/auth/forgot-password', payload),
  resetPassword: (payload: any) => apiClient.post('/auth/reset-password', payload),
  getProfile: async () => {
    if (localStorage.getItem('is_guest') === 'true') {
      return JSON.parse(localStorage.getItem('user_session') || '{}');
    }
    return apiClient.get('/auth/me');
  },
  updateProfile: async (payload: any) => {
    if (localStorage.getItem('is_guest') === 'true') {
      const current = JSON.parse(localStorage.getItem('user_session') || '{}');
      const updated = { ...current, ...payload };
      localStorage.setItem('user_session', JSON.stringify(updated));
      return updated;
    }
    return apiClient.patch('/auth/me', payload);
  },
  validateToken: async () => {
    if (localStorage.getItem('is_guest') === 'true') {
      return { valid: true };
    }
    return apiClient.get('/auth/validate');
  },
  getPermissions: async () => {
    if (localStorage.getItem('is_guest') === 'true') {
      return ['READ_ALL', 'WRITE_ALL'];
    }
    return apiClient.get('/auth/permissions');
  },
  discoverWorkspaces: (email: string) => apiClient.post('/auth/discover-workspaces', { email }),
  
  googleLogin: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await handleResponse(res);
    
    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user_session', JSON.stringify(data.user));
      
      if (data.business) {
        localStorage.setItem('business_session', JSON.stringify(data.business));
      } else {
        localStorage.removeItem('business_session');
      }
    }
    return data;
  },

  googleOnboard: async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/google-onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_session', JSON.stringify(data.user));
    
    if (data.business) {
      localStorage.setItem('business_session', JSON.stringify(data.business));
    } else {
      localStorage.removeItem('business_session');
    }
    return data;
  },
};
