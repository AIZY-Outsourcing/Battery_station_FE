import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { batteryMovementAPI } from "@/services/staff/battery-movement.service";
import type {
  BatteryMovementFilters,
  CreateBatteryMovementRequest,
  UpdateBatteryMovementRequest,
} from "@/types/staff/battery-movement.type";
import { toast } from "sonner";

// Query Keys
const QUERY_KEYS = {
  movements: "battery-movements",
  movementDetail: "battery-movement-detail",
  stationBatteries: "station-batteries",
};

/**
 * Get all battery movements with filters
 */
export const useBatteryMovements = (filters?: BatteryMovementFilters, station_id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.movements, filters, station_id],
    queryFn: () => batteryMovementAPI.getAllMovements(filters, station_id),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
};

/**
 * Get battery movement detail by ID
 */
export const useBatteryMovementDetail = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.movementDetail, id],
    queryFn: () => batteryMovementAPI.getMovementById(id),
    enabled: !!id,
  });
};

/**
 * Get available batteries for a station
 */
export const useStationBatteries = (
  stationId: string,
  filters?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.stationBatteries, stationId, filters],
    queryFn: () => batteryMovementAPI.getStationBatteries(stationId, filters),
    enabled: !!stationId,
  });
};

/**
 * Create battery movement mutation
 */
export const useCreateBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatteryMovementRequest) =>
      batteryMovementAPI.createMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movements] });
      toast.success("Tạo yêu cầu di chuyển pin thành công!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể tạo yêu cầu di chuyển pin"
      );
    },
  });
};

/**
 * Staff confirm sub-request mutation
 */
export const useConfirmSubRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subRequestId, station_id }: { subRequestId: string; station_id?: string }) =>
      batteryMovementAPI.confirmSubRequest(subRequestId, station_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movements] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.movementDetail, data.id],
      });
      if (data.parent_request_id) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.movementDetail, data.parent_request_id],
        });
      }
      toast.success("Xác nhận yêu cầu thành công!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể xác nhận yêu cầu"
      );
    },
  });
};

/**
 * Admin execute movement mutation
 */
export const useExecuteMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (parentRequestId: string) =>
      batteryMovementAPI.executeMovement(parentRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movements] });
      toast.success("Thực thi di chuyển pin thành công!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể thực thi di chuyển pin"
      );
    },
  });
};

/**
 * Update battery movement mutation
 */
export const useUpdateBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBatteryMovementRequest }) =>
      batteryMovementAPI.updateMovement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movements] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.movementDetail, variables.id],
      });
      toast.success("Cập nhật yêu cầu thành công!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật yêu cầu"
      );
    },
  });
};

/**
 * Delete battery movement mutation
 */
export const useDeleteBatteryMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => batteryMovementAPI.deleteMovement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.movements] });
      toast.success("Xóa yêu cầu thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể xóa yêu cầu");
    },
  });
};
