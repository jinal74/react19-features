import { UserProfile, ActivityItem, UserPreferences } from '../types/profile';

// Initial In-Memory State
let mockProfile: UserProfile = {
  id: 'usr_react19_01',
  name: 'Hemant Patel',
  email: 'hemant.patel@example.com',
  title: 'Senior Frontend Architect',
  bio: 'Passionate software engineer building robust, scalable web applications with React 19, TypeScript, and modern front-end architectures.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  skills: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Node.js', 'Tailwind CSS'],
  location: 'San Francisco, CA',
  githubUrl: 'https://github.com/hemant-patel',
  updatedAt: new Date().toISOString(),
};

const mockActivities: ActivityItem[] = [
  {
    id: 'act_1',
    action: 'Profile created in React 19 Workspace',
    timestamp: '10 minutes ago',
    type: 'profile',
  },
  {
    id: 'act_2',
    action: 'Added skill "React 19 Actions"',
    timestamp: '25 minutes ago',
    type: 'skill',
  },
  {
    id: 'act_3',
    action: 'Updated email notification preferences',
    timestamp: '2 hours ago',
    type: 'setting',
  },
];

let mockPreferences: UserPreferences = {
  theme: 'dark',
  emailNotifications: true,
  publicProfile: true,
  twoFactorAuth: true,
};

// Helper for realistic async network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch the user profile asynchronously
 */
export async function getProfile(): Promise<UserProfile> {
  await delay(600);
  return { ...mockProfile };
}

/**
 * Update user profile details
 */
export async function updateProfile(
  updates: Partial<Pick<UserProfile, 'name' | 'email' | 'bio' | 'title' | 'location' | 'githubUrl'>>
): Promise<UserProfile> {
  await delay(800);

  // Validate required fields
  if (updates.name !== undefined && !updates.name.trim()) {
    throw new Error('Name cannot be empty.');
  }
  if (updates.email !== undefined && (!updates.email.includes('@') || !updates.email.includes('.'))) {
    throw new Error('Please provide a valid email address.');
  }

  mockProfile = {
    ...mockProfile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockActivities.unshift({
    id: `act_${Date.now()}`,
    action: `Updated profile details (${Object.keys(updates).join(', ')})`,
    timestamp: 'Just now',
    type: 'profile',
  });

  return { ...mockProfile };
}

/**
 * Add a skill to the profile
 */
export async function addSkill(skillName: string): Promise<UserProfile> {
  await delay(700);

  const trimmed = skillName.trim();
  if (!trimmed) {
    throw new Error('Skill name cannot be empty.');
  }
  if (mockProfile.skills.includes(trimmed)) {
    throw new Error(`Skill "${trimmed}" already exists.`);
  }

  mockProfile = {
    ...mockProfile,
    skills: [...mockProfile.skills, trimmed],
    updatedAt: new Date().toISOString(),
  };

  mockActivities.unshift({
    id: `act_${Date.now()}`,
    action: `Added skill "${trimmed}"`,
    timestamp: 'Just now',
    type: 'skill',
  });

  return { ...mockProfile };
}

/**
 * Remove a skill from the profile
 */
export async function removeSkill(skillName: string): Promise<UserProfile> {
  await delay(600);

  mockProfile = {
    ...mockProfile,
    skills: mockProfile.skills.filter((s) => s !== skillName),
    updatedAt: new Date().toISOString(),
  };

  mockActivities.unshift({
    id: `act_${Date.now()}`,
    action: `Removed skill "${skillName}"`,
    timestamp: 'Just now',
    type: 'skill',
  });

  return { ...mockProfile };
}

/**
 * Fetch recent activity list
 */
export async function getActivities(): Promise<ActivityItem[]> {
  await delay(500);
  return [...mockActivities];
}

/**
 * Fetch preferences
 */
export async function getPreferences(): Promise<UserPreferences> {
  await delay(400);
  return { ...mockPreferences };
}

/**
 * Update preferences
 */
export async function updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
  await delay(600);
  mockPreferences = { ...mockPreferences, ...updates };

  mockActivities.unshift({
    id: `act_${Date.now()}`,
    action: 'Updated user preferences',
    timestamp: 'Just now',
    type: 'setting',
  });

  return { ...mockPreferences };
}
