import React from 'react';
import { LucideIcon, AlertOctagon } from 'lucide-react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

/**
 * React 19 Custom TextArea Component:
 * Accepts `ref` as a first-class prop without `forwardRef`.
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  ref,
  id,
  className = '',
  ...props
}) => {
  const errorId = id ? `${id}-error` : undefined;
  const helperId = id ? `${id}-helper` : undefined;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className="form-group form-span-2">
      <label className="form-label" htmlFor={id}>
        {Icon && <Icon size={14} aria-hidden="true" />}
        <span>{label}</span>
      </label>

      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`input-field textarea ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />

      {error ? (
        <span id={errorId} className="field-error-text" role="alert" aria-live="polite">
          <AlertOctagon size={13} aria-hidden="true" /> {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="form-helper-text">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
