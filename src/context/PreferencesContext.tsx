import { ReactNode } from 'react';
import { UserPreferences } from '../types/profile';
import { PreferencesContext } from './preferencesContextDef';

export { PreferencesContext };

export interface PreferencesProviderProps {
  preferences: UserPreferences;
  children: ReactNode;
}

export function PreferencesProvider({
  preferences,
  children,
}: PreferencesProviderProps) {
  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
}
