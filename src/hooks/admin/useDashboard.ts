import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/admin/dashboard.service";

export const useDashboardOverview = (timeRange?: string) => {
  return useQuery({
    queryKey: ["dashboard", "overview", timeRange],
    queryFn: () => dashboardService.getOverview(timeRange),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useStationStats = () => {
  return useQuery({
    queryKey: ["dashboard", "station-stats"],
    queryFn: () => dashboardService.getStationStats(),
    refetchInterval: 30000,
  });
};

export const useBatteryStats = () => {
  return useQuery({
    queryKey: ["dashboard", "battery-stats"],
    queryFn: () => dashboardService.getBatteryStats(),
    refetchInterval: 30000,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ["dashboard", "user-stats"],
    queryFn: () => dashboardService.getUserStats(),
    refetchInterval: 30000,
  });
};

export const useSwapStats = (timeRange?: string) => {
  return useQuery({
    queryKey: ["dashboard", "swap-stats", timeRange],
    queryFn: () => dashboardService.getSwapStats(timeRange),
    refetchInterval: 30000,
  });
};

export const useStationStatus = (limit?: number) => {
  return useQuery({
    queryKey: ["dashboard", "station-status", limit],
    queryFn: () => dashboardService.getStationStatus(limit),
    refetchInterval: 30000,
  });
};

export const useRecentActivities = (limit?: number, activityType?: string) => {
  return useQuery({
    queryKey: ["dashboard", "recent-activities", limit, activityType],
    queryFn: () => dashboardService.getRecentActivities(limit, activityType),
    refetchInterval: 15000, // Refetch every 15 seconds for more real-time feel
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ["dashboard", "system-health"],
    queryFn: () => dashboardService.getSystemHealth(),
    refetchInterval: 30000,
  });
};
