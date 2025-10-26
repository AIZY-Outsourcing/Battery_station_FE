import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StationsQueryParams } from '@/types/admin/station.type';

interface StationsState {
  queryParams: StationsQueryParams;
  searchTerm: string;
  setQueryParams: (params: Partial<StationsQueryParams>) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const defaultQueryParams: StationsQueryParams = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
};

export const useStationsStore = create<StationsState>()(
  persist(
    (set) => ({
      queryParams: defaultQueryParams,
      searchTerm: "",

      setQueryParams: (params) =>
        set((state) => ({
          queryParams: { ...state.queryParams, ...params },
        })),

      setSearchTerm: (term) =>
        set({ searchTerm: term }),

      resetFilters: () =>
        set({
          queryParams: defaultQueryParams,
          searchTerm: "",
        }),

      setPage: (page) =>
        set((state) => ({
          queryParams: { ...state.queryParams, page },
        })),

      setLimit: (limit) =>
        set((state) => ({
          queryParams: { ...state.queryParams, limit, page: 1 }, // Reset to page 1 when changing limit
        })),

      setSorting: (sortBy, sortOrder) =>
        set((state) => ({
          queryParams: { ...state.queryParams, sortBy, sortOrder, page: 1 }, // Reset to page 1 when changing sort
        })),
    }),
    {
      name: 'stations-store', // unique name for localStorage key
      partialize: (state) => ({
        queryParams: state.queryParams,
        // Don't persist searchTerm as it's usually temporary
      }),
    }
  )
);