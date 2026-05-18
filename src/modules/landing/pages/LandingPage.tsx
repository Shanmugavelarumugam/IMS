import React from 'react';
import { colors } from '../theme';

// Import split sub-components
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustedBy } from '../components/TrustedBy';
import { Features } from '../components/Features';
import { Modules } from '../components/Modules';
import { Statistics } from '../components/Statistics';
import { Pricing } from '../components/Pricing';
import { Testimonial } from '../components/Testimonial';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-item');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div style={{
      background: colors.bg,
      color: colors.primary,
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        
        /* Reveal on Scroll Architecture */
        .reveal-item {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Delays to create sequential waves */
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }

        /* Custom Ambient Background Orbs for Alive Page Feeling */
        .glow-bg {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          opacity: 0.15;
          pointer-events: none;
          animation: float-glow 20s infinite ease-in-out alternate;
        }
        @keyframes float-glow {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 100px) scale(1.2); }
        }

        .btn-accent {
          background: ${colors.accent};
          color: white;
          border: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
        }
        .btn-accent:hover {
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid #E5E7EB;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
        .stat-box {
          text-align: center;
        }
        .price-card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
        }
        .price-card.featured {
          border-color: ${colors.accent};
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.1);
          position: relative;
        }
        .nav-link {
          color: ${colors.textSec};
          font-size: 0.95rem;
          position: relative;
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link:hover {
          color: ${colors.primary};
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: ${colors.accent};
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .floating-nav {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(229, 231, 235, 0.6);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Dynamic Live Background Ambient Lighting */}
      <div className="glow-bg" style={{ width: '500px', height: '500px', background: '#2563EB', top: '-100px', right: '-100px' }}></div>
      <div className="glow-bg" style={{ width: '600px', height: '600px', background: '#4F46E5', bottom: '20%', left: '-100px', animationDelay: '-5s' }}></div>

      <Navbar />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <TrustedBy />
        <div className="reveal-item"><Features /></div>
        <div className="reveal-item"><Modules /></div>
        <div className="reveal-item"><Statistics /></div>
        <div className="reveal-item"><Pricing /></div>
        <div className="reveal-item"><Testimonial /></div>
        <div className="reveal-item"><CTA /></div>
        <Footer />
      </div>
    </div>
  );
};
