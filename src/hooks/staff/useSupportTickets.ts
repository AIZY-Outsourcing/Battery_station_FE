import { useQuery } from "@tanstack/react-query";
import { getAllSupportTickets } from "@/services/staff/support.service";
import type { SupportTicketsQueryParams } from "@/types/staff/support.type";

export const useSupportTickets = (params?: SupportTicketsQueryParams) => {
  return useQuery({
    queryKey: ["support-tickets", params],
    queryFn: () => getAllSupportTickets(params),
    staleTime: 0,
    cacheTime: 0,
  });
};

