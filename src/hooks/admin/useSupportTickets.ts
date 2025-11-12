import { 
    getSupportTickets, 
    getSupportTicketById 
} from "@/services/admin/support-ticket.service"
import { 
    SupportTicketsListResponse, 
    SupportTicketsParams, 
    SupportTicketDetailResponse 
} from "@/types/admin/support-ticket.type"
import { useQuery } from "@tanstack/react-query"

export const useGetSupportTickets = (params: SupportTicketsParams) => {
    return useQuery<SupportTicketsListResponse>({
        queryKey: ["support-tickets", params],
        queryFn: () => getSupportTickets(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
    })
}

export const useGetSupportTicket = (id: string) => {
    return useQuery<SupportTicketDetailResponse>({
        queryKey: ["support-ticket", id],
        queryFn: () => getSupportTicketById(id),
        enabled: !!id, // Only run query when id exists
    })
}
