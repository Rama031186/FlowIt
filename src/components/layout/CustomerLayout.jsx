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
    <div className="d-flex flex-column min-vh-100">
      {/* ─── Customer Top Navigation ─── */}
      <nav className="navbar navbar-expand-lg sticky-top customer-navbar border-bottom">
        <div className="container">
          {/* Brand */}
          <div className="navbar-brand d-flex align-items-center gap-2 fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div className="d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #ff5640, #ff8066)', fontSize: 13 }}>
              IF
            </div>
            <span style={{ fontSize: 18, letterSpacing: -0.3 }}>InsureFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-nav d-none d-lg-flex gap-1">
            {customerNav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 position-relative ${isActive ? 'fw-semibold' : ''}`
                }
                style={({ isActive }) => ({
                  fontSize: 14,
                  color: isActive ? '#ff5640' : '#192b37',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                })}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {location.pathname === item.path && <div className="customer-nav-active-bar" />}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-link text-dark position-relative p-2"
              style={{ borderRadius: 10 }}
              onClick={() => navigate('/notifications')}
            >
              <FiBell size={18} />
              {unreadNotifications > 0 && (
                <span className="position-absolute top-0 end-0 badge rounded-pill bg-danger"
                  style={{ fontSize: 10, padding: '2px 5px' }}>
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="position-relative" ref={menuRef}>
              <button
                className="btn btn-link text-dark d-flex align-items-center gap-2 text-decoration-none p-1"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                  style={{
                    width: 32, height: 32, fontSize: 12,
                    background: ROLE_COLORS[user?.role] || '#192b37',
                  }}
                >
                  {initials}
                </div>
                <span className="fw-semibold d-none d-lg-inline" style={{ fontSize: 14, color: '#192b37' }}>{user?.name?.split(' ')[0]}</span>
                <FiChevronDown size={14} className="d-none d-lg-inline" style={{ opacity: 0.5, color: '#192b37' }} />
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
              className="btn btn-link text-dark d-lg-none p-2"
              style={{ borderRadius: 10 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-top bg-white w-100 px-3 py-2 d-lg-none">
            {customerNav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none ${isActive ? 'fw-semibold' : ''}`
                }
                style={({ isActive }) => ({
                  fontSize: 14,
                  color: isActive ? '#ff5640' : '#192b37',
                  background: isActive ? 'rgba(255,86,64,0.06)' : 'transparent',
                })}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <div style={{ height: 1, background: 'rgba(25,43,55,0.06)', margin: '8px 0' }} />
            <NavLink to="/profile" className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" style={{ fontSize: 14, color: '#192b37' }}>
              <FiUser size={18} /> <span>My Profile</span>
            </NavLink>
            <NavLink to="/notifications" className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none" style={{ fontSize: 14, color: '#192b37' }}>
              <FiBell size={18} /> <span>Notifications</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* ─── Main Content ─── */}
      <main className="flex-grow-1" style={{ background: '#f4f6f8' }}>
        <div className="container py-4" style={{ animation: 'fadeInUp 0.4s ease' }}>
          <Outlet />
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-dark text-white-50 py-3 mt-auto" style={{ fontSize: 13 }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>© 2026 InsureFlow. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: 12 }}>Privacy Policy</a>
            <a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: 12 }}>Terms of Service</a>
            <a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: 12 }}>Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
