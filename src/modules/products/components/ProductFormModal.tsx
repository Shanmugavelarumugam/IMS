import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../types';

interface ProductFormModalProps {
  editingProduct: Product | null;
  onClose: () => void;
  onSubmit: (
    name: string,
    sku: string,
    barcode: string,
    category: string,
    price: string,
    stock: string,
    minStock: string,
    status: 'ACTIVE' | 'INACTIVE'
  ) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  editingProduct,
  onClose,
  onSubmit
}) => {
  const [formName, setFormName] = useState(editingProduct?.name || '');
  const [formSku, setFormSku] = useState(editingProduct?.sku || '');
  const [formBarcode, setFormBarcode] = useState(editingProduct?.barcode || '');
  const [formCategory, setFormCategory] = useState(editingProduct?.category?.name || 'Hardware');
  const [formPrice, setFormPrice] = useState(editingProduct?.price.toString() || '999');
  const [formStock, setFormStock] = useState(editingProduct?.stockQty.toString() || '10');
  const [formMinStock, setFormMinStock] = useState(editingProduct?.minStockLevel.toString() || '5');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>(editingProduct?.status || 'ACTIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      formName,
      formSku,
      formBarcode,
      formCategory,
      formPrice,
      formStock,
      formMinStock,
      formStatus
    );
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            {editingProduct ? 'Update SKU Specification' : 'Add Product'}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            <div className="premium-input-group">
              <label>Product Name / Model</label>
              <input 
                type="text" 
                className="premium-input" 
                value={formName} 
                onChange={e => setFormName(e.target.value)} 
                placeholder="e.g. Dell Precision 5570 Laptop"
                required
              />
            </div>

            <div className="form-grid">
              <div className="premium-input-group">
                <label>SKU Code</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  value={formSku} 
                  onChange={e => setFormSku(e.target.value)} 
                  placeholder="e.g. LAP-DELL-5570"
                  required
                />
              </div>
              <div className="premium-input-group">
                <label>Universal Barcode</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  value={formBarcode} 
                  onChange={e => setFormBarcode(e.target.value)} 
                  placeholder="e.g. 890123019"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="premium-input-group">
                <label>Classification Category</label>
                <select 
                  className="premium-input"
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  style={{ background: '#ffffff', cursor: 'pointer' }}
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Software">Software</option>
                  <option value="Networking">Networking</option>
                  <option value="Cloud Infra">Cloud Infra</option>
                  <option value="Office">Office</option>
                </select>
              </div>
              <div className="premium-input-group">
                <label>System Status</label>
                <select 
                  className="premium-input"
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                  style={{ background: '#ffffff', cursor: 'pointer' }}
                >
                  <option value="ACTIVE">ACTIVE (Enabled)</option>
                  <option value="INACTIVE">INACTIVE (Archived)</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="premium-input-group">
                <label>Unit Catalog Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="premium-input" 
                  value={formPrice} 
                  onChange={e => setFormPrice(e.target.value)} 
                  placeholder="999"
                  required
                />
              </div>
              <div className="premium-input-group">
                <label>Minimum Stock Alert Level</label>
                <input 
                  type="number" 
                  className="premium-input" 
                  value={formMinStock} 
                  onChange={e => setFormMinStock(e.target.value)} 
                  placeholder="5"
                  required
                />
              </div>
            </div>

            {!editingProduct && (
              <div className="premium-input-group">
                <label>Initial Opening Stock Quantity (Units)</label>
                <input 
                  type="number" 
                  className="premium-input" 
                  value={formStock} 
                  onChange={e => setFormStock(e.target.value)} 
                  placeholder="10"
                  required
                />
              </div>
            )}
          </div>

          <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
              }}
            >
              {editingProduct ? 'Save Specifications' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
