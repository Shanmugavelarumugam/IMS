import React from 'react';
import { Box, ExternalLink } from 'lucide-react';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (prod: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct
}) => {
  return (
    <div className="product-grid">
      {products.map((prod) => {
        const isLow = prod.stockQty > 0 && prod.stockQty <= prod.minStockLevel;
        const isOut = prod.stockQty <= 0;
        return (
          <div 
            key={prod.id} 
            className="product-card-premium"
            onClick={() => onSelectProduct(prod)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ height: '44px', width: '44px', background: 'linear-gradient(135deg, #f0f3ff 0%, #e0e7ff 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Box size={22} />
              </div>
              <div>
                {isOut ? (
                  <span className="status-pill" style={{ background: '#ffe4e6', color: '#e11d48' }}>Out of Stock</span>
                ) : isLow ? (
                  <span className="status-pill" style={{ background: '#fef3c7', color: '#d97706' }}>Low Stock</span>
                ) : (
                  <span className="status-pill" style={{ background: '#ecfdf5', color: '#059669' }}>Active</span>
                )}
              </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', lineBreak: 'anywhere' }}>{prod.name}</h3>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              <code style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px' }}>
                {prod.sku}
              </code>
              <span className="category-pill" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                {prod.category?.name}
              </span>
            </div>

            <div className="stock-pill-premium" style={{ marginBottom: '18px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>In Stock</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: isOut ? '#e11d48' : isLow ? '#d97706' : '#0f172a' }}>
                  {prod.stockQty} Units
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Min Alert</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{prod.minStockLevel} U</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 950, color: '#0f172a' }}>
                ₹{prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                View specs <ExternalLink size={12} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
