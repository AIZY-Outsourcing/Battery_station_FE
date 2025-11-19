// Battery Movement Status
export enum BatteryMovementStatus {
  PENDING = "pending",
  PENDING_CONFIRMATION = "pending_confirmation",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

// Station
export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: string;
  lng?: string;
  status: string;
  staff_id?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Battery Type
export interface BatteryType {
  id: string;
  name: string;
  capacity_kwh: string;
  voltage: string;
  weight?: string;
  dimensions?: string;
  max_charge_rate?: string;
  max_discharge_rate?: string;
  created_at?: string;
  updated_at?: string;
}

// Battery
export interface Battery {
  id: string;
  name: string;
  serial_number: string;
  capacity_kwh: string;
  soh: string;
  status: string;
  station_id: string | null;
  station_kiosk_slot?: number | null;
  battery_type_id: string;
  battery_type?: BatteryType;
  created_at?: string;
  updated_at?: string;
}

// Battery Movement Item
export interface BatteryMovementItem {
  id: string;
  battery_movement_id: string;
  battery_id: string;
  is_from_source: boolean;
  battery: Battery;
  created_at?: string;
}

// Battery Movement (Parent & Sub-request)
export interface BatteryMovement {
  id: string;
  from_station_id: string;
  to_station_id: string;
  reason: string;
  status: BatteryMovementStatus;
  parent_request_id: string | null;
  source_confirmed: boolean;
  destination_confirmed: boolean;
  
  // Relations
  from_station: Station;
  to_station: Station;
  items: BatteryMovementItem[];
  sub_requests?: BatteryMovement[];
  parent_request?: BatteryMovement;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  created_by?: string;
  updated_by?: string;
}

// Paginated Response
export interface PaginatedBatteryMovements {
  data: BatteryMovement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create Movement Request
export interface CreateBatteryMovementRequest {
  from_station_id: string;
  to_station_id: string;
  reason: string;
  from_batteries: string[]; // Array of battery IDs
  to_batteries?: string[]; // Optional for swap
}

// Update Movement Request
export interface UpdateBatteryMovementRequest {
  reason?: string;
  status?: BatteryMovementStatus;
  source_confirmed?: boolean;
  destination_confirmed?: boolean;
}

// Query Filters
export interface BatteryMovementFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  status?: BatteryMovementStatus;
  from_station_id?: string;
  to_station_id?: string;
}
