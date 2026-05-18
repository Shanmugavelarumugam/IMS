 
import { Link } from 'react-router-dom';
import dashboardMockup from '../../../assets/dashboard_mockup.png';
import { colors } from '../theme';

export const Hero = () => {
  return (
    <section style={{ 
      padding: '80px 24px 40px 24px', 
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.01); }
        }
        .hero-entrance {
          opacity: 0;
          animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-float-item {
          animation: heroFloat 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .pulse-btn {
          position: relative;
          overflow: hidden;
        }
        .pulse-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-25deg);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          100% { left: 200%; }
        }
      `}</style>

      {/* Pre-header Badge (Entrance 1) */}
      <div className="hero-entrance" style={{ 
        animationDelay: '0.1s',
        background: 'rgba(37, 99, 235, 0.06)', 
        color: colors.accent, 
        padding: '10px 20px', 
        borderRadius: '100px', 
        fontSize: '0.9rem', 
        fontWeight: 700, 
        marginBottom: '32px',
        border: '1px solid rgba(37, 99, 235, 0.1)',
        letterSpacing: '0.02em'
      }}>
        🚀 The Next Era of Inventory Management
      </div>

      {/* H1 Headline (Entrance 2) */}
      <h1 className="hero-entrance" style={{ 
        animationDelay: '0.2s',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', 
        lineHeight: 1.15, 
        fontWeight: 800, 
        letterSpacing: '-0.04em', 
        marginBottom: '24px',
        color: colors.primary,
        maxWidth: '950px'
      }}>
        Inventory management software <br />
        designed for <span style={{ color: colors.accent }}>Modern Indian Businesses</span>
      </h1>

      {/* Sub-headline */}
      <p className="hero-entrance" style={{ 
        animationDelay: '0.3s',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '1.25rem', 
        color: colors.textSec, 
        marginBottom: '40px', 
        lineHeight: 1.6,
        fontWeight: 500,
        maxWidth: '750px'
      }}>
        Organize inventory, manage purchase/sales orders, and track shipping from an end-to-end solution that simplifies your daily operational tasks.
      </p>

      {/* Side-by-side CTAs */}
      <div className="hero-entrance" style={{ 
        animationDelay: '0.4s',
        display: 'flex', gap: '20px', marginBottom: '60px', flexWrap: 'wrap', justifyContent: 'center' 
      }}>
        <Link to="/signup" className="btn-accent pulse-btn" style={{ fontSize: '1.1rem', padding: '16px 40px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          SIGN UP NOW
        </Link>
        <button style={{ 
          padding: '16px 40px', 
          borderRadius: '4px', 
          border: `2px solid ${colors.accent}`, 
          background: 'transparent',
          color: colors.accent,
          fontWeight: 700,
          fontSize: '1.1rem',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          transition: 'all 0.2s'
        }} onMouseOver={(e) => { e.currentTarget.style.background = colors.accent; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.accent; }}>
          EXPLORE DEMO
        </button>
      </div>

      {/* Massive centered product asset at the bottom of hero */}
      <div className="hero-entrance" style={{ 
        animationDelay: '0.5s',
        position: 'relative',
        width: '100%',
        maxWidth: '1050px',
        perspective: '1000px',
        marginTop: '20px'
      }}>
        <div className="hero-float-item" style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3)',
          transform: 'rotateX(2deg)',
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'white'
        }}>
          <img 
            src={dashboardMockup} 
            alt="Viyan Inventory Dashboard" 
            style={{ 
              width: '100%', 
              height: 'auto',
              display: 'block'
            }} 
          />
        </div>
        
        {/* Decorative Glass Elements behind/near */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '200px',
          background: `linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, transparent 100%)`,
          filter: 'blur(40px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />
      </div>
    </section>
  );
};
