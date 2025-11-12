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

export interface VehiclesApiResponse {
  data: {
    data: Vehicle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface VehiclesApiParams {
  page?: number;
  limit?: number;
  sortBy?: string;
}
