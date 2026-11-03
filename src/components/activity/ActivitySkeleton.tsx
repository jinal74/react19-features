import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const ActivitySkeleton: React.FC = () => {
  return (
    <div className="activity-stream">
      {[1, 2, 3].map((item) => (
        <div key={item} className="activity-item" style={{ alignItems: 'center' }}>
          <Skeleton width={26} height={26} borderRadius="50%" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <Skeleton width="85%" height={14} borderRadius="4px" />
            <Skeleton width="40%" height={11} borderRadius="4px" />
          </div>
        </div>
      ))}
    </div>
  );
};
