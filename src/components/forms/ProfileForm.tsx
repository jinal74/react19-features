import React, { useActionState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types/profile';
import {
  updateProfileFormAction,
  ProfileFormActionState,
} from '../../actions/profileActions';
import { SubmitButton } from './SubmitButton';
import { TextInput } from '../ui/TextInput';
import { TextArea } from '../ui/TextArea';
import {
  X,
  User,
  Mail,
  Briefcase,
  MapPin,
  AlignLeft,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
  onCancel: () => void;
}

const initialFormState: ProfileFormActionState = {
  success: false,
  message: null,
};

/**
 * React 19 ProfileForm:
 * 
 * Demonstrates:
 * 1. `ref` passed directly as a prop to custom <TextInput /> and <TextArea /> (no forwardRef!).
 * 2. Auto-focus on mount: `nameInputRef.current?.focus()`.
 * 3. Native Form Actions (<form action={formAction}>).
 * 4. Subtree pending status with <SubmitButton />.
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileUpdated,
  onCancel,
}) => {
  // Direct Ref for the first input
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formState, formAction, isPending] = useActionState(
    updateProfileFormAction,
    initialFormState
  );

  const hasNotifiedRef = useRef(false);

  // Auto-focus Name input when Edit mode opens
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Notify parent once on successful mutation
  useEffect(() => {
    if (formState.success && formState.data && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onProfileUpdated(formState.data);
    }
  }, [formState.success, formState.data, onProfileUpdated]);

  const fieldErrors = formState.fieldErrors;

  return (
    <div className="glass-panel form-card">
      <div className="form-header">
        <div>
          <div className="badge" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={12} /> React 19 Primitive: ref as a Prop
          </div>
          <h2 className="section-heading">Edit Profile (Direct Ref Passing)</h2>
          <p className="section-subheading">
            Zero <code>React.forwardRef</code> overhead. Direct <code>ref</code> prop passed to custom components.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="btn-icon"
          disabled={isPending}
          aria-label="Close edit form"
        >
          <X size={18} />
        </button>
      </div>

      {/* Global Error Banner */}
      {!formState.success && formState.message && (
        <div className="alert-banner error" role="alert" aria-live="polite" style={{ marginBottom: '1.25rem' }}>
          <div className="alert-content">
            <AlertCircle size={18} className="alert-icon error" aria-hidden="true" />
            <span className="alert-text">{formState.message}</span>
          </div>
        </div>
      )}

      {/* Global Success Banner */}
      {formState.success && formState.message && (
        <div className="alert-banner success" role="alert" aria-live="polite" style={{ marginBottom: '1.25rem' }}>
          <div className="alert-content">
            <CheckCircle2 size={18} className="alert-icon success" aria-hidden="true" />
            <span className="alert-text">{formState.message}</span>
          </div>
        </div>
      )}

      {/* Native React 19 Form Action */}
      <form action={formAction} className="profile-form-grid" aria-label="Edit Profile Details">
        {/* Full Name: receives ref as standard prop & auto-focuses */}
        <TextInput
          ref={nameInputRef}
          id="name"
          name="name"
          label="Full Name"
          icon={User}
          requiredIndicator
          defaultValue={formState.values?.name ?? profile.name}
          error={fieldErrors?.name}
          disabled={isPending}
          placeholder="Hemant Patel"
        />

        {/* Email */}
        <TextInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          icon={Mail}
          requiredIndicator
          defaultValue={formState.values?.email ?? profile.email}
          error={fieldErrors?.email}
          disabled={isPending}
          placeholder="hemant@example.com"
        />

        {/* Title */}
        <TextInput
          id="title"
          name="title"
          label="Professional Title"
          icon={Briefcase}
          defaultValue={formState.values?.title ?? profile.title}
          error={fieldErrors?.title}
          disabled={isPending}
          placeholder="Senior Frontend Architect"
        />

        {/* Location */}
        <TextInput
          id="location"
          name="location"
          label="Location"
          icon={MapPin}
          defaultValue={formState.values?.location ?? profile.location}
          error={fieldErrors?.location}
          disabled={isPending}
          placeholder="San Francisco, CA"
        />

        {/* GitHub URL */}
        <div className="form-span-2">
          <TextInput
            id="githubUrl"
            name="githubUrl"
            type="url"
            label="GitHub Profile URL"
            icon={Globe}
            defaultValue={formState.values?.githubUrl ?? profile.githubUrl}
            error={fieldErrors?.githubUrl}
            disabled={isPending}
            placeholder="https://github.com/hemant-patel"
          />
        </div>

        {/* Bio */}
        <TextArea
          id="bio"
          name="bio"
          rows={3}
          label="Biography (Minimum 10 characters)"
          icon={AlignLeft}
          defaultValue={formState.values?.bio ?? profile.bio}
          error={fieldErrors?.bio}
          disabled={isPending}
          placeholder="Passionate software engineer building robust React applications..."
        />

        {/* Form Actions */}
        <div className="form-actions form-span-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isPending}
          >
            Cancel
          </button>
          <SubmitButton
            idleText="Save Changes"
            pendingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};
