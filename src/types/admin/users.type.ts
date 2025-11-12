// Vehicle Model
export interface VehicleModel {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  battery_type_id: string;
}

// Battery Type
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

// Vehicle
export interface Vehicle {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  vin: string;
  plate_number: string;
  manufacturer_year: string;
  user_id: string;
  battery_type_id: string;
  vehicle_model_id: string;
  battery_type: BatteryType;
  vehicle_model: VehicleModel;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'staff' | 'admin';
  is_verified: boolean;
  is_2fa_enabled: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  vehicles: Vehicle[];
}

// Users API Parameters
export interface UsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Users List Response
export interface UsersListResponse {
  data: {
    [key: string]: User;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

// Single User Response
export interface UserDetailResponse {
  data: User;
  statusCode: number;
  message: string;
  timestamp: string;
}
