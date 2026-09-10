'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SavedTraveler } from '@/lib/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginDemo: (type?: 'user' | 'admin') => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  savedTravelers: SavedTraveler[];
  refreshSavedTravelers: () => Promise<void>;
  addSavedTraveler: (traveler: Partial<SavedTraveler>) => Promise<void>;
  deleteSavedTraveler: (id: number) => Promise<void>;
  removeSavedTraveler: (id?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedTravelers, setSavedTravelers] = useState<SavedTraveler[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    try {
      const token = localStorage.getItem('orbinex_access_token');
      if (token) {
        const profile = await api.getProfile();
        setUser(profile);
        const travelers = await api.getSavedTravelers();
        setSavedTravelers(travelers);
      }
    } catch (e) {
      console.warn('Auth token expired or backend offline:', e);
      localStorage.removeItem('orbinex_access_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('orbinex_access_token', res.access);
      if (res.refresh) {
        localStorage.setItem('orbinex_refresh_token', res.refresh);
      }
      setUser(res.user);
      const travelers = await api.getSavedTravelers();
      setSavedTravelers(travelers);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async (type: 'user' | 'admin' = 'user') => {
    if (type === 'admin') {
      await login('admin', 'Admin@Orbinex2026!');
    } else {
      await login('demo_user', 'Demo@Orbinex2026!');
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await api.register(data);
      await login(data.username, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('orbinex_access_token');
    localStorage.removeItem('orbinex_refresh_token');
    setUser(null);
    setSavedTravelers([]);
  };

  const refreshSavedTravelers = async () => {
    try {
      const data = await api.getSavedTravelers();
      setSavedTravelers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addSavedTraveler = async (traveler: Partial<SavedTraveler>) => {
    await api.createSavedTraveler(traveler);
    await refreshSavedTravelers();
  };

  const deleteSavedTraveler = async (id: number) => {
    await api.deleteSavedTraveler(id);
    await refreshSavedTravelers();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemo,
        register,
        logout,
        savedTravelers,
        refreshSavedTravelers,
        addSavedTraveler,
        deleteSavedTraveler,
        removeSavedTraveler: async (id?: number) => { if (id) await deleteSavedTraveler(id); },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
