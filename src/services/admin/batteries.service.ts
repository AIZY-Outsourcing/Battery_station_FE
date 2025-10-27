import api from "@/lib/api";
import { BatteriesParams, BatteriesListResponse } from "@/types/admin/batteries.type";
import { CreateBatteryRequest, UpdateBatteryRequest } from "@/schemas/batteries.schema";

// Mock data for testing when API is not ready
const mockBatteries: BatteriesListResponse = {
    data: {
        data: [
            {
                id: "BT001",
                created_at: "2024-01-15T14:30:00Z",
                updated_at: "2024-01-15T14:30:00Z",
                created_by: "admin",
                updated_by: "admin",
                deleted_at: null,
                name: "Pin LiFePO4 001",
                serial_number: "SN001",
                capacity_kwh: "20",
                soh: "95",
                status: "available",
                station_kiosk_slot: "1",
                station_id: "ST001",
                battery_type_id: "BT_TYPE_001"
            },
            {
                id: "BT002",
                created_at: "2024-01-15T14:30:00Z",
                updated_at: "2024-01-15T14:30:00Z",
                created_by: "admin",
                updated_by: "admin",
                deleted_at: null,
                name: "Pin LiFePO4 002",
                serial_number: "SN002",
                capacity_kwh: "15",
                soh: "78",
                status: "charging",
                station_kiosk_slot: "2",
                station_id: "ST001",
                battery_type_id: "BT_TYPE_001"
            },
            {
                id: "BT003",
                created_at: "2024-01-15T14:30:00Z",
                updated_at: "2024-01-15T14:30:00Z",
                created_by: "admin",
                updated_by: "admin",
                deleted_at: null,
                name: "Pin LiFePO4 003",
                serial_number: "SN003",
                capacity_kwh: "20",
                soh: "45",
                status: "maintenance",
                station_kiosk_slot: null,
                station_id: null,
                battery_type_id: "BT_TYPE_002"
            }
        ],
        statusCode: 200,
        message: "Success",
        timestamp: new Date().toISOString(),
        meta: {
            total: 3,
            page: 1,
            limit: 10,
            totalPages: 1
        }
    }
};

export const getBatteries = async (params: BatteriesParams): Promise<BatteriesListResponse> => {
    try {
        const res = await api.get("/batteries", { params });
        return res.data;
    } catch (error) {
        console.warn("API call failed, using mock data:", error);
        
        // Return mock data if API fails
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockBatteries);
            }, 500);
        });
    }
}

export const getBatteryById = async (id: string) => {
    try {
        const res = await api.get(`/batteries/${id}`);
        return res.data;
    } catch (error) {
        console.warn("API call failed, using mock data:", error);
        
        // Find battery in mock data
        const battery = mockBatteries.data.data.find(b => b.id === id);
        if (battery) {
            return {
                data: battery,
                statusCode: 200,
                message: "Success (Mock)",
                timestamp: new Date().toISOString()
            };
        }
        
        // If not found, throw error
        throw new Error(`Battery with ID ${id} not found`);
    }
}

export const createBattery = async (data: CreateBatteryRequest) => {
    try {
        const res = await api.post("/batteries", data);
        return res.data;
    } catch (error) {
        console.warn("API call failed, simulating creation:", error);
        
        // Simulate successful creation
        const newBattery = {
            id: `BT${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: "admin",
            updated_by: "admin",
            deleted_at: null,
            ...data,
            capacity_kwh: data.capacity_kwh.toString(),
            soh: data.soh.toString(),
            status: "available"
        };
        
        return {
            data: newBattery,
            statusCode: 201,
            message: "Created (Mock)",
            timestamp: new Date().toISOString()
        };
    }
}

export const updateBattery = async (id: string, data: UpdateBatteryRequest) => {
    try {
        const res = await api.put(`/batteries/${id}`, data);
        return res.data;
    } catch (error) {
        console.warn("API call failed, simulating update:", error);
        
        // Simulate successful update
        const battery = mockBatteries.data.data.find(b => b.id === id);
        if (!battery) {
            throw new Error(`Battery with ID ${id} not found`);
        }
        
        const updatedBattery = {
            ...battery,
            ...data,
            capacity_kwh: data.capacity_kwh?.toString() || battery.capacity_kwh,
            soh: data.soh?.toString() || battery.soh,
            updated_at: new Date().toISOString(),
            updated_by: "admin"
        };
        
        return {
            data: updatedBattery,
            statusCode: 200,
            message: "Updated (Mock)",
            timestamp: new Date().toISOString()
        };
    }
}

export const deleteBattery = async (id: string) => {
    try {
        const res = await api.delete(`/batteries/${id}`);
        return res.data;
    } catch (error) {
        console.warn("API call failed, simulating deletion:", error);
        
        // Simulate successful deletion
        return {
            data: { id },
            statusCode: 200,
            message: "Deleted (Mock)",
            timestamp: new Date().toISOString()
        };
    }
}