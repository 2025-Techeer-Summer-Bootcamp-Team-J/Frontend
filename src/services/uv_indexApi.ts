import apiClient from './apiClient';
import type { UVIndexData, UVIndexResponse } from './types';

export const getUVIndex = async (): Promise<UVIndexData> => {
  try {
    const response = await apiClient.get<UVIndexResponse>('/api/uv-index');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch UV index:', error);
    throw error;
  }
};

// 편의 함수
export const uvIndexApi = {
  get: getUVIndex,
};

export default uvIndexApi;