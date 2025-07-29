import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

// 개발 환경에서는 프록시 사용, 프로덕션에서는 실제 API URL 사용
// 기본 BASE_URL 설정
// 1) .env 에서 VITE_API_BASE_URL 이 설정되어 있으면 절대 URL 사용
// 2) 없으면 상대 경로("")를 사용해 모든 서비스 파일의 "/api" 프리픽스를 그대로 유지
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  // 기본 헤더는 특별히 지정하지 않고, 요청 인터셉터에서 동적으로 설정
  headers: {},
  timeout: 10000,
});

// 요청 인터셉터 – FormData 전송 시 content-type 자동 설정
apiClient.interceptors.request.use(
  (config) => {
    // FormData 인스턴스이면 content-type 헤더 제거해서 브라우저가 boundary 포함하도록 자동 설정
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    } else {
      // JSON 데이터일 때만 명시적으로 설정
      if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    // 필요시 인증 토큰 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // API 키를 자동으로 헤더에 추가
    const apiKey = import.meta.env.API_KEY;
    if (apiKey) {
      if (!config.headers) {
        // AxiosRequestHeaders 타입으로 캐스팅하여 타입 오류 방지
        config.headers = {} as AxiosRequestHeaders;
      }
      // Authorization 대신 X-API-KEY 사용
      (config.headers as Record<string, string>)['X-API-KEY'] = apiKey;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;