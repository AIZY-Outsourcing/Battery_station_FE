import { useQuery } from "@tanstack/react-query";
import { swapTransactionAPI } from "@/services/staff/transaction.service";
import type { TransactionFilters } from "@/types/staff/transaction.type";

export const useStaffTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ["staff-transactions", filters],
    queryFn: () => swapTransactionAPI.getStaffTransactions(filters),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useStaffStats = () => {
  return useQuery({
    queryKey: ["staff-stats"],
    queryFn: () => swapTransactionAPI.getStaffStats(),
    refetchInterval: 30000,
  });
};

export const useTransactionDetail = (id: string) => {
  return useQuery({
    queryKey: ["transaction-detail", id],
    queryFn: () => swapTransactionAPI.getTransactionDetail(id),
    enabled: !!id,
  });
};
