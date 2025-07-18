import apiClient from './apiClient';
import type { UVIndexResponse, UVIndexApiResponse } from './types';


export const getUVIndex = async (): Promise<UVIndexResponse> => {
    try {
      const response = await apiClient.get<UVIndexApiResponse>('/api/uv-index/');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch UV index:', error);
      throw error;
    }
  };