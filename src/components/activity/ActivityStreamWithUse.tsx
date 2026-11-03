import React, { use } from 'react';
import { ActivityItem } from '../../types/profile';
import { History, UserCheck, Award, ShieldAlert, Sliders, Sparkles } from 'lucide-react';

interface ActivityStreamWithUseProps {
  activityPromise: Promise<ActivityItem[]>;
  filterType?: 'all' | 'profile' | 'skill' | 'security' | 'setting';
}

/**
 * React 19 `use(Promise)` Component:
 * 
 * - Takes a raw Promise passed from parent/server.
 * - Reads data directly during render: `const activities = use(activityPromise);`
 * - Suspends automatically while the Promise is pending!
 * - Can be invoked conditionally inside `if` statements!
 */
export const ActivityStreamWithUse: React.FC<ActivityStreamWithUseProps> = ({
  activityPromise,
  filterType = 'all',
}) => {
  // Direct Promise resolution with React 19 use()!
  // If activityPromise is still pending, React SUSPENDS here automatically.
  const activities = use(activityPromise);

  // Demonstrate conditional use() usage:
  const filteredActivities =
    filterType === 'all'
      ? activities
      : activities.filter((item) => item.type === filterType);

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'profile':
        return <UserCheck size={14} className="activity-icon profile" />;
      case 'skill':
        return <Award size={14} className="activity-icon skill" />;
      case 'security':
        return <ShieldAlert size={14} className="activity-icon security" />;
      case 'setting':
        return <Sliders size={14} className="activity-icon setting" />;
      default:
        return <History size={14} className="activity-icon default" />;
    }
  };

  return (
    <div className="activity-stream">
      <div className="badge" style={{ marginBottom: '0.75rem', alignSelf: 'flex-start' }}>
        <Sparkles size={12} /> Resolved via React 19: use(Promise)
      </div>

      {filteredActivities.length === 0 ? (
        <p className="empty-notice">No activities match the current filter.</p>
      ) : (
        filteredActivities.map((act) => (
          <div key={act.id} className="activity-item">
            <div className="activity-bullet">{getIcon(act.type)}</div>
            <div className="activity-details">
              <p className="activity-desc">{act.action}</p>
              <span className="activity-time">{act.timestamp}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
