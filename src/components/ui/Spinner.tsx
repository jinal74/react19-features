import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  return (
    <div className={`spinner-container ${size}`}>
      <div className="spinner-ring" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
};
