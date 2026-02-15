import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';

export default function Topbar({ collapsed, onToggle, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '??';

  return (
    <header className={`topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="topbar-toggle" onClick={onToggle}>
          <FiMenu />
        </button>
        {title && <span className="topbar-title">{title}</span>}
      </div>

      <div className="topbar-right">
        <button
          className="topbar-icon-btn"
          onClick={() => navigate('/admin-portal/notifications')}
        >
          <FiBell />
          <span className="notif-dot"></span>
        </button>

        <div className="profile-dropdown" ref={menuRef}>
          <div
            className="topbar-user"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div
              className="topbar-avatar"
              style={{ background: ROLE_COLORS[user?.role] || '#192b37' }}
            >
              {initials}
            </div>
            <div className="topbar-user-info d-none d-md-block">
              <div className="topbar-user-name">{user?.name}</div>
              <div className="topbar-user-role">
                {ROLE_LABELS[user?.role] || user?.role}
              </div>
            </div>
          </div>

          {showMenu && (
            <div className="profile-menu">
              <button
                className="profile-menu-item"
                onClick={() => { navigate('/admin-portal/profile'); setShowMenu(false); }}
              >
                <FiUser size={16} /> My Profile
              </button>
              <button
                className="profile-menu-item"
                onClick={() => { navigate('/admin-portal/notifications'); setShowMenu(false); }}
              >
                <FiBell size={16} /> Notifications
              </button>
              <div className="profile-menu-divider" />
              <button
                className="profile-menu-item danger"
                onClick={handleLogout}
              >
                <FiLogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
