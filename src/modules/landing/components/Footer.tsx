 
import { colors } from '../theme';
import viyanLogo from '../../../assets/viyan_logo.png';

export const Footer = () => {
  return (
    <footer style={{ padding: '60px 80px', background: colors.primary, color: '#D1D5DB', borderTop: '1px solid #374151' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            <div style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '8px', height: '40px', width: '40px' }}>
              <img src={viyanLogo} alt="Logo" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </div>
            Viyan Inventory
          </div>
          <p style={{ maxWidth: '300px', fontSize: '0.95rem' }}>The modern standard in inventory management system ecosystem for mid-sized businesses.</p>
        </div>
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px' }}>Product</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li>Features</li>
            <li>Modules</li>
            <li>Integrations</li>
            <li>Pricing</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '20px' }}>Contact</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li>support@imspro.com</li>
            <li>1-800-INVENTORY</li>
            <li>Bengaluru, India</li>
          </ul>
        </div>
      </div>
      <div style={{ maxWidth: '1300px', margin: '40px auto 0', borderTop: '1px solid #374151', paddingTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
        © 2026 Viyan Inventory. All rights reserved.
      </div>
    </footer>
  );
};
