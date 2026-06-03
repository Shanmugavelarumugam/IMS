import React from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

interface ProfileCoverCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}

export const ProfileCoverCard: React.FC<ProfileCoverCardProps> = ({ profile }) => (
  <div className="viyan-glass-card" style={{ marginBottom: '32px', position: 'relative' }}>
    <div className="profile-gradient-header">
      {/* Abstract geometric texture */}
      <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
        <svg width="400" height="160" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="350" cy="30" r="120" stroke="white" strokeWidth="2" />
          <circle cx="250" cy="130" r="80" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </div>

    <div style={{ padding: '0 40px 32px', marginTop: '-60px', display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {/* Floating avatar */}
      <div style={{ height: '120px', width: '120px', borderRadius: '24px', background: 'white', padding: '6px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)', zIndex: 10 }}>
        <div style={{ height: '100%', width: '100%', background: 'linear-gradient(to bottom right, #4F46E5, #7C3AED)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 800 }}>
          {profile?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>

      {/* Name / email */}
      <div style={{ flex: 1, paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', margin: 0 }}>
            {profile?.name}
          </h1>
          <div className="profile-status-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={14} /> Active Node
          </div>
        </div>
        <p style={{ color: '#6B7280', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <Mail size={16} /> {profile?.email}
        </p>
      </div>

      {/* Role pill */}
      <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
        <div style={{ textAlign: 'center', padding: '8px 24px', background: '#F3F4F6', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', color: '#6B7280' }}>Authorized Role</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>{profile?.role || 'ADMIN'}</div>
        </div>
      </div>
    </div>
  </div>
);
