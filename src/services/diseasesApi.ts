import apiClient from './apiClient';
import type { Disease, ApiResponse } from './types';

/**
 * 전체 질환 목록 조회
 */
export const getAllDiseases = async (): Promise<Disease[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Disease[]>>('/api/diseases');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch diseases:', error);
    throw error;
  }
};

/**
 * 질환 상세 조회
 */
export const getDiseaseById = async (diseaseId: number): Promise<Disease> => {
  try {
    const response = await apiClient.get<ApiResponse<Disease>>(`/api/diseases/${diseaseId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch disease ${diseaseId}:`, error);
    throw error;
  }
};

/**
 * 질환 검색 (선택적 기능)
 */
export const searchDiseases = async (query: string): Promise<Disease[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Disease[]>>('/api/diseases', {
      params: { search: query }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to search diseases:', error);
    throw error;
  }
};

/**
 * 질환을 카테고리별로 조회 (선택적 기능)
 */
export const getDiseasesByCategory = async (category: string): Promise<Disease[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Disease[]>>('/api/diseases', {
      params: { category }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch diseases by category ${category}:`, error);
    throw error;
  }
};

// 편의 함수들
export const diseasesApi = {
  getAll: getAllDiseases,
  getById: getDiseaseById,
  search: searchDiseases,
  getByCategory: getDiseasesByCategory,
};

export default diseasesApi; 