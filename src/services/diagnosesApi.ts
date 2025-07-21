import apiClient from './apiClient';
import type { 
  DiagnosisRequest, 
  AsyncDiagnosisResponse,
  TaskStatusResponse,
  UserDiagnosesResponse,
  DiagnosisDetailResponse,
  SaveDiagnosisRequest,
  SaveDiagnosisResponse,
  StreamEvent,
  CreateDiagnosisAdditionalRequest,
  DiagnosisAdditionalResponse
} from './types';

/**
 * 비동기 진단 요청
 */
export const createDiagnosis = async (diagnosisData: DiagnosisRequest): Promise<AsyncDiagnosisResponse> => {
  try {
    // FormData 형태로 전송
    const formData = new FormData();
    
    // user_id를 integer로 변환 (Clerk ID를 해시하거나 매핑된 숫자 ID 사용)
    // 임시로 user_id 문자열을 숫자로 해시 변환
    const numericUserId = Math.abs(diagnosisData.user_id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0));
    
    formData.append('user_id', numericUserId.toString());
    
    if (diagnosisData.file) {
      formData.append('file', diagnosisData.file);
    }

    const response = await apiClient.post<AsyncDiagnosisResponse>(
      '/api/diagnoses',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to create diagnosis:', error);
    throw error;
  }
};

/**
 * 유저의 모든 진단 조회
 */
export const getUserDiagnoses = async (userId: number): Promise<UserDiagnosesResponse> => {
  try {
    const response = await apiClient.get<UserDiagnosesResponse>(`/api/diagnoses/users/${userId}/diagnoses`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch diagnoses for user ${userId}:`, error);
    throw error;
  }
};

/**
 * 진단 삭제
 */
export const deleteDiagnosis = async (diagnosisId: number, userId: number): Promise<UserDiagnosesResponse> => {
  try {
    const response = await apiClient.delete<UserDiagnosesResponse>(
      `/api/diagnoses/${diagnosisId}?user_id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to delete diagnosis ${diagnosisId}:`, error);
    throw error;
  }
};

/**
 * 진단 세부 정보 조회
 */
export const getDiagnosisById = async (diagnosisId: number): Promise<DiagnosisDetailResponse> => {
  try {
    const response = await apiClient.get<DiagnosisDetailResponse>(`/api/diagnoses/${diagnosisId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch diagnosis ${diagnosisId}:`, error);
    throw error;
  }
};

/**
 * 질병 정보 스트리밍 생성 (SSE) - Mock 구현 (서버 엔드포인트가 없어서 임시)
 */
export const generateDiagnosisStream = (
  userId: string, // Clerk user ID는 string 타입
  diseaseName: string,
  image: File,
  onEvent: (event: StreamEvent) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): EventSource => {
  console.log('SSE 스트리밍 시작:', { userId, diseaseName, imageSize: image.size });
  
  // 실제 SSE 엔드포인트 URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const sseUrl = `${baseUrl}/api/diagnoses/stream?user_id=${userId}&disease_name=${encodeURIComponent(diseaseName)}`;
  
  console.log('SSE URL:', sseUrl);
  
  const eventSource = new EventSource(sseUrl);
  
  eventSource.onopen = (event) => {
    console.log('✅ SSE 연결 성공:', event);
  };
  
  eventSource.onmessage = (event) => {
    console.log('📨 SSE 메시지 수신:', event.data);
    
    try {
      const data = JSON.parse(event.data) as StreamEvent;
      onEvent(data);
      
      if (data.type === 'complete') {
        console.log('🏁 SSE 스트리밍 완료');
        eventSource.close();
        onComplete?.();
      }
    } catch (parseError) {
      console.error('SSE 데이터 파싱 오류:', parseError, 'Raw data:', event.data);
    }
  };
  
  eventSource.onerror = (event) => {
    console.error('❌ SSE 연결 오류:', event);
    eventSource.close();
    
    if (onError) {
      onError(new Error('SSE connection failed'));
    }
  };
  
  return eventSource;
};

/**
 * 진단 결과 저장
 */
export const saveDiagnosisResult = async (diagnosisData: SaveDiagnosisRequest): Promise<SaveDiagnosisResponse> => {
  try {
    const response = await apiClient.post<SaveDiagnosisResponse>(
      '/api/diagnoses/save',
      diagnosisData
    );
    return response.data;
  } catch (error) {
    console.error('Failed to save diagnosis result:', error);
    throw error;
  }
};

/**
 * 진단 보조 정보 생성
 */
export const createDiagnosisAdditionalInfo = async (
  diagnosisId: number, 
  additionalData: CreateDiagnosisAdditionalRequest
): Promise<DiagnosisAdditionalResponse> => {
  try {
    const response = await apiClient.post<DiagnosisAdditionalResponse>(
      `/api/diagnoses/${diagnosisId}/additional`,
      additionalData
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to create additional info for diagnosis ${diagnosisId}:`, error);
    throw error;
  }
};

/**
 * 진단 보조 정보 조회
 */
export const getDiagnosisAdditionalInfo = async (diagnosisId: number): Promise<DiagnosisAdditionalResponse> => {
  try {
    const response = await apiClient.get<DiagnosisAdditionalResponse>(
      `/api/diagnoses/${diagnosisId}/additional`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch additional info for diagnosis ${diagnosisId}:`, error);
    throw error;
  }
};

/**
 * 진단 작업 상태 조회
 */
export const getDiagnosisTaskStatus = async (taskId: string): Promise<TaskStatusResponse> => {
  try {
    const response = await apiClient.get<TaskStatusResponse>(`/api/diagnoses/tasks/${taskId}/status`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch task status for task ${taskId}:`, error);
    throw error;
  }
};

// 편의 함수들
export const diagnosesApi = {
  create: createDiagnosis,
  getByUserId: getUserDiagnoses,
  getById: getDiagnosisById,
  delete: deleteDiagnosis,
  generateStream: generateDiagnosisStream,
  saveResult: saveDiagnosisResult,
  createAdditionalInfo: createDiagnosisAdditionalInfo,
  getAdditionalInfo: getDiagnosisAdditionalInfo,
  getTaskStatus: getDiagnosisTaskStatus,
};

export default diagnosesApi; 