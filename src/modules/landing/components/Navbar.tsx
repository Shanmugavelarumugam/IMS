import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import viyanLogo from '../../../assets/viyan_logo.png';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: scrolled ? '20px' : '30px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        zIndex: 9999,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: scrolled ? '12px 24px' : '18px 36px',
          background: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '100px',
          border: scrolled ? '1px solid rgba(229, 231, 235, 0.5)' : '1px solid transparent',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.06)' : '0 10px 40px rgba(0,0,0,0.04)',
          transition: 'all 0.4s ease'
        }}>
          <style>{`
            .brand-text {
              font-size: 1.4rem;
              font-weight: 800;
              letter-spacing: -0.03em;
              color: #111827;
              background: linear-gradient(135deg, #111827 0%, #374151 100%);
              -webkit-background-clip: text;
            }
            .nav-link-premium {
              color: #4B5563;
              font-size: 0.95rem;
              font-weight: 600;
              text-decoration: none;
              position: relative;
              padding: 8px 0;
              transition: color 0.2s ease;
            }
            .nav-link-premium:hover {
              color: #2563EB;
            }
            .nav-link-premium::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 50%;
              width: 0;
              height: 2px;
              background: #2563EB;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              transform: translateX(-50%);
            }
            .nav-link-premium:hover::after {
              width: 100%;
            }
            .btn-glow {
              background: linear-gradient(to right, #2563EB, #4F46E5);
              color: white !important;
              padding: 12px 28px;
              border-radius: 100px;
              font-weight: 700;
              text-transform: none;
              letter-spacing: -0.01em;
              box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
              transition: all 0.3s ease;
            }
            .btn-glow:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
              background: linear-gradient(to right, #1D4ED8, #4338CA);
            }
          `}</style>

          {/* Brand Wrapper */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ 
              background: 'white', 
              padding: '6px', 
              borderRadius: '50%', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              display: 'flex'
            }}>
              <img src={viyanLogo} alt="V" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
            </div>
            <span className="brand-text">Viyan</span>
          </Link>

          {/* Centered Dynamic Navigation */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" className="nav-link-premium">Features</a>
            <a href="#modules" className="nav-link-premium">Modules</a>
            <a href="#pricing" className="nav-link-premium">Pricing</a>
            <a href="#contact" className="nav-link-premium">Contact</a>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/login" style={{ color: '#111827', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              Log in
            </Link>
            <Link to="/signup" className="btn-glow" style={{ textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        </nav>
      </div>
      {/* Dummy spacer to counter top space */}
      <div style={{ height: scrolled ? '80px' : '100px' }}></div>
    </>
  );
};
