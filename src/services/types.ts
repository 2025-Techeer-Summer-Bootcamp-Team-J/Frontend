// Skintype 관련 타입
export interface SkinType {
  id: number;
  name: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
}

export interface SkinTypeAnalysisRequest {
  image?: File;
  answers?: Record<string, unknown>;
}

// 실제 API 응답에 맞는 타입으로 수정
export interface SkinTypeAnalysisResponse {
  status_code: number;
  message: string;
  data: {
    user_id: number;
    skin_type_code: number;
    skin_type_name: string;
  };
}

// Disease 관련 타입
export interface Disease {
  id: number;
  name: string;
  description: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  treatment_options: string[];
  prevention_tips: string[];
}

// Diagnosis 관련 타입
export interface DiagnosisRequest {
  user_id: number;
  symptoms: string[];
  affected_areas: string[];
  duration: string;
  severity: number;
  images?: File[];
  additional_info?: string;
}

export interface Diagnosis {
  id: number;
  user_id: number;
  created_at: string;
  symptoms: string[];
  affected_areas: string[];
  duration: string;
  severity: number;
  diagnosis_result: {
    primary_diagnosis: Disease;
    confidence: number;
    alternative_diagnoses?: Disease[];
    recommendations: string[];
    severity_assessment: string;
  };
  status: 'pending' | 'completed' | 'reviewed';
}

// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
} 