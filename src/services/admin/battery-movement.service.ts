import api from "@/lib/api";
import {
  BatteryMovementsListResponse,
  BatteryMovementDetailResponse,
  BatteryMovementsQueryParams,
  CreateBatteryMovementRequest,
  UpdateBatteryMovementRequest,
  StationBatteriesResponse,
} from "@/types/admin/battery-movement.type";

export const getBatteryMovements = async (
  params?: BatteryMovementsQueryParams
) => {
  const response = await api.get("/battery-movements", { params });
  return response.data;
};

export const getBatteryMovementById = async (id: string) => {
  const response = await api.get(`/battery-movements/${id}`);
  return response.data;
};

export const createBatteryMovement = async (
  requestBody: CreateBatteryMovementRequest
) => {
  const response = await api.post("/battery-movements", requestBody);
  return response.data;
};

export const updateBatteryMovement = async (
  id: string,
  requestBody: UpdateBatteryMovementRequest
) => {
  const response = await api.put(`/battery-movements/${id}`, requestBody);
  return response.data;
};

export const deleteBatteryMovement = async (id: string) => {
  const response = await api.delete(`/battery-movements/${id}`);
  return response.data;
};

export const getStationBatteriesForMovement = async (
  stationId: string,
  params?: BatteryMovementsQueryParams
) => {
  const response = await api.get(
    `/battery-movements/stations/${stationId}/batteries`,
    { params }
  );
  return response.data;
};

export const acceptBatteryMovement = async (id: string) => {
  const response = await api.post(`/battery-movements/${id}/accept`);
  return response.data;
};

