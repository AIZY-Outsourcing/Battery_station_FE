import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Batteries, BatteriesParams } from '@/types/admin/batteries.type';
import { CreateBatteryRequest, UpdateBatteryRequest } from '@/schemas/batteries.schema';

interface BatteriesState {
  // Query params state
  queryParams: BatteriesParams;
  
  // List page state
  searchTerm: string;
  selectedBattery: Batteries | null;
  isLoading: boolean;
  error: string | null;
  
  // Form state
  formData: CreateBatteryRequest | UpdateBatteryRequest;
  formErrors: Partial<CreateBatteryRequest | UpdateBatteryRequest>;
  isSubmitting: boolean;
  
  // Query params actions
  setQueryParams: (params: Partial<BatteriesParams>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  resetFilters: () => void;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedBattery: (battery: Batteries | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Form actions
  setFormData: (data: Partial<CreateBatteryRequest | UpdateBatteryRequest>) => void;
  setFormErrors: (errors: Partial<CreateBatteryRequest | UpdateBatteryRequest>) => void;
  setSubmitting: (submitting: boolean) => void;
  clearForm: () => void;
  resetStore: () => void;
}

const initialFormData: CreateBatteryRequest = {
  name: '',
  serial_number: '',
  capacity_kwh: 0,
  soh: 0,
  battery_type_id: '',
  station_id: '',
  station_kiosk_slot: '',
};

const defaultQueryParams: BatteriesParams = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
};

const useBatteriesStore = create<BatteriesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      queryParams: defaultQueryParams,
      searchTerm: '',
      selectedBattery: null,
      isLoading: false,
      error: null,
      
      formData: initialFormData,
      formErrors: {},
      isSubmitting: false,
      
      // Query params actions
      setQueryParams: (params: Partial<BatteriesParams>) =>
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
        
      setSelectedBattery: (battery: Batteries | null) =>
        set({ selectedBattery: battery }, false, 'setSelectedBattery'),
        
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }, false, 'setLoading'),
        
      setError: (error: string | null) =>
        set({ error }, false, 'setError'),
        
      // Form actions
      setFormData: (data: Partial<CreateBatteryRequest | UpdateBatteryRequest>) =>
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
        
      setFormErrors: (errors: Partial<CreateBatteryRequest | UpdateBatteryRequest>) =>
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
          selectedBattery: null,
          isLoading: false,
          error: null,
          formData: initialFormData,
          formErrors: {},
          isSubmitting: false,
        }, false, 'resetStore'),
    }),
    {
      name: 'batteries-store',
    }
  )
);

export default useBatteriesStore;