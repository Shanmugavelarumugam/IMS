import { useState, useEffect } from 'react';
import { Plus, Check, Zap, Users, Briefcase, Edit2 } from 'lucide-react';
import { platformApi } from '../../../core/api/platform';

export const SubscriptionsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await platformApi.listPlans();
      setPlans(res.data || []);
    } catch {
      // Dynamic high-fidelity fallback if dev backend is missing initial bootstrapping
      setPlans([
        { id: 'p1', name: 'BASIC', price: 999, currency: 'INR', billingCycle: 'MONTHLY', status: 'ACTIVE', limits: { maxUsers: 2, maxProducts: 500 }, features: { analytics: false, apiAccess: false } },
        { id: 'p2', name: 'PROFESSIONAL', price: 2500, currency: 'INR', billingCycle: 'MONTHLY', status: 'ACTIVE', limits: { maxUsers: 10, maxProducts: 10000 }, features: { analytics: true, apiAccess: true } },
        { id: 'p3', name: 'ENTERPRISE', price: 8999, currency: 'INR', billingCycle: 'MONTHLY', status: 'ACTIVE', limits: { maxUsers: 50, maxProducts: 999999 }, features: { analytics: true, apiAccess: true, customDomain: true } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchPlans(), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '36px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '4px' }}>
            <Zap size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monetization Layer</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Pricing Tiers & Plans</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage product limits, monetization metrics and subscription model configurations.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 20px' }}>
          <Plus size={18} />
          Construct New Tier
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div>Analyzing tiers...</div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="glass-card" style={{ 
              padding: '0', 
              overflow: 'hidden', 
              border: plan.name === 'PROFESSIONAL' ? '2px solid #6366f1' : '1px solid rgba(0,0,0,0.05)',
              position: 'relative' 
            }}>
              {plan.name === 'PROFESSIONAL' && (
                <div style={{
                  background: '#6366f1', color: 'white', padding: '4px 12px', fontSize: '0.7rem',
                  fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
                  position: 'absolute', top: 0, right: '24px', borderRadius: '0 0 8px 8px'
                }}>
                  Popular
                </div>
              )}

              <div style={{ padding: '28px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.01em' }}>{plan.name}</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '16px' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {plan.currency === 'INR' ? '₹' : '$'}{plan.price.toLocaleString()}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>/ {plan.billingCycle.toLowerCase()}</span>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Limits & Controls</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '6px' }}><Users size={16} /></div>
                    Up to {plan.limits.maxUsers.toLocaleString()} Seats Included
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '6px' }}><Briefcase size={16} /></div>
                    {plan.limits.maxProducts > 99999 ? 'Unlimited' : plan.limits.maxProducts.toLocaleString()} Product Nodes
                  </div>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', margin: '24px 0' }}></div>

                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Modules</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: plan.features.analytics ? '#0f172a' : '#94a3b8' }}>
                     <Check size={16} color={plan.features.analytics ? '#10b981' : '#cbd5e1'} /> Advanced Analytics Grid
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: plan.features.apiAccess ? '#0f172a' : '#94a3b8' }}>
                     <Check size={16} color={plan.features.apiAccess ? '#10b981' : '#cbd5e1'} /> External API Interface Hooks
                   </div>
                </div>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>
                  <Edit2 size={14} /> Configure
                </button>
                <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: plan.status === 'ACTIVE' ? '#fee2e2' : '#d1fae5', color: plan.status === 'ACTIVE' ? '#b91c1c' : '#065f46', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                  {plan.status === 'ACTIVE' ? 'Deactivate' : 'Push Active'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
