import React, { useState } from 'react';
import { UserProfile } from '../../types/profile';
import { Save, X, User, Mail, Briefcase, MapPin, AlignLeft, Globe } from 'lucide-react';
import { Alert } from '../ui/Alert';

interface EditProfileFormProps {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
  onCancel: () => void;
}

/**
 * Traditional Baseline React Form:
 * - Uses multiple `useState` hooks for form fields.
 * - Uses manual `isLoading`, `error`, and `success` state flags.
 * - Handles submit with `e.preventDefault()`.
 * - Manages try/catch/finally blocks manually.
 */
export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  profile,
  onSave,
  onCancel,
}) => {
  // 1. Local Field States
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl);

  // 2. Network & UI Lifecycle States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 3. Form Submit Handler (Classic React Pattern)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop native browser full page reload

    // Reset feedback
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validation
    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true); // Set loading flag
      await onSave({
        name: name.trim(),
        email: email.trim(),
        title: title.trim(),
        bio: bio.trim(),
        location: location.trim(),
        githubUrl: githubUrl.trim(),
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        onCancel(); // Return to view mode after brief success notice
      }, 900);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred while saving.');
      }
    } finally {
      setIsLoading(false); // Reset loading flag
    }
  };

  return (
    <div className="glass-panel form-card">
      <div className="form-header">
        <div>
          <h2 className="section-heading">Edit Profile (Baseline Approach)</h2>
          <p className="section-subheading">
            Classic pattern using <code>useState</code>, <code>onSubmit</code>, and manual async lifecycle handling.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="btn-icon"
          disabled={isLoading}
          aria-label="Cancel editing"
        >
          <X size={18} />
        </button>
      </div>

      {errorMessage && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Alert type="error" message={errorMessage} onClose={() => setErrorMessage(null)} />
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Alert type="success" message={successMessage} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form-grid">
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            <User size={14} /> Full Name
          </label>
          <input
            id="name"
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Hemant Patel"
            required
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <Mail size={14} /> Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. hemant@example.com"
            required
          />
        </div>

        {/* Professional Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            <Briefcase size={14} /> Professional Title
          </label>
          <input
            id="title"
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Senior Frontend Architect"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="location">
            <MapPin size={14} /> Location
          </label>
          <input
            id="location"
            type="text"
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        {/* GitHub URL */}
        <div className="form-group form-span-2">
          <label className="form-label" htmlFor="githubUrl">
            <Globe size={14} /> GitHub Profile URL
          </label>
          <input
            id="githubUrl"
            type="url"
            className="input-field"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            disabled={isLoading}
            placeholder="https://github.com/username"
          />
        </div>

        {/* Bio */}
        <div className="form-group form-span-2">
          <label className="form-label" htmlFor="bio">
            <AlignLeft size={14} /> Short Biography
          </label>
          <textarea
            id="bio"
            rows={4}
            className="input-field textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isLoading}
            placeholder="Write a brief intro about your experience..."
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions form-span-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="button-spinner" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
