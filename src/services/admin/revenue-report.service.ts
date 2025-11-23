/**
 * Revenue Report Service
 * API endpoints for revenue reports
 */

import api from "@/lib/api";
import {
  RevenueReportResponse,
  RevenueReportParams,
  ApiResponse,
} from "@/types/admin/revenue-report.type";

export const revenueReportService = {
  /**
   * Get revenue report with optional date range filter
   * @param params - Optional date range (date_from, date_to)
   * @returns Revenue report data
   */
  async getRevenueReport(
    params?: RevenueReportParams
  ): Promise<ApiResponse<RevenueReportResponse>> {
    try {
      const response = await api.get<{
        data: RevenueReportResponse;
        statusCode: number;
        message: string;
        timestamp: string;
      }>("/payments/revenue-report", {
        params,
      });

      return {
        success: true,
        data: response.data.data, // Extract nested data
      };
    } catch (error: any) {
      console.error("Get revenue report error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status,
      };
    }
  },
};
