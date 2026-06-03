import React from 'react';
import { Edit3 } from 'lucide-react';
import type { Category } from '../types';

interface CategoriesTableProps {
  categories: Category[];
  onSelectCategory: (cat: Category) => void;
  onEditCategory: (cat: Category, e: React.MouseEvent) => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  onSelectCategory,
  onEditCategory
}) => {
  return (
    <div className="cat-premium-table-container">
      <table className="cat-premium-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Linked SKUs</th>
            <th>Tax Rate</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} onClick={() => onSelectCategory(cat)}>
              <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{cat.code}</td>
              <td>{cat.name}</td>
              <td style={{ color: '#64748b', fontWeight: 500, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cat.description}
              </td>
              <td style={{ fontWeight: 800 }}>{cat.totalProducts} SKUs</td>
              <td style={{ color: '#0f172a', fontWeight: 750 }}>{cat.taxRate}% GST</td>
              <td>
                <span className={`cat-status-badge ${cat.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                  {cat.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => onEditCategory(cat, e)}
                  className="cat-table-action-btn"
                >
                  <Edit3 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
