import api from "@/lib/api";
import {
  PaymentTransactionsParams,
  PaymentTransactionsListResponse,
  CreatePaymentTransactionRequest,
  UpdatePaymentTransactionRequest,
} from "@/types/admin/payment-transaction.type";

export const getPaymentTransactions = async (
  params: PaymentTransactionsParams
): Promise<PaymentTransactionsListResponse> => {
  const res = await api.get("/payments", { params });
  return res.data;
};

export const getPaymentTransactionById = async (id: string) => {
  const res = await api.get(`/payments/${id}`);
  return res.data;
};

export const createPaymentTransaction = async (
  data: CreatePaymentTransactionRequest
) => {
  const res = await api.post("/payments", data);
  return res.data;
};

export const updatePaymentTransaction = async (
  id: string,
  data: UpdatePaymentTransactionRequest
) => {
  const res = await api.put(`/payments/${id}`, data);
  return res.data;
};

export const deletePaymentTransaction = async (id: string) => {
  const res = await api.delete(`/payments/${id}`);
  return res.data;
};
