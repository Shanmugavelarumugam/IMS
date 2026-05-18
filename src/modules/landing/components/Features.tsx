 
import { Box, Warehouse, Barcode, BarChart3, ShoppingBag } from 'lucide-react';

export const Features = () => {
  const featureList = [
    {
      icon: <Box size={28} />,
      title: "Inventory Tracking",
      desc: "Track stock movement instantly and manage items with multi-location syncing.",
      gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)"
    },
    {
      icon: <Warehouse size={28} />,
      title: "Multi Warehouse",
      desc: "Handle stocks spanning different locations, floors, or regions easily.",
      gradient: "linear-gradient(135deg, #8B5CF6, #5B21B6)"
    },
    {
      icon: <Barcode size={28} />,
      title: "Barcode Support",
      desc: "Speed up warehouse workflows with dynamic barcode generation and scanning.",
      gradient: "linear-gradient(135deg, #10B981, #047857)"
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Reports & Analytics",
      desc: "Actionable real-time data visualizations for stock, sales, and replenishment.",
      gradient: "linear-gradient(135deg, #F59E0B, #B45309)"
    },
    {
      icon: <ShoppingBag size={28} />,
      title: "Purchase & Sales",
      desc: "Generate, track, and approve purchases and convert leads into final sales.",
      gradient: "linear-gradient(135deg, #EF4444, #B91C1C)"
    }
  ];

  return (
    <section id="features" style={{ 
      padding: '120px 40px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        
        .feature-card {
          background: #FFFFFF;
          border: 1px solid #F3F4F6;
          border-radius: 24px;
          padding: 40px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -12px rgba(17, 24, 39, 0.08);
          border-color: #E5E7EB;
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }

        .feature-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(4deg);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span style={{ 
          background: 'rgba(37, 99, 235, 0.08)', 
          color: '#2563EB', 
          padding: '8px 16px', 
          borderRadius: '100px', 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          display: 'inline-block',
          marginBottom: '20px'
        }}>
          Core Capabilities
        </span>
        
        <h2 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.03em', 
          color: '#111827',
          lineHeight: 1.1,
          marginBottom: '20px'
        }}>
          Everything you need to manage <br/> complex operations simply.
        </h2>
        
        <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>
          Streamlined components unified under a single centralized intelligence platform.
        </p>
      </div>

      <div className="feature-grid">
        {featureList.map((item, idx) => (
          <div key={idx} className="feature-card" style={{
             gridColumn: idx === 3 ? 'span 1' : 'auto', // Default behaviors
             // To make 5 look good, on 3 cols, the last 2 are on the last row.
          }}>
            <div className="icon-wrapper" style={{ background: item.gradient }}>
              {item.icon}
            </div>
            
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginBottom: '12px', letterSpacing: '-0.01em' }}>
              {item.title}
            </h3>
            
            <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500, flexGrow: 1 }}>
              {item.desc}
            </p>

            <a href="#pricing" style={{ 
              marginTop: '24px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#2563EB', 
              fontWeight: 700, 
              textDecoration: 'none', 
              fontSize: '0.9rem' 
            }}>
              Learn More →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
