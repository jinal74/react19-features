import React, { use } from 'react';
import { UserProfile } from '../../types/profile';
import { ProfileCard } from './ProfileCard';

interface SuspenseProfileCardProps {
  profilePromise: Promise<UserProfile>;
  onNavigateToProfile: () => void;
}

/**
 * React 19 Resource-consuming component:
 * Calls `use(profilePromise)` directly during render.
 * Suspends while the promise is pending!
 */
export const SuspenseProfileCard: React.FC<SuspenseProfileCardProps> = ({
  profilePromise,
  onNavigateToProfile,
}) => {
  const profile = use(profilePromise);

  return (
    <ProfileCard
      profile={profile}
      onNavigateToProfile={onNavigateToProfile}
    />
  );
};
