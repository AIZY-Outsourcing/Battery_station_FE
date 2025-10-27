import { Staff } from './staff.type';

// Station status enum

// Individual station interface
export interface Station {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  image_url: string | null;
  address: string;
  city: string;
  lat: string; // Consider using number if API returns numeric values
  lng: string; // Consider using number if API returns numeric values
  staff_id: string | null;
  status: string;
  staff: Staff | null;
}


// Stations list with pagination info (matching new API response)
export interface StationsListResponse {
  data: {
    data: Station[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

// Query parameters for stations API
export interface StationsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Single station response
export interface StationDetailResponse {
  data: Station;
  statusCode: number;
  message: string;
  timestamp: string;
}

