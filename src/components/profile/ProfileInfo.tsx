import React, { useOptimistic, useState, useTransition, useRef } from 'react';
import { UserProfile } from '../../types/profile';
import { MapPin, Mail, Code2, Plus, Trash2, Calendar, Edit3, Sparkles } from 'lucide-react';
import { Alert } from '../ui/Alert';

interface ProfileInfoProps {
  profile: UserProfile;
  onEditClick: () => void;
  onAddSkill: (skill: string) => Promise<void>;
  onRemoveSkill: (skill: string) => Promise<void>;
}

interface OptimisticSkillItem {
  name: string;
  isOptimistic?: boolean;
}

type SkillOptimisticAction =
  | { type: 'add'; skill: string }
  | { type: 'remove'; skill: string };

/**
 * ProfileInfo Component powered by React 19 `useOptimistic`:
 * 
 * - When user adds a skill, it appears INSTANTLY (0ms latency).
 * - When user deletes a skill, it vanishes INSTANTLY.
 * - If the network request fails, React 19 automatically rolls back to the previous state!
 */
export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  onEditClick,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [skillError, setSkillError] = useState<string | null>(null);
  const [isPending, startSkillTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // STEP 1: Baseline Server Skills
  const baseSkills: OptimisticSkillItem[] = profile.skills.map((name) => ({
    name,
    isOptimistic: false,
  }));

  // STEP 2: Pure Optimistic Reducer Logic
  const skillsOptimisticReducer = (
    currentList: OptimisticSkillItem[],
    action: SkillOptimisticAction
  ): OptimisticSkillItem[] => {
    switch (action.type) {
      case 'add':
        return [...currentList, { name: action.skill, isOptimistic: true }];
      case 'remove':
        return currentList.filter((item) => item.name !== action.skill);
      default:
        return currentList;
    }
  };

  // STEP 3: Clean, Readable useOptimistic Hook
  const [optimisticSkills, setOptimisticSkills] = useOptimistic(
    baseSkills,
    skillsOptimisticReducer
  );

  /**
   * Optimistic Skill Add Action
   */
  const handleAddSkillAction = (formData: FormData) => {
    const skillName = String(formData.get('skillName') ?? '').trim();
    if (!skillName) return;

    // Reset error & clear input field
    setSkillError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    // Execute inside React 19 Transition with Optimistic UI
    startSkillTransition(async () => {
      // 1. INSTANT OPTIMISTIC UPDATE (0ms)
      setOptimisticSkills({ type: 'add', skill: skillName });

      try {
        // 2. Perform actual background server request (700ms)
        await onAddSkill(skillName);
      } catch (err: unknown) {
        // 3. If failed: React automatically rolls back optimisticSkills to profile.skills!
        setSkillError(
          err instanceof Error ? err.message : `Failed to add "${skillName}". Rolled back.`
        );
      }
    });
  };

  /**
   * Optimistic Skill Remove Action
   */
  const handleRemoveSkill = (skill: string) => {
    setSkillError(null);

    startSkillTransition(async () => {
      // 1. INSTANT OPTIMISTIC REMOVAL (0ms)
      setOptimisticSkills({ type: 'remove', skill });

      try {
        // 2. Background server deletion
        await onRemoveSkill(skill);
      } catch (err: unknown) {
        // 3. Rollback
        setSkillError(
          err instanceof Error ? err.message : `Failed to remove "${skill}". Rolled back.`
        );
      }
    });
  };

  return (
    <div className="profile-info-layout">
      {/* Top Profile Header */}
      <div className="glass-panel profile-header-panel">
        <div className="profile-header-main">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="profile-large-avatar"
          />
          <div className="profile-header-text">
            <div className="name-action-row">
              <div>
                <h1 className="profile-main-name">{profile.name}</h1>
                <p className="profile-main-title">{profile.title}</p>
              </div>
              <button onClick={onEditClick} className="btn btn-primary" type="button">
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item">
                <Mail size={16} className="detail-icon" />
                <span>{profile.email}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} className="detail-icon" />
                <span>{profile.location}</span>
              </div>
              <div className="detail-item">
                <Code2 size={16} className="detail-icon" />
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  github.com/profile
                </a>
              </div>
              <div className="detail-item">
                <Calendar size={16} className="detail-icon" />
                <span>Updated: {new Date(profile.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Biography Section */}
      <div className="glass-panel content-section">
        <h3 className="section-heading">About & Biography</h3>
        <p className="bio-paragraph">{profile.bio}</p>
      </div>

      {/* Optimistic Skills Manager Section */}
      <div className="glass-panel content-section">
        <div className="skills-section-header">
          <div>
            <div className="badge" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={12} /> React 19 Primitive: useOptimistic
            </div>
            <h3 className="section-heading">Skills & Competencies</h3>
            <p className="section-subheading">
              Skills update <strong>instantly (0ms latency)</strong> before server response. Automatic rollback on error.
            </p>
          </div>
        </div>

        {skillError && (
          <div style={{ marginBottom: '1rem' }}>
            <Alert type="error" message={skillError} onClose={() => setSkillError(null)} />
          </div>
        )}

        {/* Optimistic Skill Badges */}
        <div className="skills-interactive-list" aria-live="polite" aria-atomic="false">
          {optimisticSkills.map((item) => (
            <div
              key={item.name}
              className={`skill-interactive-badge ${item.isOptimistic ? 'optimistic' : ''}`}
            >
              <span>{item.name}</span>
              {item.isOptimistic ? (
                <span className="optimistic-indicator" aria-label="Syncing with server">Syncing...</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(item.name)}
                  className="skill-remove-btn"
                  aria-label={`Remove skill ${item.name}`}
                  title={`Remove ${item.name}`}
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Skill Form using native Form Action */}
        <form action={handleAddSkillAction} className="add-skill-form">
          <input
            ref={inputRef}
            name="skillName"
            type="text"
            className="input-field"
            aria-label="Add new technical skill"
            placeholder="Type a new skill (e.g. Python, Docker, Next.js, GraphQL)..."
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={isPending}
            aria-busy={isPending}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Add Skill (Optimistic)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
