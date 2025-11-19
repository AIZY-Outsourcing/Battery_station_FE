import api from "@/lib/api";
import type {
  BatteryMovement,
  PaginatedBatteryMovements,
  CreateBatteryMovementRequest,
  UpdateBatteryMovementRequest,
  BatteryMovementFilters,
  ApiResponse,
  Battery,
} from "@/types/staff/battery-movement.type";

export const batteryMovementAPI = {
  /**
   * Create a new battery movement request (Admin/Staff)
   * Creates 1 parent request + 2 sub-requests
   */
  createMovement: async (
    data: CreateBatteryMovementRequest
  ): Promise<BatteryMovement> => {
    const response = await api.post<ApiResponse<BatteryMovement>>(
      "/battery-movements",
      data
    );
    return response.data.data;
  },

  /**
   * Get all battery movements with pagination and filters
   */
  getAllMovements: async (
    filters?: BatteryMovementFilters,
    station_id?: string
  ): Promise<PaginatedBatteryMovements> => {
    const response = await api.get<ApiResponse<PaginatedBatteryMovements>>(
      `/battery-movements/staff/${station_id || ""}`,
      { params: filters }
    );
    return response.data.data;
  },

  /**
   * Get battery movement by ID (with full relations)
   */
  getMovementById: async (id: string): Promise<BatteryMovement> => {
    const response = await api.get<ApiResponse<BatteryMovement>>(
      `/battery-movements/${id}`
    );
    return response.data.data;
  },

  /**
   * Staff confirms sub-request
   * Only for sub-requests assigned to staff's station
   */
  confirmSubRequest: async (subRequestId: string, station_id?: string): Promise<BatteryMovement> => {
    const response = await api.post<ApiResponse<BatteryMovement>>(
      `/battery-movements/${subRequestId}/confirm/${station_id || ""}`
    );
    return response.data.data;
  },

  /**
   * Admin accepts/executes approved movement
   * Swaps batteries between stations
   */
  executeMovement: async (parentRequestId: string): Promise<BatteryMovement> => {
    const response = await api.post<ApiResponse<BatteryMovement>>(
      `/battery-movements/${parentRequestId}/accept`
    );
    return response.data.data;
  },

  /**
   * Update battery movement (reason, status, etc.)
   */
  updateMovement: async (
    id: string,
    data: UpdateBatteryMovementRequest
  ): Promise<BatteryMovement> => {
    const response = await api.put<ApiResponse<BatteryMovement>>(
      `/battery-movements/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete battery movement
   */
  deleteMovement: async (id: string): Promise<void> => {
    await api.delete(`/battery-movements/${id}`);
  },

  /**
   * Get available batteries for a station (for movement planning)
   */
  getStationBatteries: async (
    stationId: string,
    filters?: { page?: number; limit?: number }
  ): Promise<{ data: Battery[]; total: number; page: number; limit: number; totalPages: number }> => {
    const response = await api.get<ApiResponse<{
      data: Battery[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>(`/battery-movements/stations/${stationId}/batteries`, {
      params: filters,
    });
    return response.data.data;
  },
};
