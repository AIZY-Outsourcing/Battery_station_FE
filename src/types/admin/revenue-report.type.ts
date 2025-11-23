/**
 * Revenue Report Types
 * Based on /payments/revenue-report API
 */

export interface MonthlyRevenue {
  month: number; // 1-12
  revenue: number; // VND
  swap_count: number;
}

export interface DailyRevenue {
  date: string; // YYYY-MM-DD
  revenue: number; // VND
  transaction_count: number;
}

export interface StationRevenue {
  station_id: string;
  station_name: string;
  total_revenue: number; // VND
  swap_count: number;
  percentage: number; // % of total revenue
}

export interface RevenueReportResponse {
  // Overview Statistics
  total_revenue: number;
  total_single_purchase_swaps: number;
  subscription_revenue: number;
  total_batteries_swapped: number;

  // Growth Percentages (so với kỳ trước)
  revenue_growth_percentage: number;
  single_purchase_swaps_growth_percentage: number;
  batteries_growth_percentage: number;

  // Charts Data
  monthly_revenue: MonthlyRevenue[];
  daily_revenue: DailyRevenue[];
  station_revenue: StationRevenue[];

  // Date Range
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
}

export interface RevenueReportParams {
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}
