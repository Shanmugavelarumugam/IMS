 
import { CheckCircle2 } from 'lucide-react';
import { colors } from '../theme';

export const Modules = () => {
  return (
    <section id="modules" style={{ background: colors.primary, color: colors.white, padding: '100px 80px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>One Centralized Ecosystem</h2>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem', marginBottom: '40px' }}>Access modular ERP components connected flawlessly under one account.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {['Inventory', 'Sales', 'Purchases', 'Warehouse', 'Suppliers', 'Customers', 'Reports', 'Staff Management'].map(mod => (
              <div key={mod} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                <CheckCircle2 size={20} color={colors.accent} />
                {mod}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#1F2937', borderRadius: '24px', padding: '40px', border: '1px solid #374151' }}>
           <h4 style={{ color: colors.accent, fontWeight: 700, marginBottom: '8px' }}>Why Choose Us</h4>
           <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px' }}>Built to solve your operational bottlenecks</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div>
               <div style={{ fontWeight: 700, marginBottom: '4px' }}>⚡ Faster Operations</div>
               <div style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Reduce manual entry errors by 95%.</div>
             </div>
             <div>
               <div style={{ fontWeight: 700, marginBottom: '4px' }}>🔄 Real-Time Updates</div>
               <div style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Sync data across offline terminals and digital stores instantly.</div>
             </div>
             <div>
               <div style={{ fontWeight: 700, marginBottom: '4px' }}>☁️ Cloud Based</div>
               <div style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Login and perform audit checks anywhere on any device.</div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};
