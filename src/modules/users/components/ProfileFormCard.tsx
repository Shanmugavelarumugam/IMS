import React from 'react';
import { User, Mail, Save, Loader2, CheckCircle2, Lock } from 'lucide-react';

interface ProfileFormCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
  editName: string;
  saving: boolean;
  success: string;
  error: string;
  onNameChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileFormCard: React.FC<ProfileFormCardProps> = ({
  profile,
  editName,
  saving,
  success,
  error,
  onNameChange,
  onSubmit
}) => (
  <div className="viyan-glass-card" style={{ padding: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
      <div style={{ background: '#EEF2FF', color: '#6366f1', padding: '10px', borderRadius: '12px' }}>
        <User size={24} />
      </div>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>System Identity Profile</h2>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Configure public resolution name across your entire organization.</p>
      </div>
    </div>

    {success && (
      <div style={{ padding: '14px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle2 size={18} /> {success}
      </div>
    )}
    {error && (
      <div style={{ padding: '14px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px' }}>
        {error}
      </div>
    )}

    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>Full Legal / System Display Name</label>
          <div style={{ position: 'relative' }}>
            <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="premium-input"
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: '#374151', marginBottom: '8px' }}>Protected Identity Key (Email)</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              className="premium-input"
              style={{ background: '#F3F4F6', cursor: 'not-allowed', color: '#6B7280' }}
              value={profile?.email || ''}
              disabled
            />
            <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '6px', fontWeight: 500 }}>Contact infrastructure root support to migrate administrative identity keys.</p>
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ background: '#111827', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(17, 24, 39, 0.15)', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <Loader2 className="spin" size={20} /> : <Save size={20} />}
            Safeguard &amp; Update
          </button>
        </div>
      </div>
    </form>
  </div>
);
