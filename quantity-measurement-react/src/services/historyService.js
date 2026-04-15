import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const historyService = {
  /**
   * Fetch user history with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Number of items per page (default: 10)
   * @returns {Promise} Response with history data
   */
  getHistory: async (page = 1, pageSize = 10) => {
    try {
      console.log('[History Service] Fetching history:', { page, pageSize });
      
      const response = await api.get('/history', {
        params: { page, pageSize }
      });
      
      console.log('[History Service] Response:', response.data);
      
      return {
        success: true,
        data: response.data,
        items: response.data.items || response.data.data || [],
        total: response.data.total || response.data.totalCount || 0,
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / pageSize)
      };
    } catch (error) {
      console.error('[History Service] Error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.title ||
                          'Failed to fetch history';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status
      };
    }
  },

  /**
   * Delete a history item by ID
   * @param {string} id - History item ID
   * @returns {Promise} Response with deletion status
   */
  deleteHistoryItem: async (id) => {
    try {
      console.log('[History Service] Deleting item:', id);
      
      const response = await api.delete(`/history/${id}`);
      
      console.log('[History Service] Delete response:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[History Service] Delete error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to delete history item';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status
      };
    }
  },

  /**
   * Clear all history for the current user
   * @returns {Promise} Response with deletion status
   */
  clearHistory: async () => {
    try {
      console.log('[History Service] Clearing all history');
      
      const response = await api.delete('/history');
      
      console.log('[History Service] Clear response:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[History Service] Clear error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to clear history';
      
      return {
        success: false,
        error: errorMessage,
        status: error.response?.status
      };
    }
  }
};

export default historyService;
