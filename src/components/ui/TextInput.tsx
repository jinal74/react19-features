import React from 'react';
import { LucideIcon, AlertOctagon } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
  requiredIndicator?: boolean;
  // In React 19, `ref` is a standard prop on functional components!
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * React 19 Custom TextInput Component:
 * 
 * Notice: ZERO `React.forwardRef()` wrapper!
 * In React 19, `ref` is simply passed and destructured like any regular prop.
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  requiredIndicator = false,
  ref,
  id,
  className = '',
  ...props
}) => {
  const errorId = id ? `${id}-error` : undefined;
  const helperId = id ? `${id}-helper` : undefined;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {Icon && <Icon size={14} aria-hidden="true" />}
        <span>{label}</span>
        {requiredIndicator && (
          <span aria-hidden="true" style={{ color: 'var(--danger)', marginLeft: '2px' }}>
            *
          </span>
        )}
      </label>

      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-required={requiredIndicator}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
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
