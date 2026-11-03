import React from 'react';
import { useFormStatus } from 'react-dom';
import { Save, LucideIcon } from 'lucide-react';

interface SubmitButtonProps {
  idleText?: string;
  pendingText?: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * React 19 Reusable SubmitButton:
 * Powered by `useFormStatus` from 'react-dom'.
 * 
 * CRITICAL RULE:
 * This component MUST be rendered as a child inside a `<form>` element.
 * It automatically reads `pending`, `data`, and `action` from the parent form
 * without ANY prop drilling!
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  idleText = 'Save Changes',
  pendingText = 'Saving...',
  icon: Icon = Save,
  variant = 'primary',
  className = '',
}) => {
  // Reads status directly from the parent <form> Context
  const { pending, data } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`btn btn-${variant} ${className}`}
      title={pending && data ? `Submitting: ${String(data.get('name') ?? '')}` : undefined}
    >
      {pending ? (
        <>
          <span className="button-spinner" aria-hidden="true" />
          <span aria-live="polite">{pendingText}</span>
        </>
      ) : (
        <>
          <Icon size={16} aria-hidden="true" />
          <span>{idleText}</span>
        </>
      )}
    </button>
  );
};
