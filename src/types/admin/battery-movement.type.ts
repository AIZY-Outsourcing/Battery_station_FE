import { Station } from './station.type';
import { Batteries as Battery } from './batteries.type';

export interface BatteryMovementItem {
  id: string;
  battery_movement_id: string;
  battery_id: string;
  is_from_source: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  battery: Battery;
}

export interface BatteryMovement {
  id: string;
  from_station_id: string;
  to_station_id: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  from_station: Station;
  to_station: Station;
  items: BatteryMovementItem[];
}

export interface BatteryMovementsListResponse {
  data: {
    data: BatteryMovement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface BatteryMovementDetailResponse {
  data: BatteryMovement;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface BatteryMovementsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateBatteryMovementRequest {
  from_station_id: string;
  to_station_id: string;
  reason?: string;
  from_batteries: string[];
  to_batteries?: string[];
}

export interface UpdateBatteryMovementRequest {
  from_station_id?: string;
  to_station_id?: string;
  reason?: string;
}

export interface StationBatteriesResponse {
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

