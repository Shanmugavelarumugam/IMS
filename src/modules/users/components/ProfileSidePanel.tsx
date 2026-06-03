import React from 'react';
import { Building2, Globe, Shield, Activity, Calendar } from 'lucide-react';

interface ProfileSidePanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}

export const ProfileSidePanel: React.FC<ProfileSidePanelProps> = ({ profile }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

    {/* Tenant architecture snapshot */}
    <div className="viyan-glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Building2 size={20} color="#6366f1" />
        <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Secure Instance Routing</h3>
      </div>
      <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '16px', border: '1px solid #F3F4F6', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Target Workspace ID</div>
        <div style={{ fontFamily: 'Monaco, Courier New, monospace', fontWeight: 700, color: '#111827', fontSize: '1rem' }}>
          {profile?.businessId || 'NULL_PTR_LINK'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>
        <Globe size={16} /> Regional Domain Isolation Active
      </div>
    </div>

    {/* Security integrity box */}
    <div className="viyan-glass-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '24px', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Shield size={22} color="#38bdf8" />
        <h3 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>Governance Metric</h3>
      </div>
      <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '20px', lineHeight: 1.5 }}>
        Your session identity utilizes strictly segmented authority policies managed under high-assurance standards.
      </p>
      <div style={{ height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
        <div style={{ height: '100%', width: '100%', background: '#38bdf8', borderRadius: '2px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
        <span style={{ color: '#38bdf8' }}>TRUST RATING MAX</span>
        <span>100%</span>
      </div>
    </div>

    {/* Activity log hint */}
    <div className="viyan-glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ height: '44px', width: '44px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Activity size={20} />
      </div>
      <div>
        <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>Active Login Audit</div>
        <div style={{ color: '#6B7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <Calendar size={12} /> Last verified moments ago
        </div>
      </div>
    </div>

  </div>
);
