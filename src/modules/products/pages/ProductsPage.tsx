import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, MoreVertical, Settings, X, CheckCircle2, Box, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { productsApi } from '../../../core/api/products';

export const ProductsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [activeCardIds, setActiveCardIds] = useState<string[]>(['total_skus', 'total_value', 'low_stock', 'categories']);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await productsApi.listProducts();
        setProducts(res.data || []);
      } catch {
        // Robust Demo Data fallback
        setProducts([
          { id: '1', name: 'MacBook Pro 16" M3 Max', sku: 'LAP-MBP-16-M3', barcode: '890123001', price: 3499.00, stockQty: 45, minStockLevel: 10, status: 'ACTIVE', category: { name: 'Hardware' } },
          { id: '2', name: 'Dell UltraSharp 32" 4K', sku: 'MON-DELL-32', barcode: '890123002', price: 899.00, stockQty: 12, minStockLevel: 15, status: 'ACTIVE', category: { name: 'Peripherals' } },
          { id: '3', name: 'Logitech MX Master 3S', sku: 'ACC-LOG-MX3S', barcode: '890123003', price: 99.00, stockQty: 120, minStockLevel: 20, status: 'ACTIVE', category: { name: 'Accessories' } },
          { id: '4', name: 'AWS EC2 Reserved Instance', sku: 'CLD-AWS-EC2-R', barcode: '890123004', price: 1500.00, stockQty: 999, minStockLevel: 0, status: 'ACTIVE', category: { name: 'Cloud Infra' } },
          { id: '5', name: 'Microsoft 365 E5 License', sku: 'LIC-MS365-E5', barcode: '890123005', price: 38.00, stockQty: 500, minStockLevel: 50, status: 'ACTIVE', category: { name: 'Software' } },
          { id: '6', name: 'Cisco Catalyst 9300', sku: 'NET-CIS-9300', barcode: '890123006', price: 4200.00, stockQty: 5, minStockLevel: 8, status: 'ACTIVE', category: { name: 'Networking' } },
          { id: '7', name: 'Apple iPad Pro 12.9"', sku: 'TAB-IPAD-12', barcode: '890123007', price: 1099.00, stockQty: 30, minStockLevel: 15, status: 'ACTIVE', category: { name: 'Hardware' } },
          { id: '8', name: 'Herman Miller Aeron', sku: 'FURN-HM-AER', barcode: '890123008', price: 1400.00, stockQty: 0, minStockLevel: 10, status: 'ACTIVE', category: { name: 'Office' } },
          { id: '9', name: 'Sony WH-1000XM5', sku: 'ACC-SONY-XM5', barcode: '890123009', price: 398.00, stockQty: 85, minStockLevel: 20, status: 'ACTIVE', category: { name: 'Accessories' } },
          { id: '10', name: 'Adobe Creative Cloud', sku: 'LIC-ADOBE-CC', barcode: '890123010', price: 54.99, stockQty: 150, minStockLevel: 20, status: 'ACTIVE', category: { name: 'Software' } },
          { id: '11', name: 'Ubiquiti UniFi AP 6 Pro', sku: 'NET-UBI-AP6', barcode: '890123011', price: 149.00, stockQty: 42, minStockLevel: 10, status: 'ACTIVE', category: { name: 'Networking' } },
          { id: '12', name: 'Keychron Q1 Pro', sku: 'ACC-KEY-Q1', barcode: '890123012', price: 199.00, stockQty: 8, minStockLevel: 15, status: 'ACTIVE', category: { name: 'Accessories' } },
          { id: '13', name: 'Datadog Enterprise Agent', sku: 'CLD-DD-ENT', barcode: '890123013', price: 23.00, stockQty: 1000, minStockLevel: 100, status: 'ACTIVE', category: { name: 'Cloud Infra' } },
          { id: '14', name: 'Standing Desk Dual Motor', sku: 'FURN-SD-DM', barcode: '890123014', price: 499.00, stockQty: 18, minStockLevel: 15, status: 'ACTIVE', category: { name: 'Office' } },
          { id: '15', name: 'Lenovo ThinkPad X1', sku: 'LAP-THINK-X1', barcode: '890123015', price: 1899.00, stockQty: 25, minStockLevel: 10, status: 'ACTIVE', category: { name: 'Hardware' } }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stockQty), 0);
  const lowStockCount = products.filter(p => p.stockQty <= p.minStockLevel).length;
  const categories = new Set(products.map(p => p.category?.name)).size;

  const cardDefinitions = [
    {
      id: 'total_skus',
      label: 'Total SKUs',
      value: products.length,
      subtext: 'Active catalog items',
      icon: Box,
      className: 'blue',
      iconBg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      color: '#4f46e5'
    },
    {
      id: 'total_value',
      label: 'Inventory Value',
      value: `₹${(totalValue).toLocaleString('en-IN')}`,
      subtext: 'Current stock valuation',
      icon: TrendingUp,
      className: 'emerald',
      iconBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      color: '#059669'
    },
    {
      id: 'low_stock',
      label: 'Stock Alerts',
      value: lowStockCount,
      subtext: 'Items below minimum',
      icon: AlertTriangle,
      className: 'rose',
      valueColor: lowStockCount > 0 ? '#e11d48' : '#0f172a',
      iconBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
      color: '#e11d48'
    },
    {
      id: 'categories',
      label: 'Categories',
      value: categories,
      subtext: 'Active classifications',
      icon: Layers,
      className: 'amber',
      iconBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      color: '#d97706'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .stat-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.015);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .stat-card-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .stat-card-value {
          font-size: 2.2rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .stat-card-subtext {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 550;
        }
        .stat-card-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Premium Table Styles */
        .premium-table-container {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.015);
          margin-bottom: 32px;
          animation: fadeIn 0.4s ease;
        }
        .premium-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          position: relative;
        }
        .premium-table th {
          background: rgba(248, 250, 252, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 18px 24px;
          color: #64748b;
          font-weight: 850;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1.5px solid #f1f5f9;
        }
        .premium-table td {
          padding: 16px 24px;
          border-bottom: 1.5px solid #f1f5f9;
          font-weight: 600;
          font-size: 0.88rem;
          color: #1e293b;
          transition: background 0.2s;
        }
        .premium-table tr:last-child td {
          border-bottom: none;
        }
        .premium-table tr:nth-child(even) td { background: #fafbff; }
        .premium-table tr:hover td {
          background: #f4f6ff;
        }
        
        .table-action-btn {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          padding: 0;
        }
        .table-action-btn:hover {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #ffffff;
          border-color: #6d28d9;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
          transform: translateY(-2px);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', marginBottom: '4px' }}>
            <Package size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Master Catalog</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SKU Directory</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Centrally manage standard product attributes, price models and configurations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            Bulk Import
          </button>
          <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Plus size={18} /> Register Product
          </button>
        </div>
      </div>

      {/* Configure Cards Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '12px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          Operational Highlights
        </h3>
        <button 
          onClick={() => setShowMetricsConfig(true)}
          style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            color: '#4f46e5',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.05)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
          }}
        >
          <Settings size={14} /> Configure Cards
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {cardDefinitions.filter(c => activeCardIds.includes(c.id)).map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{card.label}</div>
                <div className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</div>
                <div className="stat-card-subtext">{card.subtext}</div>
              </div>
              <div 
                className={`stat-card-icon-wrapper ${card.className}`}
                style={{ background: card.iconBg, color: card.color }}
              >
                <Icon size={20} strokeWidth={2.4} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" placeholder="Search by title or SKU identifier..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 48px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', background: '#ffffff' }}
          />
        </div>
        <button style={{ padding: '0 16px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="premium-table-container">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Hydrating product matrix...</div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Identified Item</th>
                  <th>SKU / Barcode</th>
                  <th>Category</th>
                  <th>Stock Availability</th>
                  <th style={{ textAlign: 'right' }}>List Price</th>
                  <th style={{ width: '60px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prod) => {
                  const isLow = prod.stockQty > 0 && prod.stockQty <= prod.minStockLevel;
                  const isOut = prod.stockQty <= 0;
                  return (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ height: '40px', width: '40px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            <Package size={20} />
                          </div>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{prod.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <code style={{ fontSize: '0.78rem', fontWeight: 850, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                            {prod.sku}
                          </code>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{prod.barcode}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
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
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="table-action-btn">
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
        )}
      </div>

      {/* Configure Cards Modal */}
      {showMetricsConfig && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '12px' }}>
                  <Settings size={20} color="#4f46e5" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Configure Cards
                </h2>
              </div>
              <button 
                onClick={() => setShowMetricsConfig(false)}
                style={{
                  background: 'transparent', border: 'none', color: '#94a3b8',
                  cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '32px' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
                Select the key performance indicators you want to monitor on your main operational dashboard.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cardDefinitions.map(card => {
                  const isActive = activeCardIds.includes(card.id);
                  const Icon = card.icon;
                  return (
                    <label 
                      key={card.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: `2px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isActive ? '#f5f7ff' : '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '12px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isActive ? 'rgba(99, 102, 241, 0.1)' : '#f1f5f9',
                          color: isActive ? '#6366f1' : '#64748b'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{card.label}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{card.subtext}</div>
                        </div>
                      </div>
                      
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: `2px solid ${isActive ? '#6366f1' : '#cbd5e1'}`,
                        background: isActive ? '#6366f1' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}>
                        {isActive && <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <input 
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActiveCardIds(prev => [...prev, card.id]);
                          } else {
                            if (activeCardIds.length > 1) {
                              setActiveCardIds(prev => prev.filter(id => id !== card.id));
                            }
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div style={{
              padding: '24px 32px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button 
                onClick={() => setShowMetricsConfig(false)}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
