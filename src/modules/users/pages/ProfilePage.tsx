import { useEffect, useState } from 'react';
import { User, Mail, Shield, Building2, Globe, Calendar, Save, Loader2, CheckCircle2, Lock, Activity } from 'lucide-react';
import { authApi } from '../../../core/api/auth';

export const ProfilePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editData, setEditData] = useState({ name: '' });

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      setProfile(res);
      setEditData({ name: res.name || '' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Node inaccessible');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchProfile(), 0);
    return () => clearTimeout(t);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await authApi.updateProfile(editData);
      setSuccess('Identity Matrix synchronization complete.');
      await fetchProfile();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'System failure on write');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexWrap: 'wrap' }}>
         <Loader2 size={36} className="spin" color="#6366f1" />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <style>{`
        .viyan-glass-card {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid #F3F4F6;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02), 0 4px 6px rgba(0, 0, 0, 0.01);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .premium-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          background: #F9FAFB;
          font-weight: 600;
          color: #111827;
          transition: all 0.25s ease;
          box-sizing: border-box;
          outline: none;
        }
        .premium-input:focus {
          border-color: #6366f1;
          background: #FFF;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .gradient-header {
          height: 160px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          position: relative;
        }
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      {/* 1. MAIN COVER / HEADER AREA */}
      <div className="viyan-glass-card" style={{ marginBottom: '32px', position: 'relative' }}>
        <div className="gradient-header">
          {/* Abstract geometric texture over gradient for visual flair */}
          <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
             <svg width="400" height="160" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="350" cy="30" r="120" stroke="white" strokeWidth="2"/><circle cx="250" cy="130" r="80" stroke="white" strokeWidth="2"/></svg>
          </div>
        </div>
        <div style={{ padding: '0 40px 32px', marginTop: '-60px', display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Floating Avatar */}
          <div style={{
            height: '120px', width: '120px',
            borderRadius: '24px',
            background: 'white',
            padding: '6px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            zIndex: 10
          }}>
            <div style={{
              height: '100%', width: '100%',
              background: 'linear-gradient(to bottom right, #4F46E5, #7C3AED)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '3rem', fontWeight: 800
            }}>
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          
          {/* Title Space */}
          <div style={{ flex: 1, paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', margin: 0 }}>
                 {profile?.name}
               </h1>
               <div className="status-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
                 <CheckCircle2 size={14} /> Active Node
               </div>
            </div>
            <p style={{ color: '#6B7280', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Mail size={16} /> {profile?.email}
            </p>
          </div>
          
          {/* Right Statistics Pill Box */}
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ textAlign: 'center', padding: '8px 24px', background: '#F3F4F6', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', color: '#6B7280' }}>Authorized Role</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>{profile?.role || 'ADMIN'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE CONTENT SPLIT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
        
        {/* A: PRIMARY FORM CONTROL */}
        <div className="viyan-glass-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
             <div style={{ background: '#EEF2FF', color: '#6366f1', padding: '10px', borderRadius: '12px' }}>
               <User size={24} />
             </div>
             <div>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>System Identity Profile</h2>
               <p style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Configure public resolution name across your entire organization.</p>
             </div>
          </div>

          {success && (
            <div style={{ padding: '14px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {success}
            </div>
          )}
          {error && (
            <div style={{ padding: '14px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>Full Legal / System Display Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={editData.name} 
                    onChange={e => setEditData({...editData, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>
                  Protected Identity Key (Email)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    className="premium-input" 
                    style={{ background: '#F3F4F6', cursor: 'not-allowed', color: '#6B7280' }} 
                    value={profile?.email || ''} 
                    disabled 
                  />
                  <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '6px', fontWeight: 500 }}>Contact infrastructure root support to migrate administrative identity keys.</p>
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={{
                  background: '#111827',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px rgba(17, 24, 39, 0.15)',
                  opacity: saving ? 0.7 : 1
                }}>
                  {saving ? <Loader2 className="spin" size={20} /> : <Save size={20} />}
                  Safeguard & Update
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* B: SECONDARY DATA / METRICS PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           {/* Tenant Architecture Snapshot */}
           <div className="viyan-glass-card" style={{ padding: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
               <Building2 size={20} color="#6366f1" />
               <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Secure Instance Routing</h3>
             </div>
             <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '16px', border: '1px solid #F3F4F6', marginBottom: '16px' }}>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Target Workspace ID</div>
               <div style={{ fontFamily: 'Monaco, Courier New, monospace', fontWeight: 700, color: '#111827', fontSize: '1rem' }}>
                 {profile?.businessId || 'NULL_PTR_LINK'}
               </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>
                <Globe size={16} /> Regional Domain Isolation Active
             </div>
           </div>

           {/* System Security Integrity Box */}
           <div className="viyan-glass-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '24px', color: 'white' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
               <Shield size={22} color="#38bdf8" />
               <h3 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>Governance Metric</h3>
             </div>
             <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '20px', lineHeight: 1.5 }}>
               Your session identity utilizes strictly segmented authority policies managed under high-assurance standards.
             </p>
             <div style={{ height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
               <div style={{ height: '100%', width: '100%', background: '#38bdf8', borderRadius: '2px' }} />
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
               <span style={{ color: '#38bdf8' }}>TRUST RATING MAX</span>
               <span>100%</span>
             </div>
           </div>

           {/* Activity Log Hint */}
           <div className="viyan-glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
             <div style={{ height: '44px', width: '44px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Activity size={20} />
             </div>
             <div>
               <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>Active Login Audit</div>
               <div style={{ color: '#6B7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                 <Calendar size={12} /> Last verified moments ago
               </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};
