import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('zestora_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session expired or invalid token:', err);
        localStorage.removeItem('zestora_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('zestora_token', res.token);
        setUser(res.user);
        success(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toastError(err.message || 'Login failed. Check your credentials.');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success) {
        localStorage.setItem('zestora_token', res.token);
        setUser(res.user);
        success(`Account created! Welcome to Zestora, ${res.user.name}.`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toastError(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('zestora_token');
    setUser(null);
    success('Logged out successfully.');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
