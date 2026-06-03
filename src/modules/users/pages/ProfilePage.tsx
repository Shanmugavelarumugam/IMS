import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { authApi } from '../../../core/api/auth';

import { ProfileCoverCard } from '../components/ProfileCoverCard';
import { ProfileFormCard }  from '../components/ProfileFormCard';
import { ProfileSidePanel } from '../components/ProfileSidePanel';

import '../styles/profile.css';

export const ProfilePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [editName, setEditName] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      setProfile(res);
      setEditName(res.name || '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Node inaccessible');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchProfile(), 0);
    return () => clearTimeout(t);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await authApi.updateProfile({ name: editName });
      setSuccess('Identity Matrix synchronization complete.');
      await fetchProfile();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'System failure on write');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 size={36} className="spin" color="#6366f1" />
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <ProfileCoverCard profile={profile} />

      <div className="profile-content-grid">
        <ProfileFormCard
          profile={profile}
          editName={editName}
          saving={saving}
          success={success}
          error={error}
          onNameChange={setEditName}
          onSubmit={handleSave}
        />

        <ProfileSidePanel profile={profile} />
      </div>
    </div>
  );
};
