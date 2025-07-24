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
    
    // Clerk 문자열 ID 그대로 사용 - 숫자 변환 제거
    
    formData.append('user_id', diagnosisData.user_id);
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
export const getUserDiagnoses = async (userId: string): Promise<UserDiagnosesResponse> => {
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
export const deleteDiagnosis = async (diagnosisId: number, userId: string): Promise<UserDiagnosesResponse> => {
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
 * 질병 정보 스트리밍 생성 (실제 POST SSE API 사용)
 */
export const generateDiagnosisStream = (
  userId: string, // Clerk user ID는 string 타입
  diseaseName: string,
  onEvent: (event: StreamEvent) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void,
  image?: File // File 객체를 optional로 변경하고 마지막으로 이동
): EventSource => {
  console.log('🚀 실제 POST SSE 스트리밍 시작:', { userId, diseaseName, imageSize: image?.size || 'N/A' });

  if (!image) {
    console.error('❌ 이미지가 필요합니다');
    onError?.(new Error('이미지 파일이 필요합니다'));
    // 더미 EventSource 반환
    return {
      close: () => {},
      readyState: 2, // CLOSED
      url: '',
      withCredentials: false,
      onopen: null, onmessage: null, onerror: null,
      addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
      CONNECTING: 0, OPEN: 1, CLOSED: 2
    } as unknown as EventSource;
  }

  // POST 요청을 위한 FormData 준비
  const formData = new FormData();
  
  // Clerk 문자열 ID 그대로 사용
  formData.append('user_id', userId);
  formData.append('disease_name', diseaseName);
  formData.append('image', image);

  console.log('📤 POST 데이터 준비:', {
    user_id: userId,
    disease_name: diseaseName,
    image_name: image.name,
    image_size: image.size
  });

  // 실제 API 엔드포인트 URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? '' : 'http://localhost:8000');
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // 단어별 스트리밍을 위한 상태 관리
  const streamingState: Record<string, {
    tokens: string[];
    currentIndex: number;
    currentText: string;
    timeoutId?: number;
  }> = {};

  // 단어별 스트리밍 함수
  const startWordByWordStreaming = (tab: string, fullContent: string) => {
    // 이미 스트리밍 중이면 중복 방지
    if (streamingState[tab]) {
      window.clearTimeout(streamingState[tab].timeoutId);
    }

    // 줄바꿈을 보존하면서 단어로 분할
    const tokens = fullContent.trim().split(/(\s+)/);
    streamingState[tab] = {
      tokens,
      currentIndex: 0,
      currentText: ''
    };

    const streamNextToken = () => {
      const state = streamingState[tab];
      if (!state || state.currentIndex >= state.tokens.length) return;

      const token = state.tokens[state.currentIndex];
      state.currentText += token;
      state.currentIndex++;

      // 공백이 아닌 토큰일 때만 화면에 업데이트
      if (token.trim().length > 0) {
        onEvent({
          type: 'progress',
          tab: tab,
          content: state.currentText
        });
      }

      // 다음 토큰이 있으면 계속 스트리밍
      if (state.currentIndex < state.tokens.length) {
        const nextToken = state.tokens[state.currentIndex];
        const delay = nextToken.trim().length > 0 ? 150 : 50; // 단어는 150ms, 공백은 50ms
        state.timeoutId = window.setTimeout(streamNextToken, delay);
      }
    };

    // 스트리밍 시작
    streamNextToken();
  };

  // POST 요청을 먼저 보내고, 그 응답으로 SSE 연결을 시작
  const initSSEConnection = async () => {
    try {
      console.log('📡 POST 요청 전송 중...');
      
      const response = await fetch(`${cleanBaseUrl}/api/diagnoses/generate-stream`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('📨 응답 상태:', response.status, response.statusText);
      console.log('📨 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('응답 본문이 없습니다');
      }

      console.log('✅ 스트리밍 연결 성공');
      
      // ReadableStream을 EventSource처럼 처리
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const mockEventSource = {
        close: () => {
          console.log('🔚 SSE 연결 종료');
          reader.cancel();
          // 스트리밍 타이머 정리
          Object.values(streamingState).forEach(state => {
            if (state.timeoutId) {
              window.clearTimeout(state.timeoutId);
            }
          });
        },
        readyState: 1, // OPEN
        url: `${cleanBaseUrl}/api/diagnoses/generate-stream`,
        withCredentials: false,
        onopen: null, onmessage: null, onerror: null,
        addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
        CONNECTING: 0, OPEN: 1, CLOSED: 2
      } as unknown as EventSource;

      // ReadableStream 읽기 시작
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('🏁 스트리밍 완료');
              onEvent({
                type: 'complete',
                message: '스트리밍 완료'
              });
              onComplete?.();
              break;
            }

            // 청크를 텍스트로 변환
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // SSE 이벤트 파싱 (data: 라인 기준)
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 보관

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6); // 'data: ' 제거
                
                if (data.trim() === '[DONE]') {
                  console.log('🏁 스트리밍 완료 신호 수신');
                  onEvent({
                    type: 'complete',
                    message: '스트리밍 완료'
                  });
                  onComplete?.();
                  return;
                }

                try {
                  const eventData = JSON.parse(data) as StreamEvent;
                  console.log('📨 SSE 이벤트 수신:', eventData);
                  
                  // 기존 progress 타입 처리 (단어별 스트리밍)
                  if (eventData.type === 'progress' && eventData.tab && eventData.content) {
                    console.log(`🎯 [${eventData.tab}] 콘텐츠 수신 - 단어별 스트리밍 시작`);
                    startWordByWordStreaming(eventData.tab, eventData.content);
                  } 
                  // 완료 타입 처리
                  else if (eventData.type === 'complete' || eventData.type === 'done') {
                    console.log('🏁 서버 완료 신호');
                    // 모든 스트리밍 타이머 정리
                    Object.values(streamingState).forEach(state => {
                      if (state.timeoutId) {
                        window.clearTimeout(state.timeoutId);
                      }
                    });
                    onEvent(eventData);
                    onComplete?.();
                    return;
                  } 
                  // 에러 타입 처리
                  else if (eventData.type === 'error') {
                    console.error('❌ 서버 에러:', eventData.message);
                    onError?.(new Error(eventData.message || 'SSE 서버 에러'));
                    return;
                  }
                  // 모든 새로운 이벤트 타입들을 onEvent로 전달
                  else {
                    console.log('📤 이벤트 전달:', eventData.type);
                    onEvent(eventData);
                  }
                } catch (parseError) {
                  console.error('❌ SSE 데이터 파싱 오류:', parseError, 'Raw data:', data);
                }
              }
            }
          }
        } catch (streamError) {
          console.error('❌ 스트리밍 처리 오류:', streamError);
          onError?.(streamError instanceof Error ? streamError : new Error('스트리밍 처리 오류'));
        }
      };

      // 스트리밍 처리 시작
      processStream();
      
      return mockEventSource;

    } catch (fetchError) {
      console.error('❌ POST 요청 실패:', fetchError);
      
      // 에러 시 Fallback
      console.log('🔄 Fallback 모드로 전환...');
      setTimeout(() => {
        onEvent({
          type: 'progress',
          tab: 'summary',
          content: `${diseaseName}에 대한 분석을 진행했으나 서버 연결에 문제가 발생했습니다. 기본적인 의료 정보를 제공드립니다.`
        });
        
        setTimeout(() => {
          onEvent({
            type: 'complete',
            message: 'Fallback 모드 완료'
          });
          onComplete?.();
        }, 1500);
      }, 500);

      // 더미 EventSource 반환
      return {
        close: () => {},
        readyState: 2, // CLOSED
        url: `${cleanBaseUrl}/api/diagnoses/generate-stream`,
        withCredentials: false,
        onopen: null, onmessage: null, onerror: null,
        addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
        CONNECTING: 0, OPEN: 1, CLOSED: 2
      } as unknown as EventSource;
    }
  };

  // 비동기 초기화 시작하고 더미 EventSource 즉시 반환
  const dummyEventSource = {
    close: () => {},
    readyState: 0, // CONNECTING
    url: `${cleanBaseUrl}/api/diagnoses/generate-stream`,
    withCredentials: false,
    onopen: null, onmessage: null, onerror: null,
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
    CONNECTING: 0, OPEN: 1, CLOSED: 2
  } as unknown as EventSource;

  // 실제 연결 시작
  initSSEConnection().then((actualEventSource) => {
    if (actualEventSource) {
      // 실제 EventSource로 교체 (필요시)
      Object.assign(dummyEventSource, actualEventSource);
    }
  });

  return dummyEventSource;
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
/**
 * 진단 이미지 조회
 */
export const getDiagnosisImage = async (diagnosisId: number) => {
  try {
    const response = await apiClient.get(`/api/diagnoses/${diagnosisId}/image`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch diagnosis image for ${diagnosisId}:`, error);
    throw error;
  }
};

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
  getDiagnosisImage,

};

export default diagnosesApi; 