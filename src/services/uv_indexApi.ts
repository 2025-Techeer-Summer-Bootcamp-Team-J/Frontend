import apiClient from './apiClient';

import type { UVIndexResponse } from './types';

export const getUvIndex = async (): Promise<UVIndexResponse | null> => {
  try {
    const response = await apiClient.get<UVIndexResponse>('/api/uv-index');
    if (response.status === 200 && response.data.status_code === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch UV index:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching UV index:', error);
    return null;
  }
};