import React, { useEffect, useState } from 'react';
import type { ToastMessage, ProfileSettings, LocalizationSettings, SettingsSection } from '../types';

import { SettingsHeader }              from '../components/SettingsHeader';
import { SettingsNav }                 from '../components/SettingsNav';
import { SettingsProfileSection }      from '../components/SettingsProfileSection';
import { SettingsLocalizationSection } from '../components/SettingsLocalizationSection';
import { SettingsSecuritySection }     from '../components/SettingsSecuritySection';
import { SettingsDatabaseSection }     from '../components/SettingsDatabaseSection';
import { SettingsToastContainer }      from '../components/SettingsToastContainer';

import '../styles/settings.css';
import '../styles/settings-responsive.css';

const DEFAULT_PROFILE: ProfileSettings = {
  companyName: 'Viyan Tech Enterprises',
  gstin:       '27AAAAA1111A1Z1',
  email:       'operations@viyan.tech',
  phone:       '+91 98765 43210',
  address:     'Sector 4, HSR Layout, Bengaluru, Karnataka 560102'
};

const DEFAULT_LOCAL: LocalizationSettings = {
  currency:   'INR',
  timezone:   'IST',
  dateFormat: 'DD-MM-YYYY'
};

const API_KEY = 'viyan_live_pk_87e02a9bcf31070de62c5c';

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Profile state
  const [profile, setProfile] = useState<ProfileSettings>(DEFAULT_PROFILE);

  // Localization state
  const [localization, setLocalization] = useState<LocalizationSettings>(DEFAULT_LOCAL);

  // Security state
  const [twoFactor, setTwoFactor]           = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('ims_settings_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<ProfileSettings>;
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
      const savedLocal = localStorage.getItem('ims_settings_local');
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal) as Partial<LocalizationSettings>;
        setLocalization((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Handlers
  const handleProfileChange = (field: keyof ProfileSettings, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocalizationChange = (field: keyof LocalizationSettings, value: string) => {
    setLocalization((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('ims_settings_profile', JSON.stringify(profile));
      addToast('success', 'Enterprise Profile updated successfully');
    } catch {
      addToast('error', 'Failed to commit configurations to storage');
    }
  };

  const handleSaveLocalization = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('ims_settings_local', JSON.stringify(localization));
      addToast('success', 'Currency & Localization settings saved successfully');
    } catch {
      addToast('error', 'Failed to commit configurations');
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Security controls updated and compiled');
  };

  const handleBackupDB = () => {
    const data = {
      timestamp: new Date().toISOString(),
      profile,
      local: localization,
      version: 'v2.1-premium-node'
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', jsonString);
    anchor.setAttribute('download', `viyan_db_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    addToast('success', 'Local Database Backup generated and exported as JSON');
  };

  const handleWipeCache = () => {
    ['ims_dummy_products', 'ims_dummy_categories', 'ims_dummy_inventory',
     'ims_dummy_purchases', 'ims_dummy_sales', 'ims_dummy_customers', 'ims_dummy_suppliers']
      .forEach((key) => localStorage.removeItem(key));
    addToast('warning', 'Cached simulation databases cleared. Reload to sync defaults.');
  };

  return (
    <div className="settings-page-wrapper">
      <SettingsHeader />

      <div className="settings-layout">
        <SettingsNav activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="settings-card">
          {activeSection === 'profile' && (
            <SettingsProfileSection
              profile={profile}
              onChange={handleProfileChange}
              onSubmit={handleSaveProfile}
            />
          )}
          {activeSection === 'localization' && (
            <SettingsLocalizationSection
              localization={localization}
              onChange={handleLocalizationChange}
              onSubmit={handleSaveLocalization}
            />
          )}
          {activeSection === 'security' && (
            <SettingsSecuritySection
              twoFactor={twoFactor}
              sessionTimeout={sessionTimeout}
              apiKey={API_KEY}
              onTwoFactorChange={setTwoFactor}
              onSessionTimeoutChange={setSessionTimeout}
              onSubmit={handleSaveSecurity}
            />
          )}
          {activeSection === 'database' && (
            <SettingsDatabaseSection
              onBackup={handleBackupDB}
              onWipeCache={handleWipeCache}
            />
          )}
        </div>
      </div>

      <SettingsToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
