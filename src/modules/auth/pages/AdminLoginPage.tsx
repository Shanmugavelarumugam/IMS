import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import viyanLogo from '../../../assets/viyan_logo.png';
import { authApi } from '../../../core/api/auth';

export const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.login({
        email: formData.email,
        password: formData.password,
        // platform login condition: omit companyCode
      });
      
      navigate('/admin/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background subtle aesthetic details */}
      <div style={{
        position: 'absolute',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        top: '-200px',
        right: '-200px',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
        bottom: '-200px',
        left: '-200px',
        zIndex: 0
      }} />

      <style>{`
        .admin-field {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
          color: #0f172a;
        }
        .admin-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: '#ffffff',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
        borderRadius: '24px',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'white',
            padding: '10px',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
            border: '1px solid #f1f5f9',
            marginBottom: '20px'
          }}>
            <img src={viyanLogo} alt="Viyan Logo" style={{ height: '40px', width: '40px' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>Admin Portal</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Restricted access administration space.</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '12px',
            fontSize: '0.875rem',
            marginBottom: '20px',
            border: '1px solid #fca5a5',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                required 
                type="email" 
                placeholder="root@example.com" 
                className="admin-field"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="admin-field"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" /> Authenticating...
              </>
            ) : (
              <>
                System Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          marginTop: '32px',
          color: '#6366f1',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          <ShieldCheck size={16} /> System Encrypted
        </div>
      </div>
    </div>
  );
};
