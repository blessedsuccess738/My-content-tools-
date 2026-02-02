import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('dancegen_user_id');
    if (storedUserId) {
      mockApi.getUser(storedUserId)
        .then(u => {
          setUser(u);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('dancegen_user_id');
        });
    }
  }, []);

  const login = async (email: string) => {
    const u = await mockApi.login(email);
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('dancegen_user_id', u.id);
  };

  const signup = async (email: string, name: string) => {
    const u = await mockApi.signup(email, name);
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('dancegen_user_id', u.id);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dancegen_user_id');
  };

  const refreshUser = async () => {
    if (user) {
      const updated = await mockApi.getUser(user.id);
      setUser(updated);
    }
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};