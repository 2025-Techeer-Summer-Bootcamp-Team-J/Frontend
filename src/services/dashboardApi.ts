import apiClient from "./apiClient";

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
  recent_skinType_scores: string[]; // 실제 타입에 따라 더 구체화 필요
  recent_diagnosis_records: DiagnosisRecord[];
  // 백엔드 응답에 없는 필드들은 일단 제거하거나 optional로 처리합니다.
  // chartLabels?: string[];
  // chartData?: number[];
  // profile?: {
  //   skinType?: string;
  //   concerns?: string[];
  //   tips?: string[];
  // };
  // knowledge?: {
  //   type: 'info' | 'warning';
  //   title: string;
  //   text: string;
  // }[];
}

export interface ApiResponse {
  status_code: number;
  message: string;
  data: DashboardData;
}

class DashboardService {
  getDashboard(userId: number) {
    return apiClient.get<ApiResponse>(`/api/users/${userId}/dashboard`);
  }
}

export default new DashboardService();