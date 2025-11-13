import {
  getPaymentTransactions,
  getPaymentTransactionById,
  createPaymentTransaction,
  updatePaymentTransaction,
  deletePaymentTransaction,
} from "@/services/admin/payment-transaction.service";
import {
  PaymentTransactionsListResponse,
  PaymentTransactionsParams,
  PaymentTransactionDetailResponse,
  CreatePaymentTransactionRequest,
  UpdatePaymentTransactionRequest,
} from "@/types/admin/payment-transaction.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetPaymentTransactions = (params: PaymentTransactionsParams) => {
  return useQuery<PaymentTransactionsListResponse>({
    queryKey: ["payment-transactions", params],
    queryFn: () => getPaymentTransactions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetPaymentTransaction = (id: string) => {
  return useQuery<PaymentTransactionDetailResponse>({
    queryKey: ["payment-transaction", id],
    queryFn: () => getPaymentTransactionById(id),
    enabled: !!id,
  });
};

export const useCreatePaymentTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<
    PaymentTransactionDetailResponse,
    unknown,
    CreatePaymentTransactionRequest
  >({
    mutationFn: createPaymentTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
    },
  });
};

export const useUpdatePaymentTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<
    PaymentTransactionDetailResponse,
    unknown,
    { id: string; data: UpdatePaymentTransactionRequest }
  >({
    mutationFn: ({ id, data }) => updatePaymentTransaction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
      queryClient.invalidateQueries({
        queryKey: ["payment-transaction", variables.id],
      });
    },
  });
};

export const useDeletePaymentTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<PaymentTransactionDetailResponse, unknown, string>({
    mutationFn: (id) => deletePaymentTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
    },
  });
};
