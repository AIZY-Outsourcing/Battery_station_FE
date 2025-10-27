export interface Batteries {
    id: string;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
    deleted_at: string | null;
    name: string;
    serial_number: string;
    capacity_kwh: string;
    soh: string;
    status: string;
    station_kiosk_slot: string | null;
    station_id: string | null;
    battery_type_id: string;
}

export interface BatteriesParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    search?: string;
}

export interface BatteriesListResponse {
    data: {
        data: Batteries[];
        statusCode?: number;
        message?: string;
        timestamp?: string;
        meta?: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

// Single battery response
export interface BatteryDetailResponse {
    data: Batteries;
    statusCode: number;
    message: string;
    timestamp: string;
}