import { 
    getSupportTickets, 
    getSupportTicketById,
    updateSupportTicket
} from "@/services/admin/support-ticket.service"
import { 
    SupportTicketsListResponse, 
    SupportTicketsParams, 
    SupportTicketDetailResponse,
    UpdateSupportTicketRequest,
    UpdateSupportTicketResponse
} from "@/types/admin/support-ticket.type"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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

export const useUpdateSupportTicket = (id: string) => {
    const queryClient = useQueryClient()
    
    return useMutation<UpdateSupportTicketResponse, Error, UpdateSupportTicketRequest>({
        mutationFn: (data) => updateSupportTicket(id, data),
        onSuccess: () => {
            // Invalidate and refetch support tickets list
            queryClient.invalidateQueries({ queryKey: ["support-tickets"] })
            // Invalidate and refetch specific support ticket
            queryClient.invalidateQueries({ queryKey: ["support-ticket", id] })
        },
    })
}
