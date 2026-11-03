import { UserProfile } from '../types/profile';
import { updateProfile, addSkill, removeSkill } from '../services/profileApi';

/**
 * Result structure returned by React 19 Action functions.
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Detailed Field-level Validation Errors
 */
export interface ProfileFormFieldErrors {
  name?: string;
  email?: string;
  bio?: string;
  title?: string;
  location?: string;
  githubUrl?: string;
}

/**
 * Structured state returned by Form Actions
 */
export interface ProfileFormActionState {
  success: boolean;
  message: string | null;
  fieldErrors?: ProfileFormFieldErrors;
  values?: {
    name: string;
    email: string;
    bio: string;
    title: string;
    location: string;
    githubUrl: string;
  };
  data?: UserProfile;
}

/**
 * React 19 Native Form Action:
 * Receives native `FormData` automatically from `<form action={...}>`.
 * Validates fields and returns structured field errors if validation fails.
 */
export async function updateProfileFormAction(
  _prevState: ProfileFormActionState,
  formData: FormData
): Promise<ProfileFormActionState> {
  // 1. Extract values directly from native FormData
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const githubUrl = String(formData.get('githubUrl') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();

  const values = { name, email, title, location, githubUrl, bio };
  const fieldErrors: ProfileFormFieldErrors = {};

  // 2. Perform Field-Specific Validations
  if (!name) {
    fieldErrors.name = 'Full name is required.';
  } else if (name.length < 2) {
    fieldErrors.name = 'Full name must be at least 2 characters.';
  }

  if (!email) {
    fieldErrors.email = 'Email address is required.';
  } else if (!email.includes('@') || !email.includes('.')) {
    fieldErrors.email = 'Please provide a valid email address (e.g. user@domain.com).';
  }

  if (bio && bio.length < 10) {
    fieldErrors.bio = 'Biography must be at least 10 characters long.';
  }

  if (githubUrl && !githubUrl.startsWith('http')) {
    fieldErrors.githubUrl = 'GitHub URL must start with http:// or https://';
  }

  // If validation errors exist, return immediately without network call
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: 'Please resolve the highlighted field errors below.',
      fieldErrors,
      values,
    };
  }

  // 3. Execute Async Service Update
  try {
    const updatedUser = await updateProfile({
      name,
      email,
      title,
      location,
      githubUrl,
      bio,
    });

    return {
      success: true,
      message: '✓ Profile updated successfully via <form action={...}>',
      data: updatedUser,
      values,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to update profile.',
      values,
    };
  }
}

/**
 * Standard Action: Update User Profile Details
 */
export async function updateProfileAction(
  updates: Partial<Pick<UserProfile, 'name' | 'email' | 'bio' | 'title' | 'location' | 'githubUrl'>>
): Promise<ActionResult<UserProfile>> {
  try {
    if (updates.name !== undefined && !updates.name.trim()) {
      return {
        success: false,
        error: 'Name cannot be blank (validated in Action).',
      };
    }

    if (updates.email !== undefined && (!updates.email.includes('@') || !updates.email.includes('.'))) {
      return {
        success: false,
        error: 'A valid email address is required (validated in Action).',
      };
    }

    const updatedUser = await updateProfile(updates);
    return { success: true, data: updatedUser };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update profile action.',
    };
  }
}

/**
 * React 19 Action: Add Skill
 */
export async function addSkillAction(skillName: string): Promise<ActionResult<UserProfile>> {
  try {
    if (!skillName.trim()) {
      return { success: false, error: 'Skill name cannot be empty.' };
    }

    const updatedUser = await addSkill(skillName.trim());
    return { success: true, data: updatedUser };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to add skill.',
    };
  }
}

/**
 * React 19 Action: Remove Skill
 */
export async function removeSkillAction(skillName: string): Promise<ActionResult<UserProfile>> {
  try {
    const updatedUser = await removeSkill(skillName);
    return { success: true, data: updatedUser };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to remove skill.',
    };
  }
}
