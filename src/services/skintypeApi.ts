import apiClient from './apiClient';
import type { SkinType, SkinTypeAnalysisRequest, SkinTypeAnalysisResponse, ApiResponse } from './types';

/**
 * 모든 skintype 조회
 */
export const getAllSkinTypes = async (): Promise<SkinType[]> => {
  try {
    const response = await apiClient.get<ApiResponse<SkinType[]>>('/api/skintype');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch skin types:', error);
    throw error;
  }
};

/**
 * 특정 skintype 설명 조회
 */
export const getSkinTypeById = async (skintypeId: number): Promise<SkinType> => {
  try {
    const response = await apiClient.get<ApiResponse<SkinType>>(`/api/skintype/${skintypeId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch skin type ${skintypeId}:`, error);
    throw error;
  }
};

/**
 * 피부 유형 분석 요청
 */
export const analyzeSkinType = async (
  userId: number, 
  analysisData: SkinTypeAnalysisRequest
): Promise<SkinTypeAnalysisResponse> => {
  try {
    // FormData 형태로 전송 (이미지 파일이 포함될 수 있음)
    const formData = new FormData();
    
    if (analysisData.image) {
      formData.append('image', analysisData.image);
    }
    
    if (analysisData.answers) {
      formData.append('answers', JSON.stringify(analysisData.answers));
    }

    console.log('API 요청 시작:', { userId, hasImage: !!analysisData.image });

    const response = await apiClient.post<SkinTypeAnalysisResponse>(
      `/api/skintype/${userId}/analysis`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('API 응답 받음:', response.data);
    return response.data;
  } catch (error) {
    console.error('피부 타입 분석 실패:', error);
    throw error;
  }
};

// 편의 함수들
export const skintypeApi = {
  getAll: getAllSkinTypes,
  getById: getSkinTypeById,
  analyze: analyzeSkinType,
};

export default skintypeApi; 