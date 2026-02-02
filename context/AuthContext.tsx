import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<User>;
  signup: (email: string, name: string) => Promise<User>;
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
      api.getUser(storedUserId)
        .then(u => {
          setUser(u);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('dancegen_user_id');
        });
    }
  }, []);

  const login = async (email: string): Promise<User> => {
    const u = await api.login(email);
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('dancegen_user_id', u.id);
    return u;
  };

  const signup = async (email: string, name: string): Promise<User> => {
    const u = await api.signup(email, name);
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('dancegen_user_id', u.id);
    return u;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dancegen_user_id');
  };

  const refreshUser = async () => {
    if (user) {
      const updated = await api.getUser(user.id);
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