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
  vehicle: any | null;
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
  staff_id: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  staff: Staff | null;
}
