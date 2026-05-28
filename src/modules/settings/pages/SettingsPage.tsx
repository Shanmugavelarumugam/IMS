import React, { useEffect, useState } from 'react';
import { 
  Settings, Building2, Globe, Shield, RefreshCw, X, 
  Trash2, Key, Download
} from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'localization' | 'security' | 'database'>('profile');

  // Enterprise Profile fields
  const [companyName, setCompanyName] = useState('Viyan Tech Enterprises');
  const [gstin, setGstin] = useState('27AAAAA1111A1Z1');
  const [email, setEmail] = useState('operations@viyan.tech');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Sector 4, HSR Layout, Bengaluru, Karnataka 560102');

  // Localization fields
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('IST');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [apiKey] = useState('viyan_live_pk_87e02a9bcf31070de62c5c');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load custom values from storage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('ims_settings_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setCompanyName(parsed.companyName || companyName);
        setGstin(parsed.gstin || gstin);
        setEmail(parsed.email || email);
        setPhone(parsed.phone || phone);
        setAddress(parsed.address || address);
      }
      
      const savedLocal = localStorage.getItem('ims_settings_local');
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        setCurrency(parsed.currency || currency);
        setTimezone(parsed.timezone || timezone);
        setDateFormat(parsed.dateFormat || dateFormat);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('ims_settings_profile', JSON.stringify({
        companyName, gstin, email, phone, address
      }));
      addToast('success', 'Enterprise Profile updated successfully');
    } catch {
      addToast('error', 'Failed to commit configurations to storage');
    }
  };

  const handleSaveLocalization = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('ims_settings_local', JSON.stringify({
        currency, timezone, dateFormat
      }));
      addToast('success', 'Currency & Localization settings saved successfully');
    } catch {
      addToast('error', 'Failed to commit configurations');
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Security controls updated and compiled');
  };

  const handleBackupDB = () => {
    // Generate simulated DB JSON backup file
    const data = {
      timestamp: new Date().toISOString(),
      profile: { companyName, gstin, email, phone, address },
      local: { currency, timezone, dateFormat },
      version: 'v2.1-premium-node'
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `viyan_db_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    addToast('success', 'Local Database Backup generated and exported as JSON');
  };

  const handleWipeCache = () => {
    localStorage.removeItem('ims_dummy_products');
    localStorage.removeItem('ims_dummy_categories');
    localStorage.removeItem('ims_dummy_inventory');
    localStorage.removeItem('ims_dummy_purchases');
    localStorage.removeItem('ims_dummy_sales');
    localStorage.removeItem('ims_dummy_customers');
    localStorage.removeItem('ims_dummy_suppliers');
    addToast('warning', 'Cached simulation databases successfully cleared. Reload to sync defaults.');
  };

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)', padding: '24px' }}>
      <style>{`
        .settings-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          margin-top: 24px;
        }
        @media (max-width: 800px) {
          .settings-layout { grid-template-columns: 1fr; }
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        @media (max-width: 800px) {
          .settings-nav { flex-direction: row; flex-wrap: wrap; margin-bottom: 16px; }
        }
        
        .settings-nav-btn {
          border: none;
          background: transparent;
          padding: 14px 20px;
          border-radius: 16px;
          font-size: 0.88rem;
          font-weight: 750;
          color: #64748b;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .settings-nav-btn.active {
          background: #6366f1;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
        }
        .settings-nav-btn:not(.active):hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .settings-card {
          background: #ffffff;
          border-radius: 28px;
          border: 1.5px solid #f1f5f9;
          padding: 36px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.015);
        }

        .settings-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          font-size: 0.88rem;
          font-weight: 650;
          color: #1e293b;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .settings-input:focus {
          border-color: #6366f1;
          background: #fcfcff;
        }

        .settings-label {
          display: block;
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #cbd5e1;
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: #059669; }
        input:checked + .slider:before { transform: translateX(20px); }

        .toast-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .toast-card {
          padding: 16px 20px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border-left: 5px solid #6366f1;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #1e293b;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '6px' }}>
            <Settings size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Administration Center</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>System Settings</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 600, fontSize: '0.94rem' }}>Configure localized parameters, audit security policies, and manage offline databases.</p>
        </div>
      </div>

      {/* LAYOUT CONTAINER */}
      <div className="settings-layout">
        
        {/* Navigation Sidebar */}
        <div className="settings-nav">
          <button 
            onClick={() => setActiveSection('profile')} 
            className={`settings-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
          >
            <Building2 size={18} /> Enterprise Profile
          </button>
          
          <button 
            onClick={() => setActiveSection('localization')} 
            className={`settings-nav-btn ${activeSection === 'localization' ? 'active' : ''}`}
          >
            <Globe size={18} /> Localization
          </button>
          
          <button 
            onClick={() => setActiveSection('security')} 
            className={`settings-nav-btn ${activeSection === 'security' ? 'active' : ''}`}
          >
            <Shield size={18} /> Security & API
          </button>
          
          <button 
            onClick={() => setActiveSection('database')} 
            className={`settings-nav-btn ${activeSection === 'database' ? 'active' : ''}`}
          >
            <RefreshCw size={18} /> Database & Backup
          </button>
        </div>

        {/* Content Card Panels */}
        <div className="settings-card">
          
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Enterprise Profile</h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
                Identify corporate taxonomy parameters for localized GSTIN auditing.
              </p>

              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label className="settings-label">Registered Corporate Name</label>
                    <input 
                      type="text" 
                      className="settings-input" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="settings-label">Tax ID (GSTIN)</label>
                    <input 
                      type="text" 
                      className="settings-input" 
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label className="settings-label">Operations Email Address</label>
                    <input 
                      type="email" 
                      className="settings-input" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="settings-label">Contact Phone Number</label>
                    <input 
                      type="text" 
                      className="settings-input" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label className="settings-label">Registered Office Address</label>
                  <textarea 
                    rows={3} 
                    className="settings-input" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ fontFamily: 'inherit', resize: 'none' }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    padding: '12px 24px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                    fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', outline: 'none',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  Save Profile Configurations
                </button>
              </form>
            </div>
          )}

          {/* LOCALIZATION SECTION */}
          {activeSection === 'localization' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Currency & Localization</h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
                Set display standardizations for global currencies and time formats.
              </p>

              <form onSubmit={handleSaveLocalization}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label className="settings-label">Base Ledger Currency</label>
                    <select 
                      className="settings-input"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="settings-label">Target Timezone</label>
                    <select 
                      className="settings-input"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="IST">India Standard Time (IST - UTC+5:30)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                      <option value="EST">Eastern Standard Time (EST - UTC-5)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '28px', maxWidth: '300px' }}>
                  <label className="settings-label">Default Date Formatting</label>
                  <select 
                    className="settings-input"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 26-05-2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-05-26)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/26/2026)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  style={{
                    padding: '12px 24px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                    fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', outline: 'none',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  Save Localizations
                </button>
              </form>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === 'security' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Security Controls</h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
                Regulate API integrations and user session timeout limits.
              </p>

              <form onSubmit={handleSaveSecurity}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', margin: 0 }}>Two-Factor Authentication (2FA)</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>Enforce secure Google Authenticator/SMS logins for operations hubs.</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label className="settings-label">User Session Timeout (Mins)</label>
                    <select 
                      className="settings-input"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="never">Never Timeout</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="settings-label">System API Key (Standard Dev)</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="password" 
                        readOnly 
                        className="settings-input" 
                        value={apiKey}
                        style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b', fontFamily: 'monospace' }}
                      />
                      <Key size={16} color="#94a3b8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  style={{
                    padding: '12px 24px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                    fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', outline: 'none',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  Confirm Security Audits
                </button>
              </form>
            </div>
          )}

          {/* DATABASE & BACKUP SECTION */}
          {activeSection === 'database' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Database & Local Backup</h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600, margin: '0 0 24px 0' }}>
                Wipe active local database instances or compile full JSON backups.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Download size={24} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#065f46', margin: 0 }}>Download Local DB Registry</h4>
                    <p style={{ fontSize: '0.82rem', color: '#047857', marginTop: '6px', fontWeight: 600, lineHeight: 1.5 }}>
                      Compile and download all product inventories, customer directories, local settings, and purchase registries into a single offline JSON ledger backup.
                    </p>
                    <button 
                      onClick={handleBackupDB}
                      style={{ 
                        marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#059669',
                        color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      Export Database Backup
                    </button>
                  </div>
                </div>

                <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Trash2 size={24} color="#be123c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#9f1239', margin: 0 }}>Reset Cache databases</h4>
                    <p style={{ fontSize: '0.82rem', color: '#be123c', marginTop: '6px', fontWeight: 600, lineHeight: 1.5 }}>
                      Permanently wipe all offline local storage databases (Categories, Inventory, Invoices, Sales, Products). All customized mock records will revert to initial factory settings.
                    </p>
                    <button 
                      onClick={handleWipeCache}
                      style={{ 
                        marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#e11d48',
                        color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      Wipe Database & Reset
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast-card" style={{ borderLeftColor: t.type === 'success' ? '#059669' : t.type === 'warning' ? '#ea580c' : t.type === 'error' ? '#e11d48' : '#6366f1' }}>
            <span style={{ flex: 1 }}>{t.text}</span>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, outline: 'none' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
