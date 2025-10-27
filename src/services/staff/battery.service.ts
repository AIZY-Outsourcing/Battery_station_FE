import api from "@/lib/api";
import type {
  BatteriesListResponse,
  BatteriesQueryParams,
  UpdateBatteryStatusRequest,
  BatteryUpdateResponse,
} from "@/types/staff/battery.type";

export const getStationBatteries = async (
  stationId: string,
  params?: BatteriesQueryParams
) => {
  const queryParams = new URLSearchParams();
  
  // Add all query params
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) {
    // Convert to uppercase for API
    queryParams.append("sortOrder", params.sortOrder.toUpperCase());
  }
  
  // Add stationId to query params (BE requirement)
  queryParams.append("stationId", stationId);
  
  const queryString = queryParams.toString();
  
  // Build URL: /batteries/station/{stationId}?{queryString}
  const url = `/batteries/station/${stationId}?${queryString}`;
  
  const response = await api.get<any>(url);
  
  // API returns { data: { 0: {...}, 1: {...}, ... }, statusCode, message }
  // Convert response.data from object to array
  const rawData = response.data.data;
  const batteriesArray = Array.isArray(rawData) 
    ? rawData 
    : Object.values(rawData);
  
  // Return full response structure
  return {
    batteries: batteriesArray,
    total: batteriesArray.length,
    page: 1,
    limit: batteriesArray.length,
    totalPages: 1,
  };
};

// Update battery status
export const updateBatteryStatus = async (
  batteryId: string,
  data: UpdateBatteryStatusRequest
) => {
  const response = await api.put<BatteryUpdateResponse>(
    `/batteries/${batteryId}/status`,
    data
  );
  return response.data;
};
