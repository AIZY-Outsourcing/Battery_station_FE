export interface SupportImage {
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string | null;
    deleted_at: string | null;
    image_url: string;
    ticket_id: string;
}

export interface Subject {
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string | null;
    deleted_at: string | null;
    name: string;
    description: string;
    parent_id: string | null;
    status: string;
}

export interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_verified: boolean;
    is_2fa_enabled: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    vehicle: string | null;
}

export interface Station {
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
    deleted_at: string | null;
    name: string;
    image_url: string;
    address: string;
    city: string;
    lat: string;
    lng: string;
    staff_id: string;
    status: string;
    staff: Staff;
}

export interface SupportTicket {
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string | null;
    deleted_at: string | null;
    title: string;
    description: string;
    subject_id: string;
    station_id: string;
    staff_id: string;
    status: string;
    support_images: SupportImage[];
    subject: Subject;
    station: Station;
    user: string | null;
    staff: Staff;
}

export interface SupportTicketsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SupportTicketsListResponse {
    data: {
        data: SupportTicket[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    statusCode: number;
    message: string;
    timestamp: string;
}

// Single support ticket response
export interface SupportTicketDetailResponse {
    data: SupportTicket;
    statusCode: number;
    message: string;
    timestamp: string;
}

// Update support ticket request
export interface UpdateSupportTicketRequest {
    title?: string;
    description?: string;
    subject_id?: string;
    station_id?: string;
    staff_id?: string;
    status?: string;
}

// Update support ticket response
export interface UpdateSupportTicketResponse {
    data: SupportTicket;
    statusCode: number;
    message: string;
    timestamp: string;
}
