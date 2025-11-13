import {
  getBatteryMovements,
  getBatteryMovementById,
  createBatteryMovement,
  updateBatteryMovement,
  deleteBatteryMovement,
  getStationBatteriesForMovement,
  acceptBatteryMovement,
} from "@/services/admin/battery-movement.service";
import {
  BatteryMovementsListResponse,
  BatteryMovementDetailResponse,
  BatteryMovementsQueryParams,
  CreateBatteryMovementRequest,
  UpdateBatteryMovementRequest,
  StationBatteriesResponse,
} from "@/types/admin/battery-movement.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetBatteryMovements = (params?: BatteryMovementsQueryParams) => {
  return useQuery<BatteryMovementsListResponse>({
    queryKey: ["battery-movements", params],
    queryFn: () => getBatteryMovements(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetBatteryMovement = (id: string) => {
  return useQuery<BatteryMovementDetailResponse>({
    queryKey: ["battery-movement", id],
    queryFn: () => getBatteryMovementById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useCreateBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatteryMovementRequest) =>
      createBatteryMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["battery-movements"] });
    },
  });
};

export const useUpdateBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBatteryMovementRequest;
    }) => updateBatteryMovement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["battery-movements"] });
      queryClient.invalidateQueries({
        queryKey: ["battery-movement", variables.id],
      });
    },
  });
};

export const useDeleteBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBatteryMovement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["battery-movements"] });
    },
  });
};

export const useGetStationBatteriesForMovement = (
  stationId: string,
  params?: BatteryMovementsQueryParams
) => {
  return useQuery<StationBatteriesResponse>({
    queryKey: ["station-batteries", stationId, params],
    queryFn: () => getStationBatteriesForMovement(stationId, params),
    enabled: !!stationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
};

export const useAcceptBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptBatteryMovement(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["battery-movements"] });
      queryClient.invalidateQueries({
        queryKey: ["battery-movement", id],
      });
      // Also invalidate station batteries and inventory
      queryClient.invalidateQueries({ queryKey: ["station-batteries"] });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
  });
};

