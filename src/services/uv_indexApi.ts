import apiClient from './apiClient';
import type { UVIndexResponse } from './types';


export const getUVIndex = async (): Promise<UVIndexResponse> => {
    try {
      const response = await apiClient.get<UVIndexResponse>('/api/uv-index/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch UV index:', error);
      throw error;
    }
  };