import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import { ROLES } from './constants/roles';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Common pages
import Dashboard from './pages/common/Dashboard';
import ProfilePage from './pages/common/ProfilePage';

// Customer pages
import BrowseProducts from './pages/customer/BrowseProducts';
import SelectModules from './pages/customer/SelectModules';
import MedicalDisclosure from './pages/customer/MedicalDisclosure';
import ApplyPolicy from './pages/customer/ApplyPolicy';
import RiskExplanation from './pages/customer/RiskExplanation';
import PolicyDocuments from './pages/customer/PolicyDocuments';
import FamilyPool from './pages/customer/FamilyPool';
import Wellness from './pages/customer/Wellness';
import Notifications from './pages/customer/Notifications';

// Underwriter pages
import ReviewApplication from './pages/underwriter/ReviewApplication';
import RiskAnalysis from './pages/underwriter/RiskAnalysis';

// Admin pages
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import BusinessRules from './pages/admin/BusinessRules';
import PolicyControl from './pages/admin/PolicyControl';
import AuditLogs from './pages/admin/AuditLogs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── Public Auth Routes ─── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ═══════════════════════════════════════════════════════
              CUSTOMER PORTAL — Uses CustomerLayout (top navbar)
              ═══════════════════════════════════════════════════════ */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="products" element={<BrowseProducts />} />
            <Route path="products/:productId" element={<SelectModules />} />
            <Route path="medical-disclosure" element={<MedicalDisclosure />} />
            <Route path="apply" element={<ApplyPolicy />} />
            <Route path="risk-explanation" element={<RiskExplanation />} />
            <Route path="policies" element={<PolicyDocuments />} />
            <Route path="family-pool" element={<FamilyPool />} />
            <Route path="wellness" element={<Wellness />} />
          </Route>

          {/* ═══════════════════════════════════════════════════════
              ADMIN / UNDERWRITER — Uses MainLayout (sidebar)
              ═══════════════════════════════════════════════════════ */}
          <Route
            path="/admin-portal"
            element={
              <ProtectedRoute allowedRoles={[ROLES.UNDERWRITER, ROLES.ADMIN]}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin-portal/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<Notifications />} />

            {/* Underwriter routes */}
            <Route
              path="applications"
              element={
                <ProtectedRoute allowedRoles={[ROLES.UNDERWRITER]}>
                  <ReviewApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="risk-analysis"
              element={
                <ProtectedRoute allowedRoles={[ROLES.UNDERWRITER]}>
                  <RiskAnalysis />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="rules"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <BusinessRules />
                </ProtectedRoute>
              }
            />
            <Route
              path="policies"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <PolicyControl />
                </ProtectedRoute>
              }
            />
            <Route
              path="audit"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
