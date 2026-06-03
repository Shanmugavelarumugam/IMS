export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

export interface ProfileSettings {
  companyName: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
}

export interface LocalizationSettings {
  currency: string;
  timezone: string;
  dateFormat: string;
}

export type SettingsSection = 'profile' | 'localization' | 'security' | 'database';
