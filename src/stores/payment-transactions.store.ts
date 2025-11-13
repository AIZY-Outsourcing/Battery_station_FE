import { create } from "zustand";
import { PaymentTransactionsParams } from "@/types/admin/payment-transaction.type";

interface PaymentTransactionsStore {
  queryParams: PaymentTransactionsParams;
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
}

const initialQueryParams: PaymentTransactionsParams = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
};

const usePaymentTransactionsStore = create<PaymentTransactionsStore>(
  (set) => ({
    queryParams: initialQueryParams,
    searchTerm: "",
    statusFilter: "all",
    setSearchTerm: (term) =>
      set((state) => ({
        searchTerm: term,
        queryParams: {
          ...state.queryParams,
          search: term || undefined,
          page: 1,
        },
      })),
    setStatusFilter: (status) =>
      set((state) => ({
        statusFilter: status,
        queryParams: {
          ...state.queryParams,
          status: status && status !== "all" ? status : undefined,
          page: 1,
        },
      })),
    setPage: (page) =>
      set((state) => ({
        queryParams: { ...state.queryParams, page },
      })),
    setLimit: (limit) =>
      set((state) => ({
        queryParams: { ...state.queryParams, limit, page: 1 },
      })),
    setSorting: (sortBy, sortOrder) =>
      set((state) => ({
        queryParams: { ...state.queryParams, sortBy, sortOrder },
      })),
    resetFilters: () =>
      set({
        queryParams: initialQueryParams,
        searchTerm: "",
        statusFilter: "all",
      }),
  })
);

export default usePaymentTransactionsStore;
