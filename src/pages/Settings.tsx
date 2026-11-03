import React, { useState } from 'react';
import { UserPreferences, UserProfile } from '../types/profile';
import { Moon, Bell, Globe, Shield, Check, Save } from 'lucide-react';
import { Alert } from '../components/ui/Alert';

interface SettingsProps {
  preferences: UserPreferences;
  profile: UserProfile;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({
  preferences,
  profile,
  onUpdatePreferences,
}) => {
  const [prefs, setPrefs] = useState<UserPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleToggle = (key: keyof UserPreferences) => {
    if (key === 'theme') return;
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      await onUpdatePreferences(prefs);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSaveError(err.message);
      } else {
        setSaveError('Failed to save preferences.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container settings-page">
      {/* React 19 Native Document Metadata */}
      <title>Settings &amp; Security — Smart Profile Manager</title>
      <meta name="description" content="Configure privacy, theme, two-factor authentication, and email alert preferences." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="https://smartprofile.dev/settings" />

      <div className="glass-panel form-card">
        <div className="form-header">
          <div>
            <h2 className="section-heading">Application & Account Preferences</h2>
            <p className="section-subheading">
              Configure notifications, privacy, theme modes, and security parameters.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ marginBottom: '1.25rem' }}>
            <Alert type="success" message="Preferences successfully synced with server." />
          </div>
        )}

        {saveError && (
          <div style={{ marginBottom: '1.25rem' }}>
            <Alert type="error" message={saveError} onClose={() => setSaveError(null)} />
          </div>
        )}

        <form onSubmit={handleSave} className="settings-form">
          {/* Preferences Group */}
          <div className="settings-group">
            <h4 className="settings-group-title">Experience & Appearance</h4>

            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon-bubble">
                  <Moon size={18} />
                </div>
                <div>
                  <div className="setting-title">Enforced Dark Theme</div>
                  <div className="setting-desc">Deep slate dark mode is actively optimized for high performance.</div>
                </div>
              </div>
              <span className="badge" style={{ margin: 0 }}>Active</span>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon-bubble">
                  <Bell size={18} />
                </div>
                <div>
                  <div className="setting-title">Email Notifications</div>
                  <div className="setting-desc">Receive real-time alerts when profile actions complete.</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={prefs.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Privacy & Security Group */}
          <div className="settings-group">
            <h4 className="settings-group-title">Security & Visibility</h4>

            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon-bubble">
                  <Globe size={18} />
                </div>
                <div>
                  <div className="setting-title">Public Developer Profile</div>
                  <div className="setting-desc">Allow profile to be visible to other workspace contributors.</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={prefs.publicProfile}
                  onChange={() => handleToggle('publicProfile')}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon-bubble">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="setting-title">Two-Factor Authentication</div>
                  <div className="setting-desc">Require verification challenge during sensitive profile updates.</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={prefs.twoFactorAuth}
                  onChange={() => handleToggle('twoFactorAuth')}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Account Summary */}
          <div className="settings-group">
            <h4 className="settings-group-title">Account Metadata</h4>
            <div className="account-meta-box">
              <div className="meta-pair">
                <span className="meta-label">Account ID:</span>
                <span className="meta-val mono">{profile.id}</span>
              </div>
              <div className="meta-pair">
                <span className="meta-label">Primary Email:</span>
                <span className="meta-val">{profile.email}</span>
              </div>
              <div className="meta-pair">
                <span className="meta-label">Last Synchronized:</span>
                <span className="meta-val">{new Date(profile.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="button-spinner" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  {saveSuccess ? <Check size={16} /> : <Save size={16} />}
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
