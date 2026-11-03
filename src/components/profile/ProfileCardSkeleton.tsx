import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const ProfileCardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel profile-card-widget">
      <div className="profile-card-header">
        {/* Avatar skeleton */}
        <Skeleton width={76} height={76} borderRadius="16px" />
        
        <div className="profile-card-intro" style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Skeleton width="55%" height={24} borderRadius="6px" />
            <Skeleton width="30%" height={20} borderRadius="9999px" />
          </div>
          <Skeleton width="40%" height={16} borderRadius="4px" style={{ marginTop: '0.5rem' }} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <Skeleton width="45%" height={14} borderRadius="4px" />
            <Skeleton width="35%" height={14} borderRadius="4px" />
          </div>
        </div>
      </div>

      {/* Bio skeleton */}
      <Skeleton width="100%" height={56} borderRadius="8px" style={{ marginBottom: '1.25rem' }} />

      {/* Skills skeleton */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Skeleton width={80} height={26} borderRadius="6px" />
        <Skeleton width={95} height={26} borderRadius="6px" />
        <Skeleton width={75} height={26} borderRadius="6px" />
        <Skeleton width={110} height={26} borderRadius="6px" />
      </div>

      {/* Button skeleton */}
      <Skeleton width="100%" height={40} borderRadius="8px" />
    </div>
  );
};
