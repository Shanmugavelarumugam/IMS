import { useEffect, useState } from 'react';
import { Plus, Search, ShoppingCart, Calendar, FileText, Loader2, Activity, DollarSign, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { procurementApi } from '../../../core/api/procurement';

export const PurchasesPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pos, setPOs] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [poRes, statsRes] = await Promise.all([
        procurementApi.listPOs().catch(() => []),
        procurementApi.getAnalytics().catch(() => null)
      ]);
      setPOs(Array.isArray(poRes) ? poRes : []);
      setStats(statsRes);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Core network resolution failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => loadData(), 0);
    return () => clearTimeout(t);
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || 'DRAFT';
    switch (s) {
      case 'COMPLETED': return <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12}/> COMPLETED</span>;
      case 'SENT': return <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={12}/> SENT</span>;
      case 'CANCELLED': return <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12}/> CANCELLED</span>;
      default: return <span style={{ padding: '4px 10px', borderRadius: '6px', background: '#FFF7ED', color: '#EA580C', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> DRAFT</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 className="spin" color="#6366f1" size={36} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>Inbound Procurement</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontWeight: 500 }}>Draft purchase orders, authorize fulfillment, and track incoming inventory.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '14px', padding: '12px 24px' }}>
          <Plus size={20} /> Create Order
        </button>
      </div>

      {/* METRIC SNIPPETS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid #F3F4F6' }}>
           <div style={{ height: '40px', width: '40px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '16px' }}>
              <ShoppingCart size={20} />
           </div>
           <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Drafts</div>
           <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>{pos.filter(p => p.status === 'DRAFT').length}</div>
        </div>

        <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid #F3F4F6' }}>
           <div style={{ height: '40px', width: '40px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '16px' }}>
              <DollarSign size={20} />
           </div>
           <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Historic Exp</div>
           <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>${stats?.totalSpent?.toLocaleString() || '0.00'}</div>
        </div>

        <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid #F3F4F6' }}>
           <div style={{ height: '40px', width: '40px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '16px' }}>
              <AlertTriangle size={20} />
           </div>
           <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accounts Payable</div>
           <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>${stats?.totalDue?.toLocaleString() || '0.00'}</div>
        </div>

        <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid #F3F4F6' }}>
           <div style={{ height: '40px', width: '40px', borderRadius: '10px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', marginBottom: '16px' }}>
              <Activity size={20} />
           </div>
           <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Velocity Matrix</div>
           <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>{stats?.completedPOs || 0} / {stats?.poCount || 0}</div>
        </div>
      </div>

      {/* DATA TABLE CLUSTER */}
      <div className="card" style={{ background: 'white', border: '1px solid #F3F4F6', padding: 0, overflow: 'hidden', borderRadius: '20px', boxShadow: '0 4px 25px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>Purchase Order Repository</h3>
           <div style={{ position: 'relative', width: '300px' }}>
             <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
             <input type="text" placeholder="Locate by order node..." style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#F9FAFB', border: '1.5px solid #F3F4F6', borderRadius: '10px', outline: 'none', fontSize: '0.85rem', fontWeight: 500, boxSizing: 'border-box' }} />
           </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          {error ? (
             <div style={{ padding: '40px', textAlign: 'center', color: '#B91C1C', fontWeight: 600 }}>{error}</div>
          ) : pos.length === 0 ? (
             <div style={{ padding: '80px 24px', textAlign: 'center' }}>
               <FileText size={48} color="#E5E7EB" style={{ margin: '0 auto 16px' }} />
               <h4 style={{ fontWeight: 700, color: '#4B5563', fontSize: '1rem' }}>No Active Procurement Cycles</h4>
               <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: '4px' }}>Initialize valid supply request to populate command matrix.</p>
             </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 800, letterSpacing: '0.05em' }}>Order Entity</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 800, letterSpacing: '0.05em' }}>Vendor Routing</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 800, letterSpacing: '0.05em' }}>Authorization Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 800, letterSpacing: '0.05em' }}>Launch Cycle</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 800, letterSpacing: '0.05em' }}>Gross Valuation</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }} className="hover-lift">
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>{p.poNumber || '#DRAFT'}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#4B5563' }}>{p.supplier?.name || 'Unmapped Node'}</td>
                    <td style={{ padding: '16px 24px' }}>{getStatusBadge(p.status)}</td>
                    <td style={{ padding: '16px 24px', color: '#6B7280', fontSize: '0.85rem', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <Calendar size={14} /> {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                      ${parseFloat(p.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
