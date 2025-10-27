import api from "@/lib/api";
import { 
  CreateBatteryTypeRequest, 
  UpdateBatteryTypeRequest 
} from "@/schemas/battery-types.schema";
import { BatteryTypesQueryParams } from "@/types/admin/battery-types.type";

export const getBatteryTypes = async (params: BatteryTypesQueryParams) => {
  const response = await api.get("/battery-types", { params });
  return response.data;
};

export const getBatteryTypeById = async (id: string) => {
  const response = await api.get(`/battery-types/${id}`);
  return response.data;
};

export const createBatteryType = async (requestBody: CreateBatteryTypeRequest) => {
  const response = await api.post("/battery-types", requestBody);
  return response.data;
};

export const updateBatteryType = async (id: string, requestBody: UpdateBatteryTypeRequest) => {
  const response = await api.put(`/battery-types/${id}`, requestBody);
  return response.data;
};

export const deleteBatteryType = async (id: string) => {
  const response = await api.delete(`/battery-types/${id}`);
  return response.data;
};