import React, { useState, Suspense } from 'react';
import { ActivityItem } from '../../types/profile';
import { getActivities } from '../../services/profileApi';
import { ActivityStreamWithUse } from './ActivityStreamWithUse';
import { Spinner } from '../ui/Spinner';
import { History, RefreshCw, Sparkles } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Promise state for demonstrating React 19 `use(Promise)`
  const [activityPromise, setActivityPromise] = useState<Promise<ActivityItem[]> | null>(null);

  const handleFetchFreshPromise = () => {
    // Pass a fresh Promise to be read by `use(Promise)`
    setActivityPromise(getActivities());
  };

  return (
    <div className="glass-panel activity-card-widget">
      <div className="activity-card-header">
        <h3 className="section-heading">
          <History size={16} /> Recent Audit Activity
        </h3>
        <button
          type="button"
          onClick={handleFetchFreshPromise}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          title="Trigger a fresh async Promise read with React 19 use()"
        >
          <RefreshCw size={12} />
          <span>Stream with use()</span>
        </button>
      </div>

      {activityPromise ? (
        /* React 19 Suspense Boundary for use(Promise) */
        <Suspense
          fallback={
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <Spinner size="md" label="Resolving promise via React 19 use()..." />
            </div>
          }
        >
          <ActivityStreamWithUse activityPromise={activityPromise} />
        </Suspense>
      ) : (
        <div className="activity-stream">
          <div className="badge" style={{ marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
            <Sparkles size={12} /> Baseline Prop Data
          </div>
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
  );
};
