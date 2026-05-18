/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './client';

/**
 * Core Product & Taxonomy API Service
 * Manages standard SKU lifecycle and the relational taxonomy grid (Categories, Brands, Units).
 */
export const productsApi = {
  
  // 📦 1. Core Catalog
  listProducts: (params?: any) => {
    const q = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/tenant/products${q ? `?${q}` : ''}`);
  },
  createProduct: (payload: any) => 
    apiClient.post('/tenant/products', payload),
  getProduct: (id: string) => 
    apiClient.get(`/tenant/products/${id}`),
  updateProduct: (id: string, payload: any) => 
    apiClient.patch(`/tenant/products/${id}`, payload),
  duplicateProduct: (id: string) => 
    apiClient.post(`/tenant/products/${id}/duplicate`),
  generateBarcode: (id: string) => 
    apiClient.post(`/tenant/products/barcode/${id}`),
  setProductStatus: (id: string, status: string) => 
    apiClient.patch(`/tenant/products/${id}/status`, { status }),
  bulkImport: (dataset: any[]) => 
    apiClient.post('/tenant/products/bulk-import', dataset),

  // 🏷️ 2. Categorical Taxonomies
  listCategories: () => 
    apiClient.get('/tenant/products/categories'),
  createCategory: (payload: any) => 
    apiClient.post('/tenant/products/categories', payload),
  updateCategory: (id: string, payload: any) => 
    apiClient.patch(`/tenant/products/categories/${id}`, payload),
  deleteCategory: (id: string) => 
    apiClient.delete(`/tenant/products/categories/${id}`),

  // 🏭 3. Manufacturer Brands
  listBrands: () => 
    apiClient.get('/tenant/products/brands'),
  createBrand: (payload: any) => 
    apiClient.post('/tenant/products/brands', payload),
  updateBrand: (id: string, payload: any) => 
    apiClient.patch(`/tenant/products/brands/${id}`, payload),
  deleteBrand: (id: string) => 
    apiClient.delete(`/tenant/products/brands/${id}`),

  // 📏 4. Units of Measure
  listUnits: () => 
    apiClient.get('/tenant/products/units'),
  createUnit: (payload: any) => 
    apiClient.post('/tenant/products/units', payload),
  updateUnit: (id: string, payload: any) => 
    apiClient.patch(`/tenant/products/units/${id}`, payload),
  deleteUnit: (id: string) => 
    apiClient.delete(`/tenant/products/units/${id}`),
};
