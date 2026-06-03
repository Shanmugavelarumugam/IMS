import React from 'react';
import { Box, MoreVertical } from 'lucide-react';
import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onSelectProduct: (prod: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSelectProduct
}) => {
  return (
    <div className="premium-table-container">
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>SKU / Barcode</th>
              <th>Category</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ width: '60px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => {
              const isLow = prod.stockQty > 0 && prod.stockQty <= prod.minStockLevel;
              const isOut = prod.stockQty <= 0;
              return (
                <tr key={prod.id} style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(prod)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ height: '40px', width: '40px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                        <Box size={20} />
                      </div>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{prod.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <code style={{ fontSize: '0.78rem', fontWeight: 850, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                        {prod.sku}
                      </code>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{prod.barcode || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-pill">
                      {prod.category?.name}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: isOut ? '#e11d48' : isLow ? '#d97706' : '#0f172a' }}>
                        {prod.stockQty} U
                      </span>
                      {isOut ? (
                        <div className="status-pill" style={{ background: '#ffe4e6', color: '#e11d48' }}>OOS</div>
                      ) : isLow ? (
                        <div className="status-pill" style={{ background: '#fef3c7', color: '#d97706' }}>LOW</div>
                      ) : (
                        <div className="status-pill" style={{ background: '#ecfdf5', color: '#059669' }}>OK</div>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
                    ₹{prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => onSelectProduct(prod)} className="table-action-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
