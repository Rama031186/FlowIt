import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
  '/admin-portal/dashboard': 'Dashboard',
  '/admin-portal/applications': 'Applications',
  '/admin-portal/risk-analysis': 'Risk Analysis',
  '/admin-portal/users': 'User Management',
  '/admin-portal/products': 'Product Management',
  '/admin-portal/rules': 'Business Rules',
  '/admin-portal/policies': 'Policy Control',
  '/admin-portal/audit': 'Audit Logs',
  '/admin-portal/profile': 'My Profile',
  '/admin-portal/notifications': 'Notifications',
};

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || '';

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Topbar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} title={title} />
      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
