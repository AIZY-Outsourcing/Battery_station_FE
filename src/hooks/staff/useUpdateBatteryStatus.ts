import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBatteryStatus } from "@/services/staff/battery.service";
import type { UpdateBatteryStatusRequest } from "@/types/staff/battery.type";
import { toast } from "sonner";

export const useUpdateBatteryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batteryId,
      data,
    }: {
      batteryId: string;
      data: UpdateBatteryStatusRequest;
    }) => updateBatteryStatus(batteryId, data),
    onSuccess: () => {
      // Invalidate and refetch batteries list
      queryClient.invalidateQueries({ queryKey: ["station-batteries"] });
      toast.success("Cập nhật trạng thái pin thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái pin"
      );
    },
  });
};

