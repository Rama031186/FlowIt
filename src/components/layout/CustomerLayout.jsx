import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';
import {
  FiHome, FiShoppingBag, FiFileText, FiClipboard,
  FiUsers, FiHeart, FiBell, FiUser, FiLogOut, FiMenu, FiX,
  FiAlertCircle, FiChevronDown
} from 'react-icons/fi';

const customerNav = [
  { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { label: 'Products', icon: FiShoppingBag, path: '/products' },
  { label: 'My Policies', icon: FiFileText, path: '/policies' },
  { label: 'Apply', icon: FiClipboard, path: '/apply' },
  { label: 'Family Pool', icon: FiUsers, path: '/family-pool' },
  { label: 'Wellness', icon: FiHeart, path: '/wellness' },
];

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '??';

  const unreadNotifications = 3;

  return (
    <div className="customer-portal">
      {/* ─── Customer Top Navigation ─── */}
      <nav className="customer-navbar">
        <div className="customer-navbar-inner">
          {/* Brand */}
          <div className="customer-brand" onClick={() => navigate('/dashboard')}>
            <div className="customer-brand-icon">IF</div>
            <span className="customer-brand-text">InsureFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="customer-nav-links">
            {customerNav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `customer-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="customer-nav-right">
            <button
              className="customer-notif-btn"
              onClick={() => navigate('/notifications')}
            >
              <FiBell size={18} />
              {unreadNotifications > 0 && (
                <span className="customer-notif-badge">{unreadNotifications}</span>
              )}
            </button>

            {/* User Menu */}
            <div className="profile-dropdown" ref={menuRef}>
              <button
                className="customer-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div
                  className="customer-user-avatar"
                  style={{ background: ROLE_COLORS[user?.role] || '#192b37' }}
                >
                  {initials}
                </div>
                <span className="customer-user-name d-none d-lg-inline">{user?.name?.split(' ')[0]}</span>
                <FiChevronDown size={14} className="d-none d-lg-inline" style={{ opacity: 0.5 }} />
              </button>

              {showUserMenu && (
                <div className="profile-menu" style={{ minWidth: 220 }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(25,43,55,0.06)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>{user?.email}</div>
                  </div>
                  <div style={{ padding: '4px 0' }}>
                    <button
                      className="profile-menu-item"
                      onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                    >
                      <FiUser size={16} /> My Profile
                    </button>
                    <button
                      className="profile-menu-item"
                      onClick={() => { navigate('/risk-explanation'); setShowUserMenu(false); }}
                    >
                      <FiAlertCircle size={16} /> Risk Explanation
                    </button>
                    <button
                      className="profile-menu-item"
                      onClick={() => { navigate('/notifications'); setShowUserMenu(false); }}
                    >
                      <FiBell size={16} /> Notifications
                      {unreadNotifications > 0 && (
                        <span style={{
                          marginLeft: 'auto', background: '#ff5640', color: 'white',
                          fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8
                        }}>{unreadNotifications}</span>
                      )}
                    </button>
                  </div>
                  <div className="profile-menu-divider" />
                  <button className="profile-menu-item danger" onClick={handleLogout}>
                    <FiLogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="customer-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="customer-mobile-menu">
            {customerNav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `customer-mobile-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <div style={{ height: 1, background: 'rgba(25,43,55,0.06)', margin: '8px 0' }} />
            <NavLink to="/profile" className="customer-mobile-item">
              <FiUser size={18} /> <span>My Profile</span>
            </NavLink>
            <NavLink to="/notifications" className="customer-mobile-item">
              <FiBell size={18} /> <span>Notifications</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* ─── Main Content ─── */}
      <main className="customer-main">
        <div className="customer-content">
          <Outlet />
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="customer-footer">
        <div className="customer-footer-inner">
          <span>© 2026 InsureFlow. All rights reserved.</span>
          <div className="customer-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
