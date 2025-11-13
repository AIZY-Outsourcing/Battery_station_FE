import { useQuery } from "@tanstack/react-query";
import { getBatteryStatusLogs } from "@/services/staff/battery.service";

export const useBatteryStatusLogs = (batteryId: string) => {
  return useQuery({
    queryKey: ["battery-status-logs", batteryId],
    queryFn: () => getBatteryStatusLogs(batteryId),
    enabled: !!batteryId,
    staleTime: 0,
    cacheTime: 0,
  });
};

