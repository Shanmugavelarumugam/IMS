import { useState, useEffect } from 'react';
import { Tags, Plus, Folder, MoreVertical, CheckSquare } from 'lucide-react';
import { productsApi } from '../../../core/api/products';

export const CategoriesPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productsApi.listCategories();
        setCategories(res || []);
      } catch {
        // Safe mockup state
        setCategories([
          { id: 'c1', name: 'OTC Medications', description: 'Over-the-counter pills and liquids', totalProducts: 145 },
          { id: 'c2', name: 'Organic Teas', description: 'Loose leaf and standard bagged infusions', totalProducts: 22 },
          { id: 'c3', name: 'Hygiene', description: 'Sanitation and general care products', totalProducts: 80 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', marginBottom: '4px' }}>
            <Tags size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catalog Structure</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Grouping & Taxonomies</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Maintain parent-child relations of the centralized classification tree.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} /> Define Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div>Aggregating groupings...</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="glass-card" style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreVertical size={18} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#eef2ff', padding: '10px', borderRadius: '10px', color: '#4f46e5' }}>
                  <Folder size={20} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{cat.name}</h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', minHeight: '40px', lineHeight: 1.5 }}>{cat.description}</p>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <CheckSquare size={14} style={{ color: '#10b981' }} />
                 <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{cat.totalProducts || 0} linked SKUs</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
