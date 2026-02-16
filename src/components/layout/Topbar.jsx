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
    <header className={`topbar d-flex align-items-center justify-content-between px-4 ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-link text-dark p-1"
          style={{ borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={onToggle}
        >
          <FiMenu />
        </button>
        {title && <span className="fw-semibold d-none d-md-block" style={{ fontSize: 18 }}>{title}</span>}
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-link text-dark position-relative p-2"
          style={{ borderRadius: 10 }}
          onClick={() => navigate('/admin-portal/notifications')}
        >
          <FiBell />
          <span className="position-absolute top-0 end-0 rounded-circle bg-danger" style={{ width: 8, height: 8 }}></span>
        </button>

        <div className="position-relative" ref={menuRef}>
          <div
            className="d-flex align-items-center gap-2 p-1 rounded-3"
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3 text-white fw-bold"
              style={{
                width: 34, height: 34, fontSize: 12,
                background: ROLE_COLORS[user?.role] || '#192b37',
              }}
            >
              {initials}
            </div>
            <div className="d-none d-md-block lh-sm">
              <div className="fw-semibold" style={{ fontSize: 13 }}>{user?.name}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>
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
