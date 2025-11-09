import api from "@/lib/api";
import { SupportTicketsParams, SupportTicketsListResponse } from "@/types/admin/support-ticket.type";

export const getSupportTickets = async (params: SupportTicketsParams): Promise<SupportTicketsListResponse> => {
    const res = await api.get("/support-tickets", { params });
    return res.data;
}

export const getSupportTicketById = async (id: string) => {
    const res = await api.get(`/support-tickets/${id}`);
    return res.data;
}
