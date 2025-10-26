import api from "@/lib/api";
import { StationsQueryParams } from "@/types/admin/station.type";

export const getStations = async (params: StationsQueryParams) => {
    const response = await api.get("/stations", { params });
    return response.data;
}

export const getStationById = async (id: string) => {
    const response = await api.get(`/stations/${id}`);
    return response.data;
}