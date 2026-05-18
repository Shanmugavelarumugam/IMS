import { useState, useEffect } from 'react';
import { Search, Filter, Users, MoreVertical, Mail, Building, Shield } from 'lucide-react';
import { platformApi } from '../../../core/api/platform';

export const TenantUsersPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await platformApi.listTenantUsers();
      setUsers(res.data || []);
    } catch {
      // Mock fallback if endpoint fails locally
      setUsers([
        { id: 'u1', name: 'Sarah Miller', email: 'sarah@apex.com', role: 'MANAGER', business: { name: 'Apex Health', companyCode: 'APEX' }, isActive: true, lastLogin: '2024-05-10T11:00:00Z' },
        { id: 'u2', name: 'Tom Cruise', email: 'tom@retail.com', role: 'CASHIER', business: { name: 'Metro Retail', companyCode: 'METRO' }, isActive: false, lastLogin: '2024-04-20T09:00:00Z' },
        { id: 'u3', name: 'Emily Blunt', email: 'emily@pharm.com', role: 'PHARMACIST', business: { name: 'Viyan Pharma', companyCode: 'VIYAN' }, isActive: true, lastLogin: '2024-05-09T16:30:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchData(), 0);
    return () => clearTimeout(t);
  }, []);

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.business.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '4px' }}>
            <Users size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workforce Intelligence</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Global User Directory</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Holistic view of all personnel authenticated under all tenant ecosystems.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', display: 'flex', gap: '16px', borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search name, email or tenant..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 48px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}
            />
          </div>
          <button style={{ padding: '0 16px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
            <Filter size={16} /> Advanced Filters
          </button>
        </div>

        <div className="data-table-container" style={{ margin: 0 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Retrieving directory...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th>User Identity</th>
                  <th>Origin Business</th>
                  <th>Security Role</th>
                  <th>Status</th>
                  <th>Last Presence</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Mail size={12} /> {user.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#475569' }}>
                        <Building size={14} style={{ color: '#94a3b8' }} />
                        {user.business.name}
                        <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>{user.business.companyCode}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.02em' }}>
                        <Shield size={14} /> {user.role}
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                        background: user.isActive ? '#d1fae5' : '#fee2e2',
                        color: user.isActive ? '#065f46' : '#991b1b'
                      }}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(user.lastLogin).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><MoreVertical size={18} /></button>
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
