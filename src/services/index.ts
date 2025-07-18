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
  updateDiagnosisStatus,
} from './diagnosesApi';

import { createUser } from './usersApi';

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
  updateDiagnosisStatus,
  createUser,
};

// API 서비스들
export { default as skintypeApi } from './skintypeApi';
export { default as diseasesApi } from './diseasesApi';
export { default as diagnosesApi } from './diagnosesApi';
export { default as usersApi } from './usersApi';

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
    updateStatus: updateDiagnosisStatus,
  },
  users: {
    create: createUser,
  },
};

export default api; 