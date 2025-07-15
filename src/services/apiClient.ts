import axios from 'axios';

// 개발 환경에서는 프록시 사용, 프로덕션에서는 실제 API URL 사용
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? '/api' : 'http://localhost');

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 필요시 인증 토큰 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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