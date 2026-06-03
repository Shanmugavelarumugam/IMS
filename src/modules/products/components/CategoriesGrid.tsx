import React from 'react';
import { Folder } from 'lucide-react';
import type { Category } from '../types';

interface CategoriesGridProps {
  categories: Category[];
  onSelectCategory: (cat: Category) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  onSelectCategory
}) => {
  return (
    <div className="cat-category-grid">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="cat-category-card-premium"
          onClick={() => onSelectCategory(cat)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px', color: '#8b5cf6' }}>
              <Folder size={20} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className={`cat-status-badge ${cat.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                {cat.status}
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            {cat.name}
          </h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '12px' }}>
            {cat.code}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, minHeight: '44px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            {cat.description}
          </p>

          <div style={{ height: '1.5px', background: '#f1f5f9', margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 850, color: '#334155' }}>
              {cat.totalProducts} linked SKUs
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
              {cat.taxRate}% GST
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
