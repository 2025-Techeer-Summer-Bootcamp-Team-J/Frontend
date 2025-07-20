
import apiClient from './apiClient';
import type { User, SignUpRequest, ApiResponse, DashboardData, DashboardResponse } from './types';

export const createUser = async (userData: Partial<User>) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const signup = async (userData: SignUpRequest): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.post<ApiResponse<User>>('/api/users/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
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