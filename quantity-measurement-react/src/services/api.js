import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://quantitymeasurementapp-r3mu.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      const response = await api.post('/Auth/register', { name, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await api.post('/Auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
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
      return { success: false, error: error.response?.data?.message || 'Login failed' };
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

// Measurements API for history
export const measurementsAPI = {
  getMeasurements: async () => {
    try {
      const response = await api.get('/Quantity/history');
      return response.data || [];
    } catch (error) {
      return [];
    }
  },
  
  saveMeasurement: async (measurement) => {
    try {
      // Map frontend data structure to backend expected structure
      const backendMeasurement = {
        operation: measurement.operation?.toLowerCase(),
        inputValue1: parseFloat(measurement.details?.match(/[\d.]+/)?.[0] || 1),
        inputUnit1: measurement.details?.match(/([A-Z]+)/)?.[1] || 'INCHES',
        inputValue2: null,
        inputUnit2: null,
        resultValue: parseFloat(measurement.result?.match(/[\d.]+/)?.[0] || 1),
        resultUnit: measurement.result?.match(/([A-Z]+)/)?.[1] || 'INCHES'
      };
      
      const response = await api.post('/Quantity/history', backendMeasurement);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteMeasurement: async (id) => {
    try {
      const response = await api.delete(`/Quantity/history/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;