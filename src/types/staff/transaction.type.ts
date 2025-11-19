// Transaction Status
export enum TransactionStatus {
  REQUESTED = "requested",
  CONFIRMED = "confirmed",
  OPEN_EMPTY_SLOT = "open_empty_slot",
  OLD_BATTERY_IN = "old_battery_in",
  CLOSE_EMPTY_SLOT = "close_empty_slot",
  OPEN_REQUIRE_SLOT = "open_require_slot",
  NEW_BATTERY_OUT = "new_battery_out",
  CLOSE_REQUIRE_SLOT = "close_require_slot",
  COMPLETED = "completed",
  FAILED = "failed",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

// Battery Type
export interface BatteryType {
  id: string;
  name: string;
  capacity_kwh: number;
  voltage: number;
}

// Battery
export interface Battery {
  id: string;
  name: string;
  serial_number: string;
  capacity_kwh: number;
  soh: number;
  status: string;
  battery_type?: BatteryType;
}

// Station
export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  status: string;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_verified?: boolean;
}

// Swap Order
export interface SwapOrder {
  id: string;
  station_id: string;
  old_battery_id?: string;
  new_battery_id?: string;
  user_id: string;
  status: string;
  completed_at?: string;
  station?: Station;
  user?: User;
  old_battery?: Battery;
  new_battery?: Battery;
}

// Swap Transaction
export interface SwapTransaction {
  id: string;
  swap_order_id: string;
  status: TransactionStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  swap_order?: SwapOrder;
}

// Paginated Response
export interface PaginatedTransactions {
  data: SwapTransaction[];
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

// Transaction Stats
export interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  cancelled: number;
  inProgress: number;
}

// Filter Parameters
export interface TransactionFilters {
  status?: TransactionStatus | string;
  station_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  limit?: number;
}
