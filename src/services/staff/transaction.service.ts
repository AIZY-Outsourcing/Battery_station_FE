import api from "@/lib/api";
import type {
  PaginatedTransactions,
  TransactionStats,
  SwapTransaction,
  TransactionFilters,
  ApiResponse,
} from "@/types/staff/transaction.type";

export const swapTransactionAPI = {
  // Get transactions for staff
  getStaffTransactions: async (
    filters?: TransactionFilters
  ): Promise<PaginatedTransactions> => {
    const response = await api.get<ApiResponse<PaginatedTransactions>>(
      `/swap-transactions/staff/${filters?.station_id || ""}`,
      {
        params: filters,
      }
    );
    return response.data.data;
  },

  // Get staff stats
  getStaffStats: async (station_id: string): Promise<TransactionStats> => {
    const response = await api.get<ApiResponse<TransactionStats>>(
      `/swap-transactions/staff/stats/${station_id}`
    );
    return response.data.data;
  },

  // Get transaction detail
  getTransactionDetail: async (id: string): Promise<SwapTransaction> => {
    const response = await api.get<ApiResponse<SwapTransaction>>(`/swap-transactions/${id}`);
    return response.data.data;
  },
};
