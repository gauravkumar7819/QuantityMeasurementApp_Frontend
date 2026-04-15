import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const GoogleAuthContext = createContext(null);

export const GoogleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore auth state on page load
  useEffect(() => {
    const restoreAuth = () => {
      try {
        const storedUser = authService.getCurrentUser();
        const storedToken = authService.getToken();
        const isAuth = authService.isAuthenticated();

        if (isAuth && storedUser && storedToken) {
          setUser(storedUser);
          setJwtToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error restoring auth state:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  /**
   * Handle Google login success
   * @param {Object} credentialResponse - Response from Google OAuth
   */
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);

      const googleToken = credentialResponse.credential;
      const response = await authService.googleLogin(googleToken);

      if (response.success) {
        setUser(response.user);
        setJwtToken(response.jwtToken);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(response.error || 'Google authentication failed');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('An unexpected error occurred during login');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google login error
   * @param {Object} error - Error from Google OAuth
   */
  const handleGoogleLoginError = (error) => {
    console.error('Google login error:', error);
    setError(error?.error || 'Google authentication failed');
    setLoading(false);
    setIsAuthenticated(false);
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setJwtToken(null);
    setIsAuthenticated(false);
    setError(null);
  };

  /**
   * Update user state
   * @param {Object} updatedUser - Updated user object
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    jwtToken,
    isAuthenticated,
    loading,
    error,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
    logout,
    updateUser,
    setError
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

/**
 * Custom hook to use Google Auth Context
 * @returns {Object} Auth context value
 */
export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};

export default GoogleAuthContext;
