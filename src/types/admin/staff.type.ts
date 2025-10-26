// Staff interface
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
  vehicle: any | null; // Type this more specifically if vehicle structure is known
}

// Staff roles enum
export type StaffRole = 'admin' | 'staff' | 'manager';

// Create staff payload
export interface CreateStaffPayload {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  password: string;
}

// Update staff payload
export interface UpdateStaffPayload extends Partial<CreateStaffPayload> {
  id: string;
}

// Staff form data
export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  password?: string;
}