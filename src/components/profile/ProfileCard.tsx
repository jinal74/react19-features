import React, { useState } from 'react';
import { UserProfile } from '../../types/profile';
import { MapPin, Mail, Sparkles, ArrowRight, Eye } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onNavigateToProfile: () => void;
}

/**
 * ProfileCard Component with React 19 Ref Cleanup Function:
 * 
 * Demonstrates:
 * 1. Attaching dynamic mousemove DOM listener directly inside ref callback.
 * 2. Returning cleanup callback `() => node.removeEventListener(...)` to prevent memory leaks on unmount.
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onNavigateToProfile }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="glass-panel profile-card-widget"
      style={{
        position: 'relative',
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15) 0%, rgba(13, 18, 29, 0.72) 60%)`,
      }}
      /* React 19 Ref Callback with Returned Cleanup Function */
      ref={(node: HTMLDivElement | null) => {
        if (!node) return;

        // 1. Setup DOM Event Listener
        const handleMouseMove = (e: MouseEvent) => {
          const rect = node.getBoundingClientRect();
          setMousePos({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          });
        };

        node.addEventListener('mousemove', handleMouseMove);

        // 2. React 19 Ref Cleanup Function (runs on unmount!)
        return () => {
          node.removeEventListener('mousemove', handleMouseMove);
        };
      }}
    >
      <div className="profile-card-header">
        <div className="profile-avatar-wrapper">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="profile-avatar-img"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="avatar-status-badge" title="Active Account" />
        </div>
        <div className="profile-card-intro">
          <div className="name-badge-row">
            <h2 className="profile-name-text">{profile.name}</h2>
            <span className="role-chip">Verified Developer</span>
          </div>
          <p className="profile-title-text">{profile.title}</p>
          <div className="profile-meta-row">
            <span className="meta-item">
              <Mail size={14} /> {profile.email}
            </span>
            <span className="meta-item">
              <MapPin size={14} /> {profile.location}
            </span>
          </div>
        </div>
      </div>

      <p className="profile-bio-snippet">{profile.bio}</p>

      <div className="profile-skills-preview">
        <div className="skills-preview-header">
          <span className="section-mini-title">
            <Sparkles size={14} /> Core Technologies ({profile.skills.length})
          </span>
        </div>
        <div className="skills-chip-list">
          {profile.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
          {profile.skills.length > 5 && (
            <span className="skill-chip more">+{profile.skills.length - 5} more</span>
          )}
        </div>
      </div>

      <div className="profile-card-footer" style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onNavigateToProfile}
          className="btn btn-secondary btn-full"
          type="button"
        >
          <Eye size={16} />
          <span>View Full Profile &amp; Edit</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
