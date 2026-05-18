/* eslint-disable @typescript-eslint/no-explicit-any */
export const API_BASE_URL = 'http://localhost:3005/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Global authorization purge. Token expired/invalidated.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_session');
    localStorage.removeItem('business_session');
    // Force redirect to landing/login if we are not already there
    if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
       window.location.href = '/';
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Server communication failure' }));
    throw new Error(errorData.message || 'Request was unsuccessful');
  }
  return response.status === 204 ? null : response.json();
};

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  post: async (endpoint: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },
  patch: async (endpoint: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },
  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
