// Individual battery type interface
export interface BatteryType {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  description: string;
}

// Battery types list response (new format with pagination)
export interface BatteryTypesListResponse {
  data: {
    data: BatteryType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

// Query parameters for battery types API
export interface BatteryTypesQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Single battery type response
export interface BatteryTypeDetailResponse {
  data: BatteryType;
  statusCode: number;
  message: string;
  timestamp: string;
}

// Create battery type payload
export interface CreateBatteryTypeRequest {
  name: string;
  description: string;
}

// Update battery type payload
export interface UpdateBatteryTypeRequest {
  name?: string;
  description?: string;
}

// Battery type form data (for forms)
export interface BatteryTypeFormData {
  name: string;
  description: string;
}