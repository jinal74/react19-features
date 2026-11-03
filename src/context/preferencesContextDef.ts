import { createContext } from 'react';
import { UserPreferences } from '../types/profile';

export const PreferencesContext = createContext<UserPreferences | null>(null);
