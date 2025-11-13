export interface PaymentTransaction {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  order_id: string;
  user_id: string;
  code: string;
  amount: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  content: string;
  qr_code: string | null;
  reference_code: string | null;
  error_message: string | null;
  // Relations
  user?: {
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
    vehicles?: {
      id: string;
      created_at: string;
      updated_at: string;
      created_by: string;
      updated_by: string | null;
      deleted_at: string | null;
      name: string;
      vin: string;
      plate_number: string;
      manufacturer_year: string;
      user_id: string;
      battery_type_id: string;
      vehicle_model_id: string;
      battery_type: {
        id: string;
        name: string;
        description: string;
      };
      vehicle_model: {
        id: string;
        name: string;
        battery_type_id: string;
      };
    }[];
  };
  order?: {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    type: 'package' | 'single';
    package_id: string | null;
    quantity: number;
    total_amount: string;
    status: string;
    package?: {
      id: string;
      name: string;
      price: string;
      quota_swaps: number;
      duration_days: number;
      description: string;
    } | null;
  };
}

export interface PaymentTransactionsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
  user_id?: string;
}

export interface PaymentTransactionsListResponse {
  data: {
    data: PaymentTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface PaymentTransactionDetailResponse {
  data: PaymentTransaction;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface CreatePaymentTransactionRequest {
  order_id: string;
  user_id: string;
  code: string;
  amount: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  content: string;
}

export interface UpdatePaymentTransactionRequest {
  status?: 'pending' | 'success' | 'failed' | 'cancelled';
  error_message?: string;
}
