import api from "@/lib/api";
import type { SupportTicketsQueryParams } from "@/types/staff/support.type";

export const getAllSupportTickets = async (params?: SupportTicketsQueryParams) => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) {
    queryParams.append("sortOrder", params.sortOrder.toUpperCase());
  }
  
  const queryString = queryParams.toString();
  const url = queryString 
    ? `/support-tickets?${queryString}`
    : `/support-tickets`;
  
  const response = await api.get<any>(url);
  
  console.log('Full Support Tickets API Response:', response);
  
  // API structure: { data: { data: {0: ticket, 1: ticket}, total, page, limit, totalPages } }
  const rawData = response.data?.data;
  console.log('Raw Data (response.data.data):', rawData);
  
  // Safely convert to array
  let ticketsArray: any[] = [];
  if (rawData) {
    if (Array.isArray(rawData)) {
      console.log('Raw Data is Array - flattening');
      ticketsArray = rawData.flatMap((item: any) => {
        if (typeof item === 'object' && item !== null) {
          return Object.values(item);
        }
        return [];
      });
    } else if (typeof rawData === 'object' && rawData !== null) {
      console.log('Raw Data is Object - converting to array');
      // rawData is {0: ticket, 1: ticket} - convert to array
      ticketsArray = Object.values(rawData);
    }
  }
  
  console.log('Final Processed Tickets Array:', ticketsArray);
  
  return {
    tickets: ticketsArray,
    total: response.data?.total || response.data?.data?.total || ticketsArray.length,
    page: response.data?.page || response.data?.data?.page || 1,
    limit: response.data?.limit || response.data?.data?.limit || ticketsArray.length,
    totalPages: response.data?.totalPages || response.data?.data?.totalPages || 1,
  };
};

