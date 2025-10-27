import { useQuery } from "@tanstack/react-query";
import { getStaffStations } from "@/services/staff/station.service";

export const useStaffStations = () => {
  return useQuery({
    queryKey: ["staff-stations"],
    queryFn: getStaffStations,
  });
};

