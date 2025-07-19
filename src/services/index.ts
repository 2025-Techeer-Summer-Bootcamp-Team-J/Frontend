// API 클라이언트
export { default as apiClient } from './apiClient';

// 타입 정의
export * from './types';

// 개별 함수들 import 및 export
import {
  getAllSkinTypes,
  getSkinTypeById,
  analyzeSkinType,
} from './skintypeApi';

import {
  getAllDiseases,
  getDiseaseById,
  searchDiseases,
  getDiseasesByCategory,
} from './diseasesApi';

import {
  createDiagnosis,
  getUserDiagnoses,
  getDiagnosisById,
  deleteDiagnosis,
  generateDiagnosisStream,
  saveDiagnosisResult,
  createDiagnosisAdditionalInfo,
  getDiagnosisAdditionalInfo,
} from './diagnosesApi';

import { createUser, signup } from './usersApi';
import { getUVIndex } from './uv_indexApi';
import dashboardApi from './dashboardApi';

// 개별 함수들 re-export
export {
  getAllSkinTypes,
  getSkinTypeById,
  analyzeSkinType,
  getAllDiseases,
  getDiseaseById,
  searchDiseases,
  getDiseasesByCategory,
  createDiagnosis,
  getUserDiagnoses,
  getDiagnosisById,
  deleteDiagnosis,
  generateDiagnosisStream,
  saveDiagnosisResult,
  createDiagnosisAdditionalInfo,
  getDiagnosisAdditionalInfo,
  createUser,
  signup,
  getUVIndex,
};

// API 서비스들
export { default as skintypeApi } from './skintypeApi';
export { default as diseasesApi } from './diseasesApi';
export { default as diagnosesApi } from './diagnosesApi';
export { default as usersApi } from './usersApi';
export { default as dashboardApi } from './dashboardApi';
export { default as uvIndexApi } from './uv_indexApi';

// 통합 API 객체
export const api = {
  skintype: {
    getAll: getAllSkinTypes,
    getById: getSkinTypeById,
    analyze: analyzeSkinType,
  },
  diseases: {
    getAll: getAllDiseases,
    getById: getDiseaseById,
    search: searchDiseases,
    getByCategory: getDiseasesByCategory,
  },
  diagnoses: {
    create: createDiagnosis,
    getByUserId: getUserDiagnoses,
    getById: getDiagnosisById,
    delete: deleteDiagnosis,
    generateStream: generateDiagnosisStream,
    saveResult: saveDiagnosisResult,
    createAdditionalInfo: createDiagnosisAdditionalInfo,
    getAdditionalInfo: getDiagnosisAdditionalInfo,
  },
  dashboard: {
    getDashboard: dashboardApi.getDashboard,
  },
  users: {
    create: createUser,
    signup: signup,
  },
  uvIndex: {
    get: getUVIndex,
  },
};

export default api;