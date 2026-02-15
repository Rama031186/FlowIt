import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import sidebarConfig from '../../config/sidebarConfig';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredSections = sidebarConfig
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.allowedRoles.includes(user?.role)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">IN</div>
        <span className="brand-text">InsureFlow</span>
      </div>

      <nav className="sidebar-nav">
        {filteredSections.map((section) => (
          <div key={section.section}>
            <div className="sidebar-section-label">{section.section}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="item-icon"><Icon /></span>
                  <span className="item-label">{item.label}</span>
                  {item.badge && (
                    <span className="item-badge">3</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-item"
          onClick={onToggle}
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <span className="item-icon">
            <FiChevronLeft
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s',
              }}
            />
          </span>
          <span className="item-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
