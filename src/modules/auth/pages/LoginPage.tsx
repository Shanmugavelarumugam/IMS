import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Building2, ArrowRight, Eye, EyeOff, Shield, Loader2, User } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import viyanLogo from '../../../assets/viyan_logo.png';
import loginBackdrop from '../../../assets/login_backdrop.png';
import { authApi } from '../../../core/api/auth';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ companyCode: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dynamic Progression Engine
  const [step, setStep] = useState<'EMAIL' | 'WORKSPACE_SELECT' | 'PASSWORD'>('EMAIL');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const incomingMsg = location.state?.message;
  const autoFillCode = location.state?.autoFillCode;

  const handleGuestLogin = () => {
    setLoading(true);
    setError('');
    // Simulate secure handshaking/loading for high fidelity premium feel
    setTimeout(() => {
      localStorage.setItem('access_token', 'guest_mock_token_xyz');
      localStorage.setItem('refresh_token', 'guest_mock_refresh_token_xyz');
      localStorage.setItem('is_guest', 'true');
      localStorage.setItem('user_session', JSON.stringify({
        id: 'guest',
        name: 'Guest Agent',
        email: 'guest@viyan.app',
        role: 'Guest Mode'
      }));
      localStorage.setItem('business_session', JSON.stringify({
        id: 'guest_biz',
        name: 'Guest Enterprise',
        companyCode: 'GUEST-123'
      }));
      setLoading(false);
      navigate('/app');
    }, 850);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google Sign-In was unsuccessful. Token not found.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.googleLogin(credentialResponse.credential);
      if (res.onboardingRequired) {
        // Pass token to complete onboarding
        navigate('/onboarding', { state: { token: credentialResponse.credential, email: res.email, name: res.name } });
      } else {
        navigate('/app');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Google Authentication failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFillCode) {
      const t = setTimeout(() => {
        setFormData(prev => ({ ...prev, companyCode: autoFillCode }));
        setStep('PASSWORD'); // Skip discovery immediately
      }, 0);
      return () => clearTimeout(t);
    }
  }, [autoFillCode]);

  // STEP 1 handler: Email discovery
  const handleDiscover = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await authApi.discoverWorkspaces(formData.email);
      const foundWorkspaces = res.workspaces || [];
      
      if (foundWorkspaces.length === 0) {
        // Assume custom admin login or generic tenant logic manually
        setStep('PASSWORD');
      } else if (foundWorkspaces.length === 1) {
        // Automatically hydrate code and move to password
        setFormData(prev => ({ ...prev, companyCode: foundWorkspaces[0].companyCode }));
        setStep('PASSWORD');
      } else {
        // Show selection matrix
        setWorkspaces(foundWorkspaces);
        setStep('WORKSPACE_SELECT');
      }
    } catch {
      // Graceful recovery: Proceed anyway to allow manual override entry
      setStep('PASSWORD');
    } finally {
      setLoading(false);
    }
  };

  // Helper for selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectWorkspace = (ws: any) => {
    setFormData(prev => ({ ...prev, companyCode: ws.companyCode }));
    setStep('PASSWORD');
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authApi.login({
        email: formData.email,
        password: formData.password,
        companyCode: formData.companyCode
      });
      navigate('/app');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Auth verification failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw', 
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      background: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .viyan-field {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          background: #F9FAFB;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          box-sizing: border-box;
          color: #111827;
        }
        .viyan-field:focus {
          background: #FFFFFF;
          border-color: #2563EB;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }
        .ws-card {
          border: 1.5px solid #E5E7EB;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
        }
        .ws-card:hover {
          border-color: #2563EB;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transform: translateY(-1px);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .guest-login-btn {
          width: 100%;
          background: #FFFFFF;
          color: #475569;
          border: 1.5px solid #E2E8F0;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          box-sizing: border-box;
          outline: none;
        }
        .guest-login-btn:hover:not(:disabled) {
          background: #F8FAFC;
          border-color: #6366F1;
          color: #4F46E5;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
          transform: translateY(-1.5px);
        }
        .guest-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        background: '#FFFFFF',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '40px' }}>
            <div style={{ background: 'white', padding: '6px', borderRadius: '10px', display: 'flex', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <img src={viyanLogo} alt="Viyan" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', letterSpacing: '-0.03em' }}>Viyan Inventory</span>
          </Link>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '8px' }}>
            {step === 'EMAIL' && 'Welcome back'}
            {step === 'WORKSPACE_SELECT' && 'Select Workspace'}
            {step === 'PASSWORD' && 'Complete secure access'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: 500, marginBottom: '32px' }}>
            {step === 'EMAIL' && 'Enter email to locate account node.'}
            {step === 'WORKSPACE_SELECT' && `Associated with ${formData.email}`}
            {step === 'PASSWORD' && `Final authentication to continue`}
          </p>

          {incomingMsg && step === 'PASSWORD' && (
            <div style={{ padding: '14px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
              {incomingMsg}
            </div>
          )}

          {error && (
            <div style={{ padding: '14px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* -- PHASE 1: EMAIL CAPTURE -- */}
          {step === 'EMAIL' && (
            <form onSubmit={handleDiscover} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Personal or Work Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    required type="email" placeholder="name@company.com" className="viyan-field"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ background: '#111827', color: 'white', padding: '18px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? <><Loader2 size={20} className="spin" /> Locating...</> : <>Continue <ArrowRight size={20} /></>}
              </button>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                 <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Don't have an account?</span>
                 <Link to="/signup" style={{ color: '#2563EB', fontWeight: 700, marginLeft: '6px', textDecoration: 'none' }}>Create Free Instance</Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Sign-In was unsuccessful. Please try again.')}
                  useOneTap
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>or explore</span>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="guest-login-btn"
              >
                <User size={18} /> Continue with Guest Login
              </button>
            </form>
          )}

          {/* -- PHASE 2: WORKSPACE SELECTOR GRID -- */}
          {step === 'WORKSPACE_SELECT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {workspaces.map(ws => (
                  <div key={ws.businessId} className="ws-card" onClick={() => handleSelectWorkspace(ws)}>
                    <div style={{ height: '40px', width: '40px', background: '#F3F4F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                      <Building2 size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{ws.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'monospace' }}>ID: {ws.companyCode}</div>
                    </div>
                    <ArrowRight size={16} color="#9CA3AF" />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('EMAIL')} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}>
                ← Use different email
              </button>
            </div>
          )}

          {/* -- PHASE 3: PASSWORD GATE -- */}
          {step === 'PASSWORD' && (
            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Context Indicator */}
              {formData.companyCode && (
                <div style={{ background: '#F9FAFB', padding: '12px', borderRadius: '10px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ color: '#2563EB' }}><Building2 size={18} /></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Accessing Node</div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>{formData.companyCode}</div>
                  </div>
                </div>
              )}

              {/* Fallback explicit code input visible ONLY if autofill failed or no workspaces mapped */}
              {!formData.companyCode && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Company Identifier</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input required type="text" placeholder="XYZ-123" className="viyan-field" value={formData.companyCode} onChange={e => setFormData({...formData, companyCode: e.target.value})} disabled={loading} />
                  </div>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Credential Sequence</label>
                  <a href="#" style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Reset?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    required type={showPassword ? "text" : "password"} placeholder="••••••••" className="viyan-field"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }} disabled={loading}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ background: '#111827', color: 'white', padding: '18px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? <><Loader2 size={20} className="spin" /> Authenticating...</> : <>Authorize Access <Shield size={18} /></>}
              </button>
              
              <button onClick={() => { setStep('EMAIL'); setFormData(p => ({...p, companyCode: ''})); }} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'center' }}>
                ← Change Email
              </button>
            </form>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: PURE CINEMATIC VISUAL */}
      <div style={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        {/* Cinematic Backdrop Image covering full surface */}
        <img 
          src={loginBackdrop} 
          alt="Cinematic Corporate Visual" 
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }} 
        />

        {/* Subtle dark gradient fade only at bottom 30% just for legibility */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0,
          width: '100%',
          height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          zIndex: 1
        }} />

        {/* Minimal, Clean Floating Legend */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px 50px',
          color: 'white',
          width: '100%'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            lineHeight: 1.2, 
            letterSpacing: '-0.02em', 
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Powering Modern Global Assets
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            Real-time logic for high-velocity enterprises.
          </p>
        </div>
      </div>
    </div>
  );
};
