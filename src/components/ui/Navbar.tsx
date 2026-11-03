import React from 'react';
import { ActiveTab } from '../../types/profile';
import { LayoutDashboard, User, Settings, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userEmail?: string;
  isViewTransitionActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  userEmail,
  isViewTransitionActive = false,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="navbar-logo">
          <Shield size={20} className="logo-icon" />
        </div>
        <div>
          <span className="brand-title">SmartProfile</span>
          <span className="brand-version">React 19 Lab</span>
          {isViewTransitionActive && (
            <span
              style={{
                marginLeft: '0.5rem',
                fontSize: '0.68rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontWeight: 600,
              }}
              title="Native View Transitions API Active"
            >
              ✦ View Transitions
            </span>
          )}
        </div>
      </div>

      <nav className="navbar-links" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && <span className="active-pill" aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      {userEmail && (
        <div className="navbar-user-chip">
          <div className="user-avatar-mini">{userEmail.charAt(0).toUpperCase()}</div>
          <span className="user-email-text">{userEmail}</span>
        </div>
      )}
    </header>
  );
};
