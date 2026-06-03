import React from 'react';
import { Building2, Globe, Shield, RefreshCw } from 'lucide-react';
import type { SettingsSection } from '../types';

interface SettingsNavProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const NAV_ITEMS: { id: SettingsSection; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'profile',      label: 'Enterprise Profile', Icon: Building2 },
  { id: 'localization', label: 'Localization',        Icon: Globe     },
  { id: 'security',     label: 'Security & API',      Icon: Shield    },
  { id: 'database',     label: 'Database & Backup',   Icon: RefreshCw }
];

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeSection, onSectionChange }) => (
  <div className="settings-nav">
    {NAV_ITEMS.map(({ id, label, Icon }) => (
      <button
        key={id}
        onClick={() => onSectionChange(id)}
        className={`settings-nav-btn${activeSection === id ? ' active' : ''}`}
      >
        <Icon size={18} /> {label}
      </button>
    ))}
  </div>
);
