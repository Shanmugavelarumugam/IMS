import React from 'react';
import { Plus, Download } from 'lucide-react';

interface ProductsHeaderProps {
  onExport: () => void;
  onAddProduct: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  onExport,
  onAddProduct
}) => {
  return (
    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '2.0rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>Product Catalog</h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.94rem', fontWeight: 550 }}>Manage products, inventory levels, pricing, and category organization.</p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={onExport} 
          className="table-action-btn" 
          style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ffffff', color: '#64748b' }}
          title="Export CSV"
        >
          <Download size={18} />
        </button>
        <button 
          onClick={onAddProduct}
          className="btn-primary" 
          style={{ 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
          }}
        >
          <Plus size={18} strokeWidth={2.5} /> Add Product
        </button>
      </div>
    </div>
  );
};
