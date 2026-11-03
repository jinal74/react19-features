import React, { useState, Suspense, use } from 'react';
import { UserProfile, ActivityItem, ActiveTab } from '../types/profile';
import { ProfileCard } from '../components/profile/ProfileCard';
import { SuspenseProfileCard } from '../components/profile/SuspenseProfileCard';
import { ProfileCardSkeleton } from '../components/profile/ProfileCardSkeleton';
import { ActivitySkeleton } from '../components/activity/ActivitySkeleton';
import { ActivityStreamWithUse } from '../components/activity/ActivityStreamWithUse';
import { LiveResizeObserverCard } from '../components/ui/LiveResizeObserverCard';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { PreferencesContext } from '../context/preferencesContextDef';
import { getProfile, getActivities } from '../services/profileApi';
import { User, Settings, Layers, Code, Zap, Shield, Eye, EyeOff, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  activities: ActivityItem[];
  onNavigate: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, activities, onNavigate }) => {
  const [showLivePreferences, setShowLivePreferences] = useState(true);

  // Independent Promises for Granular Nested Suspense Boundaries
  const [profilePromise, setProfilePromise] = useState<Promise<UserProfile> | null>(null);
  const [activityPromise, setActivityPromise] = useState<Promise<ActivityItem[]> | null>(null);

  // Conditional use(Context) in React 19
  let livePreferences = null;
  if (showLivePreferences) {
    livePreferences = use(PreferencesContext);
  }

  const handleSimulateProfileStream = () => {
    setProfilePromise(getProfile());
  };

  const handleSimulateActivityStream = () => {
    setActivityPromise(getActivities());
  };

  const handleSimulateStreamError = () => {
    setProfilePromise(
      new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('500 Server Error: Simulated stream failure caught by ErrorBoundary!')),
          600
        );
      })
    );
  };

  return (
    <div className="page-container dashboard-page">
      {/* React 19 Native Document Metadata Hoisted directly into <head> */}
      <title>Dashboard — Smart Profile Manager (React 19)</title>
      <meta name="description" content="Manage developer skills, profile attributes, and real-time audit logs in React 19." />
      <meta name="keywords" content="React 19, Actions, Suspense, useOptimistic, TypeScript" />
      <link rel="canonical" href="https://smartprofile.dev/dashboard" />

      {/* Top Banner introducing Metadata & Suspense */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge" style={{ marginBottom: '0.2rem' }}>
            <Sparkles size={12} /> React 19 Resilience: Suspense + Error Boundaries
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Each widget below is wrapped in its own independent <code>&lt;ErrorBoundary&gt;</code> and <code>&lt;Suspense&gt;</code> boundary.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSimulateProfileStream}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <RefreshCw size={13} />
            <span>Stream Profile</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateStreamError}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', color: '#fca5a5', borderColor: 'rgba(244, 63, 94, 0.4)' }}
            title="Simulate asynchronous 500 error caught by ErrorBoundary"
          >
            <AlertTriangle size={13} />
            <span>Simulate Stream Error</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateActivityStream}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <RefreshCw size={13} />
            <span>Stream Feed</span>
          </button>
        </div>
      </div>

      {/* Quick Stat Highlight Cards */}
      <div className="stats-row">
        <div className="glass-panel stat-box">
          <div className="stat-icon-wrapper accent">
            <Layers size={20} />
          </div>
          <div>
            <div className="stat-label">Active Skills</div>
            <div className="stat-value">{profile.skills.length}</div>
          </div>
        </div>

        <div className="glass-panel stat-box">
          <div className="stat-icon-wrapper success">
            <Zap size={20} />
          </div>
          <div>
            <div className="stat-label">React Engine</div>
            <div className="stat-value">v19.3.0</div>
          </div>
        </div>

        <div className="glass-panel stat-box">
          <div className="stat-icon-wrapper info">
            <Code size={20} />
          </div>
          <div>
            <div className="stat-label">Boundary Strategy</div>
            <div className="stat-value" style={{ fontSize: '1rem', color: '#38bdf8' }}>
              Granular Skeletons
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid with NESTED SUSPENSE BOUNDARIES */}
      <div className="dashboard-grid">
        {/* Left Column: Suspense Boundary A (Profile Card) */}
        <div className="dashboard-main-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {profilePromise ? (
            /* Granular ErrorBoundary + Suspense Boundary for Profile Card */
            <ErrorBoundary onReset={() => setProfilePromise(null)}>
              <Suspense fallback={<ProfileCardSkeleton />}>
                <SuspenseProfileCard
                  profilePromise={profilePromise}
                  onNavigateToProfile={() => onNavigate('profile')}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <ProfileCard
              profile={profile}
              onNavigateToProfile={() => onNavigate('profile')}
            />
          )}

          {/* Live Ref Cleanup Container: ResizeObserver teardown on unmount */}
          <LiveResizeObserverCard title="Live Preferences Subtree (Observed via Ref Cleanup)">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div className="badge" style={{ marginBottom: '0.25rem' }}>
                  <Sparkles size={12} /> React 19: Conditional use(Context)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  This container uses a Ref Cleanup callback to manage a live ResizeObserver.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLivePreferences((prev) => !prev)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {showLivePreferences ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showLivePreferences ? 'Disable use()' : 'Enable use()'}</span>
              </button>
            </div>

            {livePreferences ? (
              <div className="account-meta-box">
                <div className="meta-pair">
                  <span className="meta-label">
                    <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Two-Factor Auth:
                  </span>
                  <span className="meta-val" style={{ color: livePreferences.twoFactorAuth ? 'var(--success)' : 'var(--danger)' }}>
                    {livePreferences.twoFactorAuth ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="meta-pair">
                  <span className="meta-label">Email Notifications:</span>
                  <span className="meta-val">
                    {livePreferences.emailNotifications ? 'Subscribed' : 'Muted'}
                  </span>
                </div>
                <div className="meta-pair">
                  <span className="meta-label">Public Visibility:</span>
                  <span className="meta-val">
                    {livePreferences.publicProfile ? 'Public to Workspace' : 'Private'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="empty-notice" style={{ padding: '0.5rem 0' }}>
                Context reading skipped conditionally (use() was not executed).
              </p>
            )}
          </LiveResizeObserverCard>
        </div>

        {/* Right Column: Quick Actions + Suspense Boundary B (Activity Stream) */}
        <div className="dashboard-side-col">
          {/* Quick Actions Panel */}
          <div className="glass-panel quick-actions-panel">
            <h3 className="section-heading">Quick Actions</h3>
            <div className="quick-actions-list">
              <button
                onClick={() => onNavigate('profile')}
                className="quick-action-btn"
                type="button"
              >
                <div className="action-btn-icon">
                  <User size={16} />
                </div>
                <div className="action-btn-text">
                  <span className="action-title">Manage Profile & Skills</span>
                  <span className="action-desc">Edit bio, title, and technical competencies</span>
                </div>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="quick-action-btn"
                type="button"
              >
                <div className="action-btn-icon">
                  <Settings size={16} />
                </div>
                <div className="action-btn-text">
                  <span className="action-title">Configure Preferences</span>
                  <span className="action-desc">Adjust dark mode, notifications & security</span>
                </div>
              </button>
            </div>
          </div>

          {/* Granular Suspense Boundary for Activity Stream */}
          <div className="glass-panel activity-card-widget">
            <div className="activity-card-header">
              <h3 className="section-heading">
                <span>Recent Audit Activity</span>
              </h3>
              <button
                type="button"
                onClick={handleSimulateActivityStream}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                title="Stream fresh activity log via Suspense"
              >
                <RefreshCw size={12} />
                <span>Stream Feed</span>
              </button>
            </div>

            {activityPromise ? (
              <ErrorBoundary onReset={() => setActivityPromise(null)}>
                <Suspense fallback={<ActivitySkeleton />}>
                  <ActivityStreamWithUse activityPromise={activityPromise} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <div className="activity-stream">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-bullet">
                      <div className={`activity-icon ${act.type}`} />
                    </div>
                    <div className="activity-details">
                      <p className="activity-desc">{act.action}</p>
                      <span className="activity-time">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
