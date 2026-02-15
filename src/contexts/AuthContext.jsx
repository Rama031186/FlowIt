import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return { success: false, message: 'Invalid email or password' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const loginAsRole = (role) => {
    const found = DEMO_USERS.find((u) => u.role === role);
    if (!found) return { success: false, message: 'Role not found' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const register = (name, email, password) => {
    const exists = DEMO_USERS.find((u) => u.email === email);
    if (exists) return { success: false, message: 'Email already registered' };
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: ROLES.CUSTOMER,
      avatar: null,
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const resetPassword = (email) => {
    const exists = DEMO_USERS.find((u) => u.email === email);
    if (!exists) return { success: false, message: 'Email not found' };
    return { success: true, message: 'Password reset link sent to your email' };
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginAsRole, register, resetPassword, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
