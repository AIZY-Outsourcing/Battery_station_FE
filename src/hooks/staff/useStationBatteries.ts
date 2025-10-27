import { useQuery } from "@tanstack/react-query";
import { getStationBatteries } from "@/services/staff/battery.service";
import type { BatteriesQueryParams } from "@/types/staff/battery.type";

export const useStationBatteries = (
  stationId: string,
  params?: BatteriesQueryParams
) => {
  return useQuery({
    queryKey: ["station-batteries", stationId, params],
    queryFn: () => getStationBatteries(stationId, params),
    enabled: !!stationId,
    staleTime: 0,
    cacheTime: 0,
  });
};

