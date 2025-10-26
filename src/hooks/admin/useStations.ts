import { getStationById, getStations } from "@/services/admin/station.service";
import { Station, StationsListResponse, StationsQueryParams } from "@/types/admin/station.type";
import { useQuery } from "@tanstack/react-query";


export const useGetStations = (params: StationsQueryParams) => {
    return useQuery<StationsListResponse> ({
        queryKey: ["stations", params],
        queryFn: () => getStations(params)

    })
}

export const useGetStationDetails = (id: string) => {
    return useQuery<StationsListResponse>({
        queryKey: ["station", id],
        queryFn: () => getStationById(id),
        enabled: !!id, // Chỉ chạy query khi id tồn tại
    })
}