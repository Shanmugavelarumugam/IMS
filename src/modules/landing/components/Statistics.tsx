 
import { colors } from '../theme';

export const Statistics = () => {
  return (
    <section style={{ padding: '80px 0', background: '#FFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
        <div className="stat-box">
          <div style={{ fontSize: '3rem', fontWeight: 800, color: colors.accent }}>10K+</div>
          <div style={{ color: colors.textSec, fontWeight: 500 }}>Products Managed</div>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: '3rem', fontWeight: 800, color: colors.accent }}>500+</div>
          <div style={{ color: colors.textSec, fontWeight: 500 }}>Active Businesses</div>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: '3rem', fontWeight: 800, color: colors.accent }}>99.9%</div>
          <div style={{ color: colors.textSec, fontWeight: 500 }}>Accuracy</div>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: '3rem', fontWeight: 800, color: colors.accent }}>24/7</div>
          <div style={{ color: colors.textSec, fontWeight: 500 }}>Expert Support</div>
        </div>
      </div>
    </section>
  );
};
