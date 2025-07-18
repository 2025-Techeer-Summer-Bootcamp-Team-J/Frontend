
import apiClient from './apiClient';
import type { User, SignUpRequest, ApiResponse } from './types';

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

export default {
  createUser,
  signup,
};