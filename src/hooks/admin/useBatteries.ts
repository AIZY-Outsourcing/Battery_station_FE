import { 
    getBatteries, 
    getBatteryById, 
    createBattery, 
    updateBattery, 
    deleteBattery 
} from "@/services/admin/batteries.service"
import { 
    BatteriesListResponse, 
    BatteriesParams, 
    BatteryDetailResponse 
} from "@/types/admin/batteries.type"
import { 
    CreateBatteryRequest, 
    UpdateBatteryRequest 
} from "@/schemas/batteries.schema"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useGetBatteries = (params: BatteriesParams) => {
    return useQuery<BatteriesListResponse>({
        queryKey: ["batteries", params],
        queryFn: () => getBatteries(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
    })
}

export const useGetBattery = (id: string) => {
    return useQuery<BatteryDetailResponse>({
        queryKey: ["battery", id],
        queryFn: () => getBatteryById(id),
        enabled: !!id, // Only run query when id exists
    })
}

export const useCreateBattery = () => {
    const queryClient = useQueryClient();
    return useMutation<BatteryDetailResponse, unknown, CreateBatteryRequest>({
        mutationFn: createBattery,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batteries"] }); // Refresh batteries list after successful creation
        }
    });
};

export const useUpdateBattery = () => {
    const queryClient = useQueryClient();
    return useMutation<BatteryDetailResponse, unknown, { id: string; data: UpdateBatteryRequest }>({
        mutationFn: ({ id, data }) => updateBattery(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["batteries"] }); // Refresh batteries list after successful update
            queryClient.invalidateQueries({ queryKey: ["battery", variables.id] }); // Refresh specific battery details
        }
    });
};

export const useDeleteBattery = () => {
    const queryClient = useQueryClient();
    return useMutation<BatteryDetailResponse, unknown, string>({
        mutationFn: (id) => deleteBattery(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batteries"] }); // Refresh batteries list after successful deletion
        }
    });
};