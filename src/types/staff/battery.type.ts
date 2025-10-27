export interface Battery {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  serial_number: string;
  capacity_kwh: string;
  soh: string; // State of Health percentage
  status: "available" | "charging" | "maintenance" | "damaged" | "in-use";
  station_kiosk_slot: string; // VD: "A1", "B1", "C1"
  station_id: string;
  battery_type_id: string;
}

export interface BatteriesListResponse {
  data: {
    data: Battery[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface BatteriesQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Update Battery Status Request
export interface UpdateBatteryStatusRequest {
  status: "available" | "charging" | "maintenance" | "damaged" | "in-use";
  note?: string;
}

// API Response
export interface BatteryUpdateResponse {
  data: Battery;
  statusCode: number;
  message: string;
  timestamp: string;
}

