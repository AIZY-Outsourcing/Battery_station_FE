import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BatteryType, BatteryTypesQueryParams } from '@/types/admin/battery-types.type';
import { CreateBatteryTypeRequest, UpdateBatteryTypeRequest } from '@/schemas/battery-types.schema';

interface BatteryTypesState {
  // Query params state
  queryParams: BatteryTypesQueryParams;
  
  // List page state
  searchTerm: string;
  selectedBatteryType: BatteryType | null;
  isLoading: boolean;
  error: string | null;
  
  // Form state
  formData: CreateBatteryTypeRequest | UpdateBatteryTypeRequest;
  formErrors: Partial<CreateBatteryTypeRequest | UpdateBatteryTypeRequest>;
  isSubmitting: boolean;
  
  // Query params actions
  setQueryParams: (params: Partial<BatteryTypesQueryParams>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  resetFilters: () => void;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedBatteryType: (batteryType: BatteryType | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Form actions
  setFormData: (data: Partial<CreateBatteryTypeRequest | UpdateBatteryTypeRequest>) => void;
  setFormErrors: (errors: Partial<CreateBatteryTypeRequest | UpdateBatteryTypeRequest>) => void;
  setSubmitting: (submitting: boolean) => void;
  clearForm: () => void;
  resetStore: () => void;
}

const initialFormData: CreateBatteryTypeRequest = {
  name: '',
  description: '',
};

const defaultQueryParams: BatteryTypesQueryParams = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
};

const useBatteryTypesStore = create<BatteryTypesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      queryParams: defaultQueryParams,
      searchTerm: '',
      selectedBatteryType: null,
      isLoading: false,
      error: null,
      
      formData: initialFormData,
      formErrors: {},
      isSubmitting: false,
      
      // Query params actions
      setQueryParams: (params: Partial<BatteryTypesQueryParams>) =>
        set((state) => ({
          queryParams: { ...state.queryParams, ...params },
        }), false, 'setQueryParams'),

      setPage: (page: number) =>
        set((state) => ({
          queryParams: { ...state.queryParams, page },
        }), false, 'setPage'),

      setLimit: (limit: number) =>
        set((state) => ({
          queryParams: { ...state.queryParams, limit, page: 1 }, // Reset to page 1 when changing limit
        }), false, 'setLimit'),

      setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') =>
        set((state) => ({
          queryParams: { ...state.queryParams, sortBy, sortOrder, page: 1 }, // Reset to page 1 when changing sort
        }), false, 'setSorting'),

      resetFilters: () =>
        set({
          queryParams: defaultQueryParams,
          searchTerm: '',
        }, false, 'resetFilters'),
      
      // Actions
      setSearchTerm: (term: string) => 
        set({ searchTerm: term }, false, 'setSearchTerm'),
        
      setSelectedBatteryType: (batteryType: BatteryType | null) =>
        set({ selectedBatteryType: batteryType }, false, 'setSelectedBatteryType'),
        
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }, false, 'setLoading'),
        
      setError: (error: string | null) =>
        set({ error }, false, 'setError'),
        
      // Form actions
      setFormData: (data: Partial<CreateBatteryTypeRequest | UpdateBatteryTypeRequest>) =>
        set(
          (state) => {
            const updatedErrors = { ...state.formErrors };
            // Clear related errors when data changes
            Object.keys(data).forEach(key => {
              delete updatedErrors[key as keyof typeof updatedErrors];
            });
            
            return {
              formData: { ...state.formData, ...data },
              formErrors: updatedErrors,
            };
          },
          false,
          'setFormData'
        ),
        
      setFormErrors: (errors: Partial<CreateBatteryTypeRequest | UpdateBatteryTypeRequest>) =>
        set({ formErrors: errors }, false, 'setFormErrors'),
        
      setSubmitting: (submitting: boolean) =>
        set({ isSubmitting: submitting }, false, 'setSubmitting'),
        
      clearForm: () =>
        set({
          formData: initialFormData,
          formErrors: {},
          isSubmitting: false,
        }, false, 'clearForm'),
        
      resetStore: () =>
        set({
          queryParams: defaultQueryParams,
          searchTerm: '',
          selectedBatteryType: null,
          isLoading: false,
          error: null,
          formData: initialFormData,
          formErrors: {},
          isSubmitting: false,
        }, false, 'resetStore'),
    }),
    {
      name: 'battery-types-store',
    }
  )
);

export default useBatteryTypesStore;