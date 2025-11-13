import api from "@/lib/api";
import { DashboardOverview, StationStats, BatteryStats, UserStats, SwapStats, StationStatus, RecentActivity, SystemHealth } from "@/types/admin/dashboard.type";

export const dashboardService = {
  // Get full dashboard overview
  getOverview: async (timeRange?: string) => {
    const params = timeRange ? { timeRange } : {};
    const response = await api.get<{ data: DashboardOverview }>("/dashboard/overview", { params });
    return response.data.data;
  },

  // Get station statistics
  getStationStats: async () => {
    const response = await api.get<{ data: StationStats }>("/dashboard/stats/stations");
    return response.data.data;
  },

  // Get battery statistics
  getBatteryStats: async () => {
    const response = await api.get<{ data: BatteryStats }>("/dashboard/stats/batteries");
    return response.data.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get<{ data: UserStats }>("/dashboard/stats/users");
    return response.data.data;
  },

  // Get swap statistics
  getSwapStats: async (timeRange?: string) => {
    const params = timeRange ? { timeRange } : {};
    const response = await api.get<{ data: SwapStats }>("/dashboard/stats/swaps", { params });
    return response.data.data;
  },

  // Get station status
  getStationStatus: async (limit?: number) => {
    const params = limit ? { limit } : {};
    const response = await api.get<{ data: StationStatus[] }>("/dashboard/stations/status", { params });
    return response.data.data;
  },

  // Get recent activities
  getRecentActivities: async (limit?: number, activityType?: string) => {
    const params: Record<string, number | string> = {};
    if (limit) params.limit = limit;
    if (activityType) params.activityType = activityType;
    const response = await api.get<{ data: RecentActivity[] }>("/dashboard/activities/recent", { params });
    return response.data.data;
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get<{ data: SystemHealth }>("/dashboard/system/health");
    return response.data.data;
  },
};
