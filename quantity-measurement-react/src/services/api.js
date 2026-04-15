import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  // Check both old token and new JWT token
  const oldToken = localStorage.getItem('token');
  const newToken = authService.getToken();
  
  // Use new token if available, otherwise use old token
  const token = newToken || oldToken;
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle token expiration and auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear both auth systems
      authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (name, email, password) => {
    try {
      console.log('[API] Register request:', { name, email, password: '***' });
      const response = await api.post('/Auth/register', { name, email, password });
      console.log('[API] Register response:', response.data);
      
      // Handle both token and jwtToken in response
      const token = response.data.token || response.data.jwtToken;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      console.error('[API] Register error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.title ||
                          JSON.stringify(error.response?.data) ||
                          'Registration failed';
      return { success: false, error: errorMessage };
    }
  },
  
  login: async (email, password) => {
    try {
      console.log('[API] Login request:', { email, password: '***' });
      const response = await api.post('/Auth/login', { email, password });
      console.log('[API] Login response:', response.data);
      
      // Handle both token and jwtToken in response
      const token = response.data.token || response.data.jwtToken;
      
      if (token) {
        localStorage.setItem('token', token);
        
        // Handle user data - some APIs return user in response, others don't
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          // Create minimal user object from email if no user data returned
          const minimalUser = { 
            email: email, 
            name: email.split('@')[0], // Use email prefix as name
            id: null 
          };
          localStorage.setItem('user', JSON.stringify(minimalUser));
        }
        
        // Return consistent data structure
        const returnData = {
          ...response.data,
          user: response.data.user || JSON.parse(localStorage.getItem('user'))
        };
        
        return { success: true, data: returnData };
      } else {
        return { success: false, error: 'Login response missing token' };
      }
    } catch (error) {
      console.error('[API] Login error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.title ||
                          JSON.stringify(error.response?.data) ||
                          'Login failed';
      return { success: false, error: errorMessage };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  },
  
  getToken: () => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
    return null;
  },
};

// Quantity APIs
export const quantityAPI = {
  convert: async (value, fromUnit, toUnit) => {
    try {
      const request = {
        q1: {
          value: parseFloat(value),
          unit: fromUnit
        },
        targetUnit: toUnit
      };
      
      const response = await api.post('/Quantity/convert', request);
      
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = error.response?.data?.error || 
                       error.response?.data?.message || 
                       error.response?.data || 
                       'Conversion failed';
      
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('invalid')) {
        errorMessage += `\n\n💡 Tip: Check if unit names "${fromUnit}" and "${toUnit}" match your .NET backend expectations.`;
        errorMessage += `\n   Common formats: "m", "km", "meter", "kilometer", etc.`;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },
  
  compare: async (value1, unit1, value2, unit2) => {
    
    try {
      const request = {
        q1: {
          value: parseFloat(value1),
          unit: unit1
        },
        q2: {
          value: parseFloat(value2),
          unit: unit2
        },
        targetUnit: unit1
      };
      
      const response = await api.post('/Quantity/compare', request);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          'Comparison failed';
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },
  
  add: async (value1, unit1, value2, unit2, targetUnit) => {
    
    try {
      const request = {
        q1: {
          value: parseFloat(value1),
          unit: unit1
        },
        q2: {
          value: parseFloat(value2),
          unit: unit2
        },
        targetUnit: targetUnit
      };
      
      const response = await api.post('/Quantity/add', request);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          'Addition failed';
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },
  
  subtract: async (value1, unit1, value2, unit2, targetUnit) => {
    
    try {
      const request = {
        q1: {
          value: parseFloat(value1),
          unit: unit1
        },
        q2: {
          value: parseFloat(value2),
          unit: unit2
        },
        targetUnit: targetUnit
      };
      
      const response = await api.post('/Quantity/subtract', request);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          'Subtraction failed';
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },
  
  divide: async (value1, unit1, value2, unit2) => {
    
    try {
      const request = {
        q1: {
          value: parseFloat(value1),
          unit: unit1
        },
        q2: {
          value: parseFloat(value2),
          unit: unit2
        },
        targetUnit: unit1
      };
      
      // Only log in debug mode
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('📤 Sending divide request:', JSON.stringify(request, null, 2));
      }
      
      const response = await api.post('/Quantity/divide', request);
      
      // Only log in debug mode
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('✅ Divide response:', JSON.stringify(response.data, null, 2));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      // Only log errors in debug mode
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.error('❌ Divide error:', error.response?.status, error.response?.data);
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          'Division failed';
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },
};

// Measurements API for history - DISABLED (backend doesn't support history endpoints)
export const measurementsAPI = {
  getMeasurements: async () => {
    // History feature not supported by backend
    return [];
  },
  
  saveMeasurement: async (measurement) => {
    // History feature not supported by backend
    throw new Error('History feature is not available');
  },
  
  deleteMeasurement: async (id) => {
    // History feature not supported by backend
    throw new Error('History feature is not available');
  },
};

export default api;