import api from "@/lib/api";
import type { StaffStation, StaffStationsResponse } from "@/types/staff/station.type";

export const getStaffStations = async (): Promise<StaffStation[]> => {
  const response = await api.get<StaffStationsResponse>("/stations/staff");
  
  // Convert object to array (API returns { "0": {...}, "1": {...} })
  const stationsArray = Object.values(response.data.data);
  
  return stationsArray;
};

