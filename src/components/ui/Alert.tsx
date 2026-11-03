import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle2 size={18} className="alert-icon success" />,
    error: <XCircle size={18} className="alert-icon error" />,
    warning: <AlertTriangle size={18} className="alert-icon warning" />,
    info: <Info size={18} className="alert-icon info" />,
  };

  return (
    <div className={`alert-banner ${type}`} role="alert">
      <div className="alert-content">
        {icons[type]}
        <span className="alert-text">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="alert-close-btn" aria-label="Dismiss alert">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
