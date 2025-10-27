import api from "@/lib/api";
import { CreateStationRequest, UpdateStationRequest } from "@/schemas/station.schema";
import { StationsQueryParams } from "@/types/admin/station.type";

export const getStations = async (params: StationsQueryParams) => {
    const response = await api.get("/stations", { params });
    return response.data;
}

export const getStationById = async (id: string) => {
    const response = await api.get(`/stations/${id}`);
    return response.data;
}

export const createStation = async (requestBody: CreateStationRequest) => {
    const response = await api.post("/stations", requestBody);
    return response.data;
}

export const updateStation = async (id: string, requestBody: UpdateStationRequest) => {
    const response = await api.put(`/stations/${id}`, requestBody)
    return response.data;
}

export const deleteStation = async (id: string) => {
    const response = await api.delete(`/stations/${id}`);
    return response.data;
}
