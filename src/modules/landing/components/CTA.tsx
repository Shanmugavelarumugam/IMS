 
import { Link } from 'react-router-dom';
import { colors } from '../theme';

export const CTA = () => {
  return (
    <section style={{ background: colors.accent, color: 'white', padding: '80px 40px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Ready to simplify your inventory?</h2>
      <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '32px' }}>Join 500+ businesses growing with modern operational efficiency.</p>
      <Link to="/app" style={{ background: 'white', color: colors.accent, padding: '16px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem', display: 'inline-block' }}>
        Start Free Trial
      </Link>
    </section>
  );
};
