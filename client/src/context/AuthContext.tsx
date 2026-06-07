'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  location: UserLocation;
  savedProfessionals: string[];
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateLocation: (latitude: number, longitude: number, address: string) => Promise<boolean>;
  toggleSavedProfessional: (id: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  apiUrl: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success && data.user) {
        // Map _id to id
        const mappedUser: User = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          location: data.user.location,
          savedProfessionals: data.user.savedProfessionals || []
        };
        setUser(mappedUser);
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('fixmate_token');
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('fixmate_token', data.token);
        setToken(data.token);
        const mappedUser: User = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          location: data.user.location,
          savedProfessionals: data.user.savedProfessionals || []
        };
        setUser(mappedUser);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection to server failed' };
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('fixmate_token', data.token);
        setToken(data.token);
        const mappedUser: User = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          location: data.user.location,
          savedProfessionals: data.user.savedProfessionals || []
        };
        setUser(mappedUser);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection to server failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fixmate_token');
    setToken(null);
    setUser(null);
  };

  const updateLocation = async (latitude: number, longitude: number, address: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ latitude, longitude, address })
      });
      const data = await res.json();
      if (data.success && user) {
        setUser({
          ...user,
          location: data.user.location
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update location:', err);
      return false;
    }
  };

  const toggleSavedProfessional = async (id: string) => {
    if (!token || !user) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/saved-professionals/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const isSaved = data.saved;
        let newList = [...user.savedProfessionals];
        if (isSaved) {
          if (!newList.includes(id)) newList.push(id);
        } else {
          newList = newList.filter(pId => pId !== id);
        }
        setUser({
          ...user,
          savedProfessionals: newList
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to toggle saved professional:', err);
      return false;
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateLocation,
        toggleSavedProfessional,
        refreshUser,
        apiUrl: API_BASE_URL
      }}
    >
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
export { API_BASE_URL };
