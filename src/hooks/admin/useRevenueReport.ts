/**
 * Revenue Report Hooks
 * React Query hooks for revenue report API
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { revenueReportService } from "@/services/admin/revenue-report.service";
import {
  RevenueReportResponse,
  RevenueReportParams,
} from "@/types/admin/revenue-report.type";

/**
 * Hook to fetch revenue report
 * Auto-refetch every 5 minutes (for live dashboard updates)
 */
export const useRevenueReport = (
  params?: RevenueReportParams
): UseQueryResult<RevenueReportResponse, Error> => {
  return useQuery<RevenueReportResponse, Error>({
    queryKey: ["revenueReport", params],
    queryFn: async () => {
      const response = await revenueReportService.getRevenueReport(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch revenue report");
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
};
