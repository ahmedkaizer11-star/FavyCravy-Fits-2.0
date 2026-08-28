import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { api } from '../services/api';

interface AdminAuthContextType {
  adminToken: string | null;
  adminUser: AdminUser | null;
  user: AdminUser | null;
  isAdminAuthenticated: boolean;
  isAdminLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);
const TOKEN_KEY = 'fcf_admin_token';
const USER_KEY = 'fcf_admin_user';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!adminToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getAdminMe(adminToken);
        if (res && res.user) {
          setAdminUser(res.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [adminToken]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await api.adminLogin({ username, password });
      if (data && data.token) {
        setAdminToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuth = Boolean(adminToken && adminUser);

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        adminUser,
        user: adminUser,
        isAdminAuthenticated: isAuth,
        isAdminLoggedIn: isAuth,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
