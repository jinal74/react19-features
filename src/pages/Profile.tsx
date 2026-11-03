import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UserProfile } from '../types/profile';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { ProfileForm } from '../components/forms/ProfileForm';
import { useViewTransition } from '../hooks/useViewTransition';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile> | UserProfile) => Promise<void>;
  onAddSkill: (skill: string) => Promise<void>;
  onRemoveSkill: (skill: string) => Promise<void>;
}

export const Profile: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { navigateWithTransition } = useViewTransition();
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const handleToggleEdit = useCallback((editing: boolean) => {
    navigateWithTransition(() => {
      setIsEditing(editing);
    });
  }, [navigateWithTransition]);

  const handleProfileUpdated = useCallback(async (updatedUser: UserProfile) => {
    await onUpdateProfile(updatedUser);
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      handleToggleEdit(false);
    }, 1200);
  }, [onUpdateProfile, handleToggleEdit]);

  return (
    <div className="page-container profile-page">
      {/* React 19 Native Dynamic Document Metadata */}
      <title>{`${profile.name} (@${profile.title}) — Profile`}</title>
      <meta name="description" content={profile.bio} />
      <meta property="og:title" content={`${profile.name} — Profile`} />
      <meta property="og:description" content={profile.bio} />
      <link rel="canonical" href={`https://smartprofile.dev/profile/${profile.id}`} />

      {isEditing ? (
        <ProfileForm
          profile={profile}
          onProfileUpdated={handleProfileUpdated}
          onCancel={() => handleToggleEdit(false)}
        />
      ) : (
        <ProfileInfo
          profile={profile}
          onEditClick={() => handleToggleEdit(true)}
          onAddSkill={onAddSkill}
          onRemoveSkill={onRemoveSkill}
        />
      )}
    </div>
  );
};
