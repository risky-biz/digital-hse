import api from './api';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export const incidentApi = {
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API GET Error:', error);
      return {
        success: false,
        data: null as any,
        message: 'Request failed'
      };
    }
  },

  async post<T = any>(endpoint: string, data?: any, options?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(endpoint, data, options);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API POST Error:', error);
      return {
        success: false,
        data: null as any,
        message: 'Request failed'
      };
    }
  },

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(endpoint, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API PUT Error:', error);
      return {
        success: false,
        data: null as any,
        message: 'Request failed'
      };
    }
  },

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(endpoint);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API DELETE Error:', error);
      return {
        success: false,
        data: null as any,
        message: 'Request failed'
      };
    }
  }
};