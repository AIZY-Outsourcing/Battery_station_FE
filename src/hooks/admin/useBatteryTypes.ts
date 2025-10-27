import { 
  CreateBatteryTypeRequest, 
  UpdateBatteryTypeRequest 
} from "@/schemas/battery-types.schema";
import { 
  createBatteryType, 
  deleteBatteryType, 
  getBatteryTypeById, 
  getBatteryTypes, 
  updateBatteryType 
} from "@/services/admin/battery-types.service";
import { 
  BatteryTypeDetailResponse, 
  BatteryTypesListResponse,
  BatteryTypesQueryParams
} from "@/types/admin/battery-types.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetBatteryTypes = (params: BatteryTypesQueryParams) => {
  return useQuery<BatteryTypesListResponse>({
    queryKey: ["battery-types", params],
    queryFn: () => getBatteryTypes(params)
  });
};

export const useGetBatteryTypeDetails = (id: string) => {
  return useQuery<BatteryTypeDetailResponse>({
    queryKey: ["battery-type", id],
    queryFn: () => getBatteryTypeById(id),
    enabled: !!id, // Only run query when id exists
  });
};

export const useCreateBatteryType = () => {
  const queryClient = useQueryClient();
  return useMutation<BatteryTypeDetailResponse, unknown, CreateBatteryTypeRequest>({
    mutationFn: createBatteryType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["battery-types"] }); // Refresh battery types list after successful creation
    }
  });
};

export const useUpdateBatteryType = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<BatteryTypeDetailResponse, unknown, UpdateBatteryTypeRequest>({
    mutationFn: (data: UpdateBatteryTypeRequest) => updateBatteryType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["battery-types"] }); // Refresh battery types list after successful update
      queryClient.invalidateQueries({ queryKey: ["battery-type", id] }); // Refresh specific battery type details
    }
  });
};

export const useDeleteBatteryType = () => {
  const queryClient = useQueryClient();
  return useMutation<BatteryTypeDetailResponse, unknown, string>({
    mutationFn: (id) => deleteBatteryType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["battery-types"] }); // Refresh battery types list after successful deletion
    }
  });
};