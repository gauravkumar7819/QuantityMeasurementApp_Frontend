import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Authentication Service for Google OAuth
export const authService = {
  /**
   * Authenticate with Google token
   * @param {string} googleToken - Google ID token from Google OAuth
   * @returns {Promise} Response with jwtToken and user details
   */
  googleLogin: async (googleToken) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/google`, {
        token: googleToken
      });

      console.log('[Google Auth] Response:', response.data);

      // Handle both token and jwtToken in response
      const jwtToken = response.data.token || response.data.jwtToken;
      const user = response.data.user;

      // Store JWT token in localStorage
      if (jwtToken) {
        localStorage.setItem('jwtToken', jwtToken);
      }

      // Store user details in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return {
        success: true,
        jwtToken,
        user
      };
    } catch (error) {
      console.error('Google login failed:', error);
      
      // Handle different error scenarios
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Google authentication failed. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status
      };
    }
  },

  /**
   * Logout user
   * Clears all authentication data from localStorage
   */
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null if not authenticated
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Get JWT token from localStorage
   * @returns {string|null} JWT token or null if not authenticated
   */
  getToken: () => {
    const token = localStorage.getItem('jwtToken');
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('jwtToken');
    const user = localStorage.getItem('user');
    
    return !!(token && token !== 'undefined' && token !== 'null' &&
             user && user !== 'undefined' && user !== 'null');
  },

  /**
   * Validate token (optional - can be used to check if token is still valid)
   * @returns {Promise<boolean>} True if token is valid, false otherwise
   */
  validateToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        return false;
      }

      const response = await axios.get(`${API_BASE_URL}/Auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      // If token is invalid, clear authentication data
      authService.logout();
      return false;
    }
  },

  /**
   * Refresh JWT token
   * @returns {Promise} Response with new jwtToken and user details
   */
  refreshToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, error: 'No token to refresh' };
      }

      const response = await axios.post(`${API_BASE_URL}/Auth/refresh`, {
        token: token
      });

      const { jwtToken, user } = response.data;

      // Update JWT token in localStorage
      if (jwtToken) {
        localStorage.setItem('jwtToken', jwtToken);
      }

      // Update user details in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return {
        success: true,
        jwtToken,
        user
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Token refresh failed. Please login again.';
      
      // If refresh fails, clear authentication data
      authService.logout();
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status
      };
    }
  }
};

export default authService;
