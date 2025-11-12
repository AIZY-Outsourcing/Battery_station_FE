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
  soh: string; // State of Health
  status: 'available' | 'charging' | 'maintenance' | 'damaged' | 'in_use';
  station_kiosk_slot: number | null;
  station_id: string | null;
  battery_type_id: string;
}

export interface BatteriesApiResponse {
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

export interface BatteriesApiParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  stationId?: string;
}

export interface SwapResponse {
  swap_order_id: string;
  next_action: string;
  empty_slot_for_old_battery: number;
  new_battery: {
    battery_id: string;
    serial_number: string;
    slot_number: number;
    soh: string;
    capacity_kwh: string;
  };
}

export interface StartSwapApiResponse {
  data: SwapResponse | null;
  statusCode: number;
  message: string;
  timestamp: string;
  error?: string;
  path?: string;
}

export interface ConfirmSwapResponse {
  swap_order_id: string;
  swap_status: string;
  transaction_status: string;
  step: number;
  total_steps: number;
  battery_id: string;
  next_action: string;
}

export interface ConfirmSwapApiResponse {
  data: ConfirmSwapResponse;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface CancelSwapResponse {
  swap_order_id: string;
  swap_status: string;
  transaction_status: string;
}

export interface CancelSwapApiResponse {
  data: CancelSwapResponse;
  statusCode: number;
  message: string;
  timestamp: string;
}
