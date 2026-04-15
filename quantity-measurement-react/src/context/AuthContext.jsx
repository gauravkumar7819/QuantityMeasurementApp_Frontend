import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = authAPI.getToken();
        const storedUser = authAPI.getCurrentUser();
        
        if (token && storedUser) {
          // Validate that we have both token and user
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          // Clear any invalid data
          authAPI.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Clear corrupted data
        authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (name, email, password) => {
    try {
      const result = await authAPI.register(name, email, password);
      
      if (result.success) {
        // Update auth state from API response
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true, data: result.data };
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authAPI.login(email, password);
      
      if (result.success) {
        // Update auth state from API response
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true, data: result.data };
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Clear localStorage
    authAPI.logout();
    
    // Clear React state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      signup, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};