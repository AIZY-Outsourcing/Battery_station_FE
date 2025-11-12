import { create } from "zustand";
import { SubscriptionPackagesParams } from "@/types/admin/subscription-package.type";

interface SubscriptionPackagesState {
  queryParams: SubscriptionPackagesParams;
  searchTerm: string;
  setQueryParams: (params: Partial<SubscriptionPackagesParams>) => void;
  setSearchTerm: (searchTerm: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
}

const defaultParams: SubscriptionPackagesParams = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
};

const useSubscriptionPackagesStore = create<SubscriptionPackagesState>((set) => ({
  queryParams: defaultParams,
  searchTerm: "",

  setQueryParams: (params) =>
    set((state) => ({
      queryParams: { ...state.queryParams, ...params },
    })),

  setSearchTerm: (searchTerm) => set({ searchTerm }),

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
      queryParams: defaultParams,
      searchTerm: "",
    }),
}));

export default useSubscriptionPackagesStore;
