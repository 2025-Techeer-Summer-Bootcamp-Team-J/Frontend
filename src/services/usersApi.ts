
import apiClient from './apiClient';
import type { User, SignUpRequest, ApiResponse, DashboardData, DashboardResponse } from './types';

// 사용자 생성 에러 타입 정의
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

/**
 * 사용자 생성
 */
export const createUser = async (userData: Partial<User>) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error creating user:', apiError);
    
    // 구체적인 에러 메시지 생성
    const errorMessage = apiError.response?.data?.message || 
                        apiError.response?.data?.error || 
                        '사용자 생성에 실패했습니다.';
    
    throw new Error(errorMessage);
  }
};

/**
 * 회원가입 (Clerk 연동용)
 */
export const signup = async (userData: SignUpRequest): Promise<ApiResponse<User>> => {
  try {
    console.log('Signing up user with data:', { 
      ...userData, 
      clerk_user_id: userData.clerk_user_id.substring(0, 10) + '...' 
    });
    
    const response = await apiClient.post<ApiResponse<User>>('/api/users/signup', userData);
    console.log('Signup successful:', response.data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error signing up:', apiError);
    
    // HTTP 상태 코드별 에러 메시지
    let errorMessage = '회원가입에 실패했습니다.';
    
    if (apiError.response?.status === 409) {
      errorMessage = '이미 등록된 사용자입니다.';
    } else if (apiError.response?.status === 400) {
      errorMessage = apiError.response.data?.message || '입력 데이터가 올바르지 않습니다.';
    } else if (apiError.response?.status === 500) {
      errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (apiError.response?.status === 404) {
      errorMessage = 'API 엔드포인트를 찾을 수 없습니다.';
    } else if (!apiError.response) {
      errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
    } else {
      errorMessage = apiError.response.data?.message || 
                    apiError.response.data?.error || 
                    errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * 유저 대시보드 조회
 */
export const getUserDashboard = async (userId: number): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardResponse>(`/api/users/${userId}/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch dashboard for user ${userId}:`, error);
    throw error;
  }
};

/**
 * 사용자 정보 조회
 */
export const getUserById = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(`/api/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};

/**
 * 사용자 정보 수정
 */
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update user ${userId}:`, error);
    throw error;
  }
};

// 편의 함수들
export const usersApi = {
  create: createUser,
  signup: signup,
  getDashboard: getUserDashboard,
  getById: getUserById,
  update: updateUser,
};

export default usersApi;