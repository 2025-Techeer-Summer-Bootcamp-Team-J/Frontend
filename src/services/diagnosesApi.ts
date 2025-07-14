import apiClient from './apiClient';
import type { DiagnosisRequest, Diagnosis, ApiResponse } from './types';

/**
 * 진단 요청
 */
export const createDiagnosis = async (diagnosisData: DiagnosisRequest): Promise<Diagnosis> => {
  try {
    // FormData 형태로 전송 (이미지 파일들이 포함될 수 있음)
    const formData = new FormData();
    
    // 기본 데이터 추가
    formData.append('user_id', diagnosisData.user_id.toString());
    formData.append('symptoms', JSON.stringify(diagnosisData.symptoms));
    formData.append('affected_areas', JSON.stringify(diagnosisData.affected_areas));
    formData.append('duration', diagnosisData.duration);
    formData.append('severity', diagnosisData.severity.toString());
    
    if (diagnosisData.additional_info) {
      formData.append('additional_info', diagnosisData.additional_info);
    }
    
    // 이미지 파일들 추가
    if (diagnosisData.images && diagnosisData.images.length > 0) {
      // 서버에서 'file' 필드를 요구하므로 첫 번째 이미지를 'file'로 전송
      formData.append('file', diagnosisData.images[0]);
      
      // 만약 여러 이미지가 있다면 추가로 'images'에도 저장
      if (diagnosisData.images.length > 1) {
        diagnosisData.images.slice(1).forEach((image) => {
          formData.append('images', image);
        });
      }
    }

    const response = await apiClient.post<ApiResponse<Diagnosis>>(
      '/api/diagnoses',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Failed to create diagnosis:', error);
    throw error;
  }
};

/**
 * 유저의 진단 기록 조회
 */
export const getUserDiagnoses = async (userId: number): Promise<Diagnosis[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Diagnosis[]>>(`/api/diagnoses/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch diagnoses for user ${userId}:`, error);
    throw error;
  }
};

/**
 * 특정 진단 상세 조회 (선택적 기능)
 */
export const getDiagnosisById = async (diagnosisId: number): Promise<Diagnosis> => {
  try {
    const response = await apiClient.get<ApiResponse<Diagnosis>>(`/api/diagnoses/${diagnosisId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch diagnosis ${diagnosisId}:`, error);
    throw error;
  }
};

/**
 * 진단 상태 업데이트 (선택적 기능)
 */
export const updateDiagnosisStatus = async (
  diagnosisId: number, 
  status: 'pending' | 'completed' | 'reviewed'
): Promise<Diagnosis> => {
  try {
    const response = await apiClient.patch<ApiResponse<Diagnosis>>(
      `/api/diagnoses/${diagnosisId}`,
      { status }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update diagnosis ${diagnosisId} status:`, error);
    throw error;
  }
};

// 편의 함수들
export const diagnosesApi = {
  create: createDiagnosis,
  getByUserId: getUserDiagnoses,
  getById: getDiagnosisById,
  updateStatus: updateDiagnosisStatus,
};

export default diagnosesApi; 