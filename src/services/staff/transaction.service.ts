import api from "@/lib/api";
import type {
  PaginatedTransactions,
  TransactionStats,
  SwapTransaction,
  TransactionFilters,
} from "@/types/staff/transaction.type";

export const swapTransactionAPI = {
  // Get transactions for staff
  getStaffTransactions: async (
    filters?: TransactionFilters
  ): Promise<PaginatedTransactions> => {
    const response = await api.get<PaginatedTransactions>(
      "/swap-transactions/staff",
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Get staff stats
  getStaffStats: async (): Promise<TransactionStats> => {
    const response = await api.get<TransactionStats>(
      "/swap-transactions/staff/stats"
    );
    return response.data;
  },

  // Get transaction detail
  getTransactionDetail: async (id: string): Promise<SwapTransaction> => {
    const response = await api.get<SwapTransaction>(`/swap-transactions/${id}`);
    return response.data;
  },
};
