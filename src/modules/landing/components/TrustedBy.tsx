 
import { colors } from '../theme';

export const TrustedBy = () => {
  return (
    <section style={{ padding: '40px', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', textAlign: 'center', background: '#FFF' }}>
      <p style={{ color: colors.textSec, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem', marginBottom: '24px' }}>
        Trusted by 500+ growing businesses
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', opacity: 0.5, fontSize: '1.5rem', fontWeight: '800' }}>
        <span>NEXUS</span>
        <span>ORION</span>
        <span>ACME CO</span>
        <span>VELOCITY</span>
        <span>QUANTUM</span>
      </div>
    </section>
  );
};
