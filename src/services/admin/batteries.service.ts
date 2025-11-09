import api from "@/lib/api";
import { BatteriesParams, BatteriesListResponse } from "@/types/admin/batteries.type";
import { CreateBatteryRequest, UpdateBatteryRequest } from "@/schemas/batteries.schema";

export const getBatteries = async (params: BatteriesParams): Promise<BatteriesListResponse> => {
    const res = await api.get("/batteries", { params });
    return res.data;
}

export const getBatteryById = async (id: string) => {
    const res = await api.get(`/batteries/${id}`);
    return res.data;
}

export const createBattery = async (data: CreateBatteryRequest) => {
    const res = await api.post("/batteries", data);
    return res.data;
}

export const updateBattery = async (id: string, data: UpdateBatteryRequest) => {
    const res = await api.put(`/batteries/${id}`, data);
    return res.data;
}

export const deleteBattery = async (id: string) => {
    const res = await api.delete(`/batteries/${id}`);
    return res.data;
}