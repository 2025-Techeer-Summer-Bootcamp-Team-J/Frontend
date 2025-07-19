import apiClient from "./apiClient";
import type { DashboardResponse, DashboardData } from "./types";

class DashboardService {
  async getDashboard(userId: number): Promise<DashboardData> {
    try {
      const response = await apiClient.get<DashboardResponse>(`/api/users/${userId}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch dashboard for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new DashboardService();