import React from 'react';
import { Tags, Settings, Plus } from 'lucide-react';

interface CategoriesHeaderProps {
  onConfigureCards: () => void;
  onAddCategory: () => void;
}

export const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  onConfigureCards,
  onAddCategory
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '6px' }}>
          <Tags size={16} />
          <span style={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Catalog Taxonomy</span>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Category Organization</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 600, fontSize: '0.94rem' }}>Group inventory products, regulate taxonomy groups, and direct localized tax parameters.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={onConfigureCards}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', 
            borderRadius: '16px', border: '1.5px solid #e2e8f0', background: '#ffffff',
            color: '#475569', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', outline: 'none'
          }}
        >
          <Settings size={18} /> Configure Cards
        </button>
        
        <button 
          onClick={onAddCategory}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
            borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)', outline: 'none'
          }}
        >
          <Plus size={20} /> Add Category
        </button>
      </div>
    </div>
  );
};
