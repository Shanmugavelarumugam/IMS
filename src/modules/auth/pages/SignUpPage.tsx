import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, User, Briefcase, Phone, MapPin, ArrowRight, Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import viyanLogo from '../../../assets/viyan_logo.png';
import loginBackdrop from '../../../assets/login_backdrop.png';
import { authApi } from '../../../core/api/auth';

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    adminName: '',
    businessName: '',
    domainType: 'pharmacy', // Default from enum
    phone: '',
    adminEmail: '',
    businessEmail: '',
    adminPassword: '',
    address: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.adminPassword !== confirmPassword) {
      setError('Admin Password confirmation fails. Passwords must match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Sanitize blank strings from payload so optional backend validators (like @IsEmail) don't trigger on empty text.
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === '' ? undefined : v])
      );

      const res = await authApi.register(cleanData);
      const companyCode = res.business?.companyCode || '';
      
      // Auto-Login Chain: Immediately convert registration into active session
      await authApi.login({
        email: formData.adminEmail,
        password: formData.adminPassword,
        companyCode: companyCode
      });

      // Directly push user into primary operations console
      navigate('/app');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to activate node. Verify inputs or system availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw', 
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', // Balanced 50/50 for extensive form space
      background: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .viyan-field {
          width: 100%;
          padding: 12px 12px 12px 42px;
          border-radius: 10px;
          border: 1.5px solid #E5E7EB;
          background: #F9FAFB;
          font-size: 0.95rem;
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
        .form-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .form-scroll::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
      `}</style>

      {/* LEFT PANEL: SCROLLABLE COMPACT FORM WORKSPACE */}
      <div className="form-scroll" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '40px 60px',
        background: '#FFFFFF',
        position: 'relative',
        overflowY: 'auto', // Permitted ONLY inside the container for usability
        zIndex: 10
      }}>
        <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto' }}>
          {/* Branding */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '32px' }}>
            <div style={{ background: 'white', padding: '6px', borderRadius: '10px', display: 'flex', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <img src={viyanLogo} alt="Viyan" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', letterSpacing: '-0.03em' }}>Viyan Inventory</span>
          </Link>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
            Create an account
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '32px' }}>
            Join 500+ growth enterprises optimizing operations.
          </p>

          {error && (
            <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {/* ACTUAL DUAL-COLUMN FORM GRID */}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
            
            {/* Row 1: Identity */}
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#9CA3AF" style={iconStyle} />
                <input required type="text" placeholder="John Doe" className="viyan-field" value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} disabled={loading} />
              </div>
            </div>

            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Business Name</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="#9CA3AF" style={iconStyle} />
                <input required type="text" placeholder="Acme Inc" className="viyan-field" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} disabled={loading} />
              </div>
            </div>

            {/* Row 2: Domains */}
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Domain Type</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} color="#9CA3AF" style={iconStyle} />
                <select required className="viyan-field" style={{ paddingLeft: '42px', appearance: 'none' }} value={formData.domainType} onChange={e => setFormData({...formData, domainType: e.target.value})} disabled={loading}>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="retail">Retail</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>

            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#9CA3AF" style={iconStyle} />
                <input required type="tel" placeholder="+91 98XXX XXXXX" className="viyan-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={loading} />
              </div>
            </div>

            {/* Row 3: Emails */}
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9CA3AF" style={iconStyle} />
                <input required type="email" placeholder="admin@personal.com" className="viyan-field" value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} disabled={loading} />
              </div>
            </div>

            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Business Email (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9CA3AF" style={iconStyle} />
                <input type="email" placeholder="corporate@acme.com" className="viyan-field" value={formData.businessEmail} onChange={e => setFormData({...formData, businessEmail: e.target.value})} disabled={loading} />
              </div>
            </div>

            {/* Full Spanners */}
            {/* Row 4: Security Matrix */}
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Admin Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9CA3AF" style={iconStyle} />
                <input 
                  required type={showPassword ? "text" : "password"} placeholder="••••••••" className="viyan-field"
                  value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: e.target.value})} disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }} disabled={loading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9CA3AF" style={iconStyle} />
                <input 
                  required type={showPassword ? "text" : "password"} placeholder="••••••••" className="viyan-field"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading}
                />
              </div>
            </div>

            {/* Row 5: Address */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Business Address (Optional)</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#9CA3AF" style={iconStyle} />
                <input type="text" placeholder="Floor, Building, City, Country" className="viyan-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={loading} />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
              <button type="submit" disabled={loading} style={{
                background: '#111827', color: 'white', padding: '16px', borderRadius: '10px',
                fontWeight: 800, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)', transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; } }}
              onMouseOut={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; } }}
              >
                {loading ? (
                   <><Loader2 size={20} className="spin" /> Finalizing Provisioning...</>
                ) : (
                   <>Create Account <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-Up was unsuccessful. Please try again.')}
              useOneTap
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', color: '#6B7280', fontSize: '0.9rem' }}>
            Already registered? <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, marginLeft: '5px', textDecoration: 'none' }}>Log In</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#9CA3AF', fontSize: '0.8rem', marginTop: '32px' }}>
            <Shield size={14} /> ISO 27001 Certified Infrastructure
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CONSISTENT PURE CINEMATIC VISUAL */}
      <div style={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
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
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0,
          width: '100%',
          height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          zIndex: 1
        }} />

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

const labelStyle: React.CSSProperties = {
  display: 'block', 
  fontSize: '0.85rem', 
  fontWeight: 700, 
  color: '#374151', 
  marginBottom: '6px'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute', 
  left: '14px', 
  top: '50%', 
  transform: 'translateY(-50%)'
};
