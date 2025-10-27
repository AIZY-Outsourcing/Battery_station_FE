import { CreateStationRequest, UpdateStationRequest } from "@/schemas/station.schema";
import { createStation, deleteStation, getStationById, getStations, updateStation } from "@/services/admin/station.service";
import { StationDetailResponse, StationsListResponse, StationsQueryParams } from "@/types/admin/station.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetStations = (params: StationsQueryParams) => {
    return useQuery<StationsListResponse> ({
        queryKey: ["stations", params],
        queryFn: () => getStations(params)

    })
}

export const useGetStationDetails = (id: string) => {
    return useQuery<StationDetailResponse>({
        queryKey: ["station", id],
        queryFn: () => getStationById(id),
        enabled: !!id, // Chỉ chạy query khi id tồn tại
    })
}

export const useCreateStation = () => {
    // khai báo query client ở đây nếu cần invalidate cache sau khi tạo
    const queryClient = useQueryClient()
    return useMutation <StationDetailResponse, unknown, CreateStationRequest>({
        mutationFn: createStation,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["station"]}); // làm mới danh sách stations sau khi tạo thành công
        }
    })
}

export const useUpdateStation = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation <StationDetailResponse, unknown, UpdateStationRequest>({
        mutationFn: (data: UpdateStationRequest) => updateStation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["station"]}); // làm mới danh sách stations sau khi cập nhật thành công
        }
    })
}

export const useDeleteStation = () => {
    const queryClient = useQueryClient();
    return useMutation <StationDetailResponse, unknown, string>({
        mutationFn: (id) => deleteStation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["stations"]}); // làm mới danh sách stations sau khi xóa thành công
        }
    })
    
}
    