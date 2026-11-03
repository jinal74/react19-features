import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../types/profile';
import {
  updateProfileAction,
  updateProfileFormAction,
  addSkillAction,
} from '../actions/profileActions';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { ProfileForm } from '../components/forms/ProfileForm';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const mockProfile: UserProfile = {
  id: 'usr_test_01',
  name: 'Hemant Patel',
  email: 'hemant.patel@example.com',
  title: 'Senior Frontend Architect',
  bio: 'Passionate software engineer building robust, scalable web applications with React 19 and TypeScript.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  skills: ['React 19', 'TypeScript', 'Next.js'],
  location: 'San Francisco, CA',
  githubUrl: 'https://github.com/hemant-patel',
  updatedAt: new Date().toISOString(),
};

describe('Phase 17 — React 19 Unit & Integration Test Suite', () => {
  // Test 1: Profile Loads & Renders Baseline Info
  it('1. Profile loads and renders baseline profile data and skills', () => {
    render(
      <ProfileInfo
        profile={mockProfile}
        onEditClick={vi.fn()}
        onAddSkill={vi.fn()}
        onRemoveSkill={vi.fn()}
      />
    );

    expect(screen.getByText('Hemant Patel')).toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Architect')).toBeInTheDocument();
    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  // Test 2: Profile Form Renders Inputs
  it('2. Profile form renders with inputs and default values', () => {
    render(
      <ProfileForm
        profile={mockProfile}
        onProfileUpdated={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe('Hemant Patel');
    expect(emailInput.value).toBe('hemant.patel@example.com');
  });

  // Test 3: Form Action Validation Rejects Invalid Email & Returns fieldErrors
  it('3. Form action validation rejects invalid email and empty name with fieldErrors', async () => {
    const formData = new FormData();
    formData.append('name', '');
    formData.append('email', 'not-an-email');

    const result = await updateProfileFormAction(
      { success: false, message: null },
      formData
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.name).toBe('Full name is required.');
    expect(result.fieldErrors?.email).toContain('valid email address');
  });

  // Test 4: Action Successful Update
  it('4. Action successfully updates valid profile attributes', async () => {
    const validUpdates = {
      name: 'Hemant Patel (Updated)',
      email: 'hemant.updated@example.com',
      title: 'Principal React Engineer',
    };

    const result = await updateProfileAction(validUpdates);

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Hemant Patel (Updated)');
    expect(result.data?.email).toBe('hemant.updated@example.com');
  });

  // Test 5: Action Duplicate Skill Handling
  it('5. Action rejects duplicate skills gracefully', async () => {
    const result = await addSkillAction('React 19');

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  // Test 6: Optimistic UI Updates Instantly (0ms Latency)
  it('6. useOptimistic displays added skill immediately before server responds', async () => {
    const user = userEvent.setup();
    const handleAddSkill = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 300)));

    render(
      <ProfileInfo
        profile={mockProfile}
        onEditClick={vi.fn()}
        onAddSkill={handleAddSkill}
        onRemoveSkill={vi.fn()}
      />
    );

    const skillInput = screen.getByPlaceholderText(/Type a new skill/i);
    const addBtn = screen.getByRole('button', { name: /Add Skill/i });

    await user.type(skillInput, 'GraphQL');
    await user.click(addBtn);

    // Optimistic item appears immediately in the DOM
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
  });

  // Test 7: Optimistic Rollback on Server Failure
  it('7. useOptimistic rolls back when async mutation rejects', async () => {
    const user = userEvent.setup();
    const failingAddSkill = vi.fn().mockRejectedValue(new Error('Network offline: Failed to add skill.'));

    render(
      <ProfileInfo
        profile={mockProfile}
        onEditClick={vi.fn()}
        onAddSkill={failingAddSkill}
        onRemoveSkill={vi.fn()}
      />
    );

    const skillInput = screen.getByPlaceholderText(/Type a new skill/i);
    const addBtn = screen.getByRole('button', { name: /Add Skill/i });

    await user.type(skillInput, 'Rust');
    await user.click(addBtn);

    // After async rejection, rollback alert appears
    const errorAlert = await screen.findByText(/Failed to add skill/i);
    expect(errorAlert).toBeInTheDocument();
  });

  // Test 8: Error Boundary Catches Asynchronous / Stream Errors
  it('8. ErrorBoundary catches thrown errors and renders retry fallback', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const FailingComponent = () => {
      throw new Error('Simulated Stream Promise Rejection');
    };

    render(
      <ErrorBoundary>
        <FailingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Stream Error Caught by ErrorBoundary/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Stream Promise Rejection/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Boundary & Retry/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
