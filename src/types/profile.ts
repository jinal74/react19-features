export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  title: string;
  avatarUrl: string;
  skills: string[];
  location: string;
  githubUrl: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  type: 'profile' | 'skill' | 'security' | 'setting';
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  emailNotifications: boolean;
  publicProfile: boolean;
  twoFactorAuth: boolean;
}

export type ActiveTab = 'dashboard' | 'profile' | 'settings';
