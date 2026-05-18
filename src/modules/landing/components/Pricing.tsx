 
import { Link } from 'react-router-dom';
import { colors } from '../theme';

export const Pricing = () => {
  return (
    <section id="pricing" style={{ padding: '100px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Flexible Plans for Teams of all Sizes</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div className="price-card">
          <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '10px' }}>Starter</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>₹999 <span style={{ fontSize: '1rem', color: colors.textSec, fontWeight: 500 }}>/mo</span></div>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>✅ Up to 500 SKU</li>
            <li>✅ Single Warehouse</li>
            <li>✅ Basic Reports</li>
          </ul>
          <Link to="/app" style={{ 
            marginTop: 'auto', textAlign: 'center', padding: '12px', borderRadius: '8px', 
            border: '1px solid #E5E7EB', fontWeight: 600, color: 'inherit'
          }}>Get Started</Link>
        </div>

        <div className="price-card featured">
          <div style={{ 
            position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', 
            background: colors.accent, color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 700
          }}>Popular</div>
          <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '10px' }}>Business</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>₹2999 <span style={{ fontSize: '1rem', color: colors.textSec, fontWeight: 500 }}>/mo</span></div>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>✅ Unlimited SKU</li>
            <li>✅ 5 Warehouses</li>
            <li>✅ Advanced Analytics</li>
            <li>✅ Priority Support</li>
          </ul>
          <Link to="/app" className="btn-accent" style={{ marginTop: 'auto', textAlign: 'center', color: 'white' }}>Start Trial</Link>
        </div>

        <div className="price-card">
          <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '10px' }}>Enterprise</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Custom</div>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>✅ Everything in Business</li>
            <li>✅ Dedicated Success Manager</li>
            <li>✅ Custom Integrations</li>
            <li>✅ White-label Capabilities</li>
          </ul>
          <Link to="/app" style={{ 
            marginTop: 'auto', textAlign: 'center', padding: '12px', borderRadius: '8px', 
            border: '1px solid #E5E7EB', fontWeight: 600, color: 'inherit'
          }}>Talk to Sales</Link>
        </div>
      </div>
    </section>
  );
};
