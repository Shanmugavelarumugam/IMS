import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, Briefcase, Phone, MapPin, ArrowRight, Shield, Loader2 } from 'lucide-react';
import viyanLogo from '../../../assets/viyan_logo.png';
import loginBackdrop from '../../../assets/login_backdrop.png';
import { authApi } from '../../../core/api/auth';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve passed Google state or fallback
  const token = location.state?.token || localStorage.getItem('temp_google_token') || '';
  const initialEmail = location.state?.email || localStorage.getItem('temp_google_email') || '';
  const initialName = location.state?.name || localStorage.getItem('temp_google_name') || '';

  const [formData, setFormData] = useState({
    businessName: '',
    domainType: 'pharmacy',
    phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If there is no Google token, redirect user back to login/signup page
    if (!token) {
      navigate('/signup', { state: { message: 'Please sign up with Google first to access onboarding.' } });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.googleOnboard({
        token,
        businessName: formData.businessName,
        domainType: formData.domainType,
        phone: formData.phone,
        address: formData.address === '' ? undefined : formData.address
      });

      // Clear temp storage
      localStorage.removeItem('temp_google_token');
      localStorage.removeItem('temp_google_email');
      localStorage.removeItem('temp_google_name');

      // Success! Send straight to operations dashboard
      navigate('/app');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize your organization node. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw', 
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', // Consistent 50/50 dual layout
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

      {/* LEFT PANEL: ONBOARDING FORM */}
      <div className="form-scroll" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 60px',
        background: '#FFFFFF',
        position: 'relative',
        overflowY: 'auto',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto' }}>
          {/* Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ background: 'white', padding: '6px', borderRadius: '10px', display: 'flex', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <img src={viyanLogo} alt="Viyan" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', letterSpacing: '-0.03em' }}>Viyan Inventory</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
            Set up your Business Node
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '24px' }}>
            Welcome, <strong style={{ color: '#111827' }}>{initialName}</strong> ({initialEmail})! Just a few remaining details to provision your enterprise sandbox.
          </p>

          {error && (
            <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
            {/* Business Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Business Name</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="#9CA3AF" style={iconStyle} />
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Acme Pharma Ltd." 
                  className="viyan-field" 
                  value={formData.businessName} 
                  onChange={e => setFormData({...formData, businessName: e.target.value})} 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Domain Type */}
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Domain Type</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} color="#9CA3AF" style={iconStyle} />
                <select 
                  required 
                  className="viyan-field" 
                  style={{ paddingLeft: '42px', appearance: 'none' }} 
                  value={formData.domainType} 
                  onChange={e => setFormData({...formData, domainType: e.target.value})} 
                  disabled={loading}
                >
                  <option value="pharmacy">Pharmacy</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="retail">Retail</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div style={{ gridColumn: 'span 1' }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#9CA3AF" style={iconStyle} />
                <input 
                  required 
                  type="tel" 
                  placeholder="+91 98XXX XXXXX" 
                  className="viyan-field" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Address */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Business Address (Optional)</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#9CA3AF" style={iconStyle} />
                <input 
                  type="text" 
                  placeholder="Floor, Building, City, Country" 
                  className="viyan-field" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
              <button 
                type="submit" 
                disabled={loading} 
                style={{
                  background: '#111827', 
                  color: 'white', 
                  padding: '16px', 
                  borderRadius: '10px',
                  fontWeight: 800, 
                  fontSize: '1rem', 
                  border: 'none', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)', 
                  transition: 'all 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseOver={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; } }}
                onMouseOut={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; } }}
              >
                {loading ? (
                   <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Customizing Sandbox...</>
                ) : (
                   <>Activate Workspace <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', color: '#6B7280', fontSize: '0.9rem' }}>
            Want to start over? <Link to="/signup" style={{ color: '#2563EB', fontWeight: 700, marginLeft: '5px', textDecoration: 'none' }}>Change Account</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#9CA3AF', fontSize: '0.8rem', marginTop: '32px' }}>
            <Shield size={14} /> ISO 27001 Certified Infrastructure
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CINEMATIC BACKDROP */}
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
