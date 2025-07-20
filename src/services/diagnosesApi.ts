import apiClient from './apiClient';
import type { 
  DiagnosisRequest, 
  AsyncDiagnosisResponse,
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
    
    formData.append('user_id', diagnosisData.user_id.toString());
    
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
 * 질병 정보 스트리밍 생성 (SSE) - POST 방식
 */
export const generateDiagnosisStream = (
  userId: number,
  diseaseName: string,
  image: File,
  onEvent: (event: StreamEvent) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): EventSource => {
  try {
    // FormData로 데이터 준비
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('disease_name', diseaseName);
    formData.append('image', image);

    // SSE 연결을 위한 fetch 사용 (POST 요청)
    fetch(`${apiClient.defaults.baseURL}/api/diagnoses/generate-stream`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'text/event-stream',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        const decoder = new TextDecoder();
        
        function readStream(): Promise<void> {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              onComplete?.();
              return;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  onEvent(data);
                  
                  if (data.type === 'complete') {
                    onComplete?.();
                    return;
                  }
                } catch {
                  console.warn('Failed to parse SSE data:', line);
                }
              }
            }
            
            return readStream();
          });
        }
        
        readStream().catch(error => onError?.(error));
      })
      .catch(error => onError?.(error));

    // EventSource와 호환되는 인터페이스를 위한 객체 반환
    return {
      close: () => {},
      readyState: 1,
      url: '',
      withCredentials: false,
      CONNECTING: 0,
      OPEN: 1,
      CLOSED: 2,
      onopen: null,
      onmessage: null,
      onerror: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as EventSource;
  } catch (error) {
    console.error('Failed to start diagnosis stream:', error);
    onError?.(error as Error);
    throw error;
  }
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
};

export default diagnosesApi; 