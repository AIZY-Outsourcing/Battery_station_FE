import { Station } from "@/types/station.type";
import {
  Battery,
  BatteriesApiResponse,
  BatteriesApiParams,
  StartSwapApiResponse,
  ConfirmSwapApiResponse,
  CancelSwapApiResponse,
} from "@/types/battery.type";
import {
  Vehicle,
  VehiclesApiResponse,
  VehiclesApiParams,
} from "@/types/vehicle.type";

export interface StationsApiResponse {
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

export interface QRSessionResponse {
  data: {
    success: boolean;
    data: {
      qr_data: string;
      expires_at: string;
      session_id: string;
    };
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface StationsApiParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  status?: string;
}

export interface SessionStatusResponse {
  data: {
    success: boolean;
    data: {
      status: string;
      session_token: string;
    };
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface CreateQRSessionParams {
  station_id: string;
}

class StationsApiService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  private apiKey =
    process.env.NEXT_PUBLIC_STATION_API_KEY ||
    "24c28bb1-6a4f-4425-8d3f-77542b13c1de";

  private async makeRequest<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);

      // Add query parameters
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-station-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error calling API ${endpoint}:`, error);
      throw error;
    }
  }

  async getStations(
    params: StationsApiParams = {}
  ): Promise<{
    success: boolean;
    data: { stations: Station[]; pagination: any };
    error?: string;
  }> {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "created_at",
      ...params,
    };

    try {
      const response = await this.makeRequest<StationsApiResponse>(
        "/stations/station-kiosks",
        defaultParams
      );

      return {
        success: true,
        data: {
          stations: response.data.data,
          pagination: {
            page: response.data.page,
            limit: response.data.limit,
            total: response.data.total,
            totalPages: response.data.totalPages,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          stations: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        },
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getStationById(
    stationId: string
  ): Promise<{ success: boolean; data?: Station; error?: string }> {
    try {
      const response = await this.makeRequest<{
        data: Station;
        statusCode: number;
        message: string;
        timestamp: string;
      }>(`/stations/station-kiosks/${stationId}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Helper method to get all stations (for cases where we need all data)
  async getAllStations(): Promise<Station[]> {
    try {
      const response = await this.getStations({ limit: 1000 }); // Get all stations
      return response.success ? response.data.stations : [];
    } catch (error) {
      console.error("Error getting all stations:", error);
      return [];
    }
  }

  // Create QR session for station
  async createQRSession(
    params: CreateQRSessionParams
  ): Promise<{
    success: boolean;
    data?: { qr_data: string; expires_at: string; session_id: string };
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/station-sessions/qr/create`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "x-station-api-key": this.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QRSessionResponse = await response.json();

      return {
        success: true,
        data: data.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Check session status
  async checkSessionStatus(
    sessionId: string
  ): Promise<{
    success: boolean;
    data?: { status: string; session_token: string };
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/station-sessions/status/${sessionId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-station-api-key": this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SessionStatusResponse = await response.json();

      return {
        success: true,
        data: data.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get batteries for a specific station
  async getStationBatteries(
    stationId: string,
    params: BatteriesApiParams = {}
  ): Promise<{
    success: boolean;
    data?: { batteries: Battery[]; pagination: any };
    error?: string;
  }> {
    const defaultParams = {
      page: 1,
      limit: 100, // Get all batteries for the station
      sortBy: "created_at",
      stationId: stationId,
      ...params,
    };

    try {
      const response = await this.makeRequest<BatteriesApiResponse>(
        `/batteries/kiosk/${stationId}`,
        defaultParams
      );

      return {
        success: true,
        data: {
          batteries: response.data.data,
          pagination: {
            page: response.data.page,
            limit: response.data.limit,
            total: response.data.total,
            totalPages: response.data.totalPages,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get free batteries (not assigned to any station)
  async getFreeBatteries(
    vehicleId: string,
    params: BatteriesApiParams = {}
  ): Promise<{
    success: boolean;
    data?: { batteries: Battery[]; pagination: any };
    error?: string;
  }> {
    const defaultParams = {
      page: 1,
      limit: 100, // Get all free batteries
      sortBy: "created_at",
      ...params,
    };

    try {
      const response = await this.makeRequest<BatteriesApiResponse>(
        `/batteries/free/${vehicleId}`,
        defaultParams
      );

      return {
        success: true,
        data: {
          batteries: response.data.data,
          pagination: {
            page: response.data.page,
            limit: response.data.limit,
            total: response.data.total,
            totalPages: response.data.totalPages,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async startSwap(
    sessionToken: string,
    vehicleId: string
  ): Promise<StartSwapApiResponse> {
    const response = await fetch(`${this.baseUrl}/kiosk/start-swap`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-session-token": sessionToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicleId: vehicleId,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Return error response with proper structure
      return {
        statusCode: data.statusCode || response.status,
        message: data.message || "An error occurred",
        error: data.error || "Internal Server Error",
        timestamp: data.timestamp || new Date().toISOString(),
        path: data.path || "/api/v1/kiosk/start-swap",
        data: null as any,
      };
    }

    return data;
  }

  async confirmSwap(
    sessionToken: string,
    batteryId: string,
    vehicleId: string
  ): Promise<ConfirmSwapApiResponse> {
    const response = await fetch(
      `${this.baseUrl}/kiosk/confirm-swap/${batteryId}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-session-token": sessionToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicleId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async cancelSwap(
    sessionToken: string,
    swapOrderId: string,
    reason: string
  ): Promise<CancelSwapApiResponse> {
    const response = await fetch(`${this.baseUrl}/kiosk/cancel-swap`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "x-session-token": sessionToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        swap_order_id: swapOrderId,
        reason: reason,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUserVehicles(
    sessionToken: string,
    params: VehiclesApiParams = {}
  ): Promise<{
    success: boolean;
    data?: Vehicle[];
    pagination?: any;
    error?: string;
  }> {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "created_at",
      ...params,
    };

    try {
      const url = new URL(`${this.baseUrl}/vehicles/kiosk/me`);

      // Add query parameters
      Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-session-token": sessionToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VehiclesApiResponse = await response.json();

      return {
        success: true,
        data: data.data.data,
        pagination: {
          page: data.data.page,
          limit: data.data.limit,
          total: data.data.total,
          totalPages: data.data.totalPages,
        },
      };
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const stationsApiService = new StationsApiService();
