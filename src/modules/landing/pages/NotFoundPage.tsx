import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import viyanLogo from '../../../assets/viyan_logo.png';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-viewport">
      <style>{`
        .notfound-viewport {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #e0e7ff 0%, #f8fafc 50%, #f1f5f9 100%);
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px;
          box-sizing: border-box;
        }

        /* Ambient Glowing Background Orbs */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.22;
          pointer-events: none;
          z-index: 0;
        }
        .orb-blue {
          width: 500px;
          height: 500px;
          background: #4f46e5;
          top: -100px;
          right: -100px;
          animation: floatOrb1 25s infinite ease-in-out alternate;
        }
        .orb-purple {
          width: 600px;
          height: 600px;
          background: #9333ea;
          bottom: -150px;
          left: -150px;
          animation: floatOrb2 30s infinite ease-in-out alternate;
        }

        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-80px, 120px) scale(1.15); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(100px, -150px) scale(1.2); }
        }

        /* Core Glassmorphic Layout Card */
        .notfound-card {
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 28px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 
            0 20px 50px -12px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(79, 70, 229, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(40px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Brand Branding Node */
        .notfound-logo-container {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 50px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
          animation: logoEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
        }
        
        .notfound-logo {
          height: 20px;
          width: 20px;
          border-radius: 4px;
        }
        
        .notfound-logo-text {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes logoEntrance {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Animated Isometric Crate Scene */
        .crate-scene-container {
          width: 240px;
          height: 160px;
          margin-bottom: 12px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-crate {
          animation: floatBox 5s infinite ease-in-out;
          transform-origin: center;
        }

        @keyframes floatBox {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        .scanning-radar {
          animation: radarPulse 3s infinite cubic-bezier(0.4, 0, 0.6, 1);
          transform-origin: 120px 115px;
        }

        @keyframes radarPulse {
          0% { transform: scale(0.9); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(0.9); opacity: 0.3; }
        }

        .scanning-beam {
          stroke-dasharray: 4, 4;
          animation: dashMove 20s infinite linear;
        }

        @keyframes dashMove {
          to { stroke-dashoffset: -200; }
        }

        /* Particle Float Up */
        .sparkle {
          animation: particleUp 5s infinite linear;
          opacity: 0;
        }
        .sparkle-1 { animation-delay: 0.5s; }
        .sparkle-2 { animation-delay: 2.2s; }
        .sparkle-3 { animation-delay: 3.7s; }

        @keyframes particleUp {
          0% { transform: translateY(20px) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }

        /* Typography & Headings */
        .err-code-text {
          font-size: 5.5rem;
          font-weight: 900;
          line-height: 1;
          margin: 0;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.08));
          animation: numberEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards;
        }

        @keyframes numberEntrance {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }

        .err-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin: 8px 0 12px;
          letter-spacing: -0.02em;
          animation: titleEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
        }

        @keyframes titleEntrance {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .err-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 32px;
          max-width: 380px;
          font-weight: 500;
          animation: descEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s backwards;
        }

        @keyframes descEntrance {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Buttons & Actions Layout */
        .actions-layout {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 380px;
          animation: actionsEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
        }

        @keyframes actionsEntrance {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .btn-card-primary {
          flex: 1.2;
          background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
          color: white;
          padding: 14px 22px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 24px -6px rgba(79, 70, 229, 0.3);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
        }

        .btn-card-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -4px rgba(79, 70, 229, 0.45);
        }

        .btn-card-primary:active {
          transform: translateY(0);
        }

        .btn-card-secondary {
          flex: 0.8;
          background: #ffffff;
          color: #475569;
          border: 1.5px solid #e2e8f0;
          padding: 13px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .btn-card-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateY(-1px);
        }

        .btn-card-secondary:active {
          transform: translateY(0);
        }

        /* Sector System Code Badge */
        .system-sector-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 40px;
          animation: badgeEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards;
        }

        .system-status-indicator {
          height: 6px;
          width: 6px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
          animation: pulseStatus 2s infinite alternate;
        }

        @keyframes pulseStatus {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 1; }
        }

        @keyframes badgeEntrance {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @media (max-width: 580px) {
          .notfound-card {
            padding: 36px 24px;
            border-radius: 20px;
          }
          .err-code-text {
            font-size: 4.5rem;
          }
          .err-title {
            font-size: 1.4rem;
          }
          .actions-layout {
            flex-direction: column;
            gap: 12px;
          }
          .btn-card-primary, .btn-card-secondary {
            width: 100%;
            flex: none;
          }
        }
      `}</style>

      {/* Decorative Blur Backgrounds */}
      <div className="glow-orb orb-blue"></div>
      <div className="glow-orb orb-purple"></div>

      <div className="notfound-card">
        {/* Viyan Branding */}
        <div className="notfound-logo-container">
          <img src={viyanLogo} alt="Viyan Logo" className="notfound-logo" />
          <span className="notfound-logo-text">Viyan Inventary</span>
        </div>

        {/* Beautiful Animated Isometric Scene */}
        <div className="crate-scene-container">
          <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="radarGrad" cx="120" cy="115" r="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                <stop offset="60%" stopColor="#9333ea" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gridLineGrad" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0" />
                <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="boxTop" x1="120" y1="35" x2="120" y2="65" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="boxLeft" x1="85" y1="50" x2="120" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="boxRight" x1="155" y1="50" x2="120" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>

            {/* Isometric Grid Base */}
            <ellipse cx="120" cy="115" rx="75" ry="32" fill="url(#radarGrad)" />
            <ellipse cx="120" cy="115" rx="75" ry="32" stroke="url(#gridLineGrad)" strokeWidth="1" className="scanning-radar" />
            <ellipse cx="120" cy="115" rx="50" ry="21" stroke="url(#gridLineGrad)" strokeWidth="1" strokeDasharray="3, 3" />
            <ellipse cx="120" cy="115" rx="25" ry="11" stroke="#cbd5e1" strokeOpacity="0.2" strokeWidth="1" />

            {/* Radar Coordinates Axes */}
            <line x1="45" y1="115" x2="195" y2="115" stroke="url(#gridLineGrad)" strokeWidth="1" />
            <line x1="120" y1="83" x2="120" y2="147" stroke="url(#gridLineGrad)" strokeWidth="1" />

            {/* Floating Crate Particles */}
            <circle cx="95" cy="85" r="2.5" fill="#6366f1" className="sparkle sparkle-1" />
            <circle cx="150" cy="70" r="1.5" fill="#9333ea" className="sparkle sparkle-2" />
            <circle cx="110" cy="65" r="2" fill="#818cf8" className="sparkle sparkle-3" />

            {/* Scanning Laser Beam Lines (dotted target lines) */}
            <path d="M70,95 L120,65 L170,95" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2, 2" />
            <path d="M120,65 L120,115" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.3" className="scanning-beam" />

            {/* The Floating Isometric Crate */}
            <g className="floating-crate">
              {/* Subtle Drop Shadow on base of box */}
              <ellipse cx="120" cy="110" rx="30" ry="12" fill="#000000" fillOpacity="0.08" filter="blur(4px)" />

              {/* Cube Top Face */}
              <polygon points="120,35 155,50 120,65 85,50" fill="url(#boxTop)" />
              {/* Cube Left Face */}
              <polygon points="85,50 120,65 120,95 85,80" fill="url(#boxLeft)" />
              {/* Cube Right Face */}
              <polygon points="155,50 120,65 120,95 155,80" fill="url(#boxRight)" />

              {/* Inner details / tape / design lines of the cargo box */}
              <polygon points="120,35 126,38 120,41 114,38" fill="#e0e7ff" fillOpacity="0.7" />
              <line x1="120" y1="41" x2="120" y2="65" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="85" y1="50" x2="120" y2="65" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
              <line x1="155" y1="50" x2="120" y2="65" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
            </g>

            {/* Holographic Target Rings above the crate */}
            <ellipse cx="120" cy="22" rx="14" ry="6" stroke="#a5b4fc" strokeWidth="1" strokeOpacity="0.3" />
            <ellipse cx="120" cy="16" rx="8" ry="3.5" stroke="#9333ea" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="1, 1" />
          </svg>
        </div>

        {/* 404 Text */}
        <h1 className="err-code-text">404</h1>

        {/* Headings */}
        <h2 className="err-title">This Page Is Unavailable</h2>
        <p className="err-description">
          The page you're looking for could not be found or may have been moved. Check the URL or return to your dashboard.
        </p>

        {/* Actions */}
        <div className="actions-layout">
          <button 
            className="btn-card-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} strokeWidth={2.4} />
            Back
          </button>
          
          <button 
            className="btn-card-primary"
            onClick={() => navigate('/app')}
          >
            <LayoutDashboard size={18} strokeWidth={2.4} />
            Go to Dashboard
          </button>
        </div>

        {/* System Node Info */}
        <div className="system-sector-badge">
          <span className="system-status-indicator"></span>
          VIYAN IMS • ERROR 404
        </div>
      </div>
    </div>
  );
};
