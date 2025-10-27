export interface StaffStation {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  image_url: string | null;
  address: string;
  city: string;
  lat: string;
  lng: string;
  staff_id: string;
  status: "active" | "inactive" | "maintenance";
  staff: {
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
    vehicle: any | null;
  } | null;
}

export interface StaffStationsResponse {
  data: Record<string, StaffStation>;
  statusCode: number;
  message: string;
  timestamp: string;
}

