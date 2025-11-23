import api from "@/lib/api";
import { SupportTicketsParams, SupportTicketsListResponse, UpdateSupportTicketRequest } from "@/types/admin/support-ticket.type";

export const getSupportTickets = async (params: SupportTicketsParams): Promise<SupportTicketsListResponse> => {
    const res = await api.get("/support-tickets", { params });
    return res.data;
}

export const getSupportTicketById = async (id: string) => {
    const res = await api.get(`/support-tickets/${id}`);
    return res.data;
}

export const updateSupportTicket = async (id: string, data: UpdateSupportTicketRequest) => {
    const res = await api.put(`/support-tickets/${id}`, data);
    return res.data;
}
