export interface User {
  id: number;
  email: string;
  name?: string;
  // Add other user-related fields as needed
}

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

export interface UVIndexResponse {
    location: string;
    date: string;
    now: string;
}

export interface UVIndexApiResponse {
  status_code: number;
  message: string;
  data: UVIndexResponse;
}


export interface SignUpRequest {
  clerk_user_id: string;
  email: string;
  password?: string; // password는 선택 사항으로 변경
  name: string;
  gender: string;
  birth_date: string; // YYYY-MM-DD 형식의 문자열
}

// API 응답 타입
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

export interface SkinTypeScore {
  date: string;
  score: number;
}

export interface DiagnosisRecord {
  id: number;
  user_id: number;
  disease_name: string | null;
  skin_type_id: number | null;
  confidence: number;
  image: string;
  after: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface DashboardData {
  recent_skinType_scores: SkinTypeScore[];
  recent_diagnosis_records: DiagnosisRecord[];
}