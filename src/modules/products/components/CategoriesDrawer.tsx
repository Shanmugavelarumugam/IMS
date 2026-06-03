import React from 'react';
import { Folder, X, Info, Edit3, Trash2 } from 'lucide-react';
import type { Category } from '../types';

interface CategoriesDrawerProps {
  category: Category;
  onClose: () => void;
  onEdit: (cat: Category, e: React.MouseEvent) => void;
  onDelete: () => void;
}

export const CategoriesDrawer: React.FC<CategoriesDrawerProps> = ({
  category,
  onClose,
  onEdit,
  onDelete
}) => {
  return (
    <div className="cat-drawer-overlay" onClick={onClose}>
      <div className="cat-drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span className={`cat-status-badge ${category.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
            {category.status} Group
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '14px', color: '#8b5cf6' }}>
            <Folder size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{category.name}</h2>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginTop: '2px' }}>
              {category.code}
            </div>
          </div>
        </div>

        <div style={{ height: '1.5px', background: '#f1f5f9', margin: '24px 0' }} />

        <h3 style={{ fontSize: '0.84rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Group Specifications
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Linked SKUs</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>{category.totalProducts}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>GST Tax Bracket</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>{category.taxRate}%</div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Description</div>
          <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, lineHeight: 1.5 }}>{category.description}</div>
        </div>

        {category.notes && (
          <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '16px', border: '1px solid #fde68a', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', color: '#b45309' }}>
              <Info size={18} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Internal Classification Note</div>
                <p style={{ fontSize: '0.82rem', margin: '4px 0 0 0', fontWeight: 650, lineHeight: 1.4 }}>{category.notes}</p>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
          <button
            onClick={(e) => onEdit(category, e)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#475569', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <Edit3 size={18} /> Edit Category
          </button>

          <button
            onClick={onDelete}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px',
              borderRadius: '14px', border: 'none', background: '#ffe4e6', color: '#be123c',
              cursor: 'pointer', outline: 'none'
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
