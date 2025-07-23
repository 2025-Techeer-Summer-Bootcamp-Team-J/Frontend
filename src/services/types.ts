// API 응답 기본 구조
export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

// User 관련 타입
export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface SignUpRequest {
  clerk_user_id: string;
  email: string;
  password?: string;
  name: string;
  gender: string;
  birth_date: string;
}

// Skintype 관련 타입 - API 스펙에 맞게 수정
export interface SkinType {
  skin_type_id: number;
  type_name: string;
  type_description: string;
  tip_title: string;
  tip_content: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface SkinTypeAnalysisRequest {
  image?: File;
  answers?: Record<string, unknown>;
}

export interface SkinTypeAnalysisResponse {
  status_code: number;
  message: string;
  data: {
    user_id: string; // Clerk user ID는 string 타입
    skin_type_code: number;
    skin_type_name: string;
  };
  additional_info?: {
    symptoms?: string[];
    itchLevel?: number;
    duration?: string;
    additionalInfo?: string;
  };
}

// Disease 관련 타입 - API 스펙에 맞게 수정
export interface Disease {
  disease_id: number;
  main_symptom: string;
  disease_name: string;
  description: string;
  precautions: string;
}

// Diagnoses 관련 타입 - API 스펙에 맞게 수정
export interface DiagnosisRequest {
  user_id: string; // Clerk user ID는 string 타입
  file?: File;
  symptoms?: string[];
  affected_areas?: string[];
  duration?: string;
  severity?: number;
  additional_info?: string;
}

// 비동기 진단 요청 응답
export interface AsyncDiagnosisResponse {
  code: number;
  message: string;
  task_id: string;
  status: string;
}


// Task 상태 조회 응답
export interface TaskStatusResponse {
  code: number;
  message: string;
  task_id: string;
  state: string;
  progress: {
    current: number;
    total: number;
    status: string;
  };
  result?: {
    code: number;
    message: string;
    data: DiagnosisRecord[];
  };
  error?: string;
}

// 진단 기록
export interface DiagnosisRecord {
  id: number;
  user_id: string; // Clerk user ID는 string 타입
  disease_name: string;
  confidence?: number;
  image?: string;
  created_at: string;
}

// 유저의 모든 진단 조회 응답
export interface UserDiagnosesResponse {
  code: number;
  message: string;
  data: DiagnosisRecord[];
}

// 진단 상세 정보
export interface DiagnosisDetail {
  diagnosis_id: number;
  user_id: string; // Clerk user ID는 string 타입
  image_base64: string;
  image_analysis: {
    disease_name: string;
    confidence: number;
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
  };
  text_analysis: {
    ai_opinion: string;
    detailed_description: string;
  };
  additional_info?: {
    symptoms?: string[];
    itchLevel?: number;
    duration?: string;
    additionalInfo?: string;
  };
}

// 진단 상세 정보 조회 응답
export interface DiagnosisDetailResponse {
  code: number;
  message: string;
  data: DiagnosisDetail;
}

// 진단 결과 저장 요청
export interface SaveDiagnosisRequest {
  user_id: string; // Clerk user ID는 string 타입
  image_base64: string;
  image_analysis: {
    disease_name: string;
    confidence: number;
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
  };
  text_analysis: {
    ai_opinion: string;
    detailed_description: string;
  };
  additional_info?: {
    symptoms?: string[];
    itchLevel?: number;
    duration?: string;
    additionalInfo?: string;
  };
}

// 진단 결과 저장 응답
export interface SaveDiagnosisResponse {
  diagnosis_id: number;
  message: string;
}


// SSE 스트림 이벤트 타입 - 백엔드 구조에 맞게 확장
export interface StreamEvent {
  type:
    // 공통 상태 타입
    | 'progress' | 'result' | 'complete' | 'tab_complete' | 'error' | 'done'
    // 질병명(모델1) 스트리밍 타입
    | 'disease_name_start' | 'disease_name_chunk' | 'disease_name_end'
    // 진단명(모델2) 스트리밍 타입 (백엔드 변경)
    | 'diagnosed_name_start' | 'diagnosed_name_chunk' | 'diagnosed_name_end'
    // AI 의견, 상세 설명, 주의사항, 관리방법 스트리밍 타입
    | 'ai_opinion_start' | 'ai_opinion_chunk' | 'ai_opinion_end'
    | 'detailed_description_start' | 'detailed_description_chunk' | 'detailed_description_end'
    | 'precautions_start' | 'precautions_chunk' | 'precautions_item_start' | 'precautions_item_end' | 'precautions_end'
    | 'management_start' | 'management_chunk' | 'management_item_start' | 'management_item_end' | 'management_end';
  message?: string;
  content?: string;
  data?: string; // 백엔드에서 사용하는 data 필드
  tab?: string;
  save_data?: {
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
    [key: string]: unknown; // 추가적인 데이터를 위해
  };
  additional_info?: {
    symptoms?: string[];
    itchLevel?: number;
    duration?: string;
    additionalInfo?: string;
  };
}

// Dashboard 관련 타입
export interface SkinTypeScore {
  date: string;
  score: number;
}

export interface MyProfile {
  skin_type_id: number;
  type_name: string;
  type_description: string;
  tip_title: string;
  tip_content: string;
}

export interface DashboardData {
  recent_skinType_scores: number[];
  recent_diagnosis_records: DiagnosisRecord[];
  my_skin_profile: MyProfile;
}

// Dashboard API 응답
export interface DashboardResponse {
  status_code: number;
  message: string;
  data: DashboardData;
}

// UV Index 관련 타입
export interface UVIndexData {
  location: string;
  date: string;
  now: string;
}

export interface UVIndexResponse {
  status_code: number;
  message: string;
  data: UVIndexData;
}

// 기존 호환성을 위한 별칭들 (deprecated)
export type UVIndexApiResponse = UVIndexResponse;
export type Diagnosis = DiagnosisRecord;

// 진단 보조 정보 관련 타입
export interface DiagnosisAdditionalInfo {
  diagnosis_id: number;
  main_symptoms: string[];
  itching_level: number;
  symptom_duration: string;
  additional_notes: string;
}

// 진단 보조 정보 생성 요청
export interface CreateDiagnosisAdditionalRequest {
  diagnosis_id: number;
  main_symptoms: string[];
  itching_level: number;
  symptom_duration: string;
  additional_notes: string;
}

// 진단 보조 정보 API 응답
export interface DiagnosisAdditionalResponse {
  status_code: number;
  message: string;
  data: DiagnosisAdditionalInfo;
}