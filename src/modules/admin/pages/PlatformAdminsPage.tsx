import { useState, useEffect } from 'react';
import { UserPlus, Shield, ShieldCheck, MoreVertical, Mail, Clock } from 'lucide-react';
import { platformApi } from '../../../core/api/platform';

export const PlatformAdminsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await platformApi.listAdmins();
      setAdmins(res.data || []);
    } catch {
      // Mock backup just for dev safety rendering
      setAdmins([
        { id: 'a1', name: 'Alex Superuser', email: 'alex@saas.com', platformRole: 'ROOT', status: 'ACTIVE', lastLoginAt: '2024-05-10T08:30:00Z' },
        { id: 'a2', name: 'Sarah Dev', email: 'sarah@saas.com', platformRole: 'PLATFORM_ADMIN', status: 'ACTIVE', lastLoginAt: '2024-05-09T14:10:00Z' },
        { id: 'a3', name: 'Operator Bob', email: 'bob@saas.com', platformRole: 'SUPPORT_ADMIN', status: 'ACTIVE', lastLoginAt: '2024-05-01T09:00:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchAdmins(), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '4px' }}>
            <Shield size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Infrastructure Security</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Platform Operators</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Privileged accounts with internal backoffice capability overrides.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 20px' }}>
          <UserPlus size={18} />
          New Operator
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ color: 'var(--text-secondary)', padding: '20px' }}>Hydrating records...</div>
        ) : (
          admins.map((admin) => (
            <div key={admin.id} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  height: '48px', width: '48px', borderRadius: '12px', 
                  background: admin.platformRole === 'ROOT' ? 'linear-gradient(135deg, #4f46e5, #9333ea)' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: admin.platformRole === 'ROOT' ? 'white' : '#64748b'
                }}>
                  {admin.platformRole === 'ROOT' ? <ShieldCheck size={24} /> : <Shield size={24} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{admin.name}</h3>
                  <span style={{ 
                    fontSize: '0.75rem', fontWeight: 700, color: admin.platformRole === 'ROOT' ? '#6366f1' : '#64748b',
                    letterSpacing: '0.05em'
                  }}>
                    {admin.platformRole}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.875rem' }}>
                  <Mail size={16} style={{ opacity: 0.6 }} />
                  {admin.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.875rem' }}>
                  <Clock size={16} style={{ opacity: 0.6 }} />
                  Last access: {new Date(admin.lastLoginAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>Active</span>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#6366f1', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Manage Rights
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
