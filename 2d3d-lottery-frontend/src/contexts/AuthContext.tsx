import React, { createContext, useCallback, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('@2d3d:token');
      
      if (token) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('@2d3d:token');
      api.defaults.headers.authorization = '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('@2d3d:token', token);
    api.defaults.headers.authorization = `Bearer ${token}`;

    setUser(user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    const { token, user } = response.data;

    localStorage.setItem('@2d3d:token', token);
    api.defaults.headers.authorization = `Bearer ${token}`;

    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@2d3d:token');
    api.defaults.headers.authorization = '';
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 