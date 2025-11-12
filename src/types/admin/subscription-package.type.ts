export interface SubscriptionPackage {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  name: string;
  price: string;
  quota_swaps: number;
  duration_days: number;
  description: string;
}

export interface SubscriptionPackagesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface SubscriptionPackagesListResponse {
  data: {
    data: SubscriptionPackage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

// Single subscription package response
export interface SubscriptionPackageDetailResponse {
  data: SubscriptionPackage;
  statusCode: number;
  message: string;
  timestamp: string;
}

// For create/update requests
export interface CreateSubscriptionPackageRequest {
  name: string;
  price: string;
  quota_swaps: number;
  duration_days: number;
  description: string;
}

export interface UpdateSubscriptionPackageRequest {
  name?: string;
  price?: string;
  quota_swaps?: number;
  duration_days?: number;
  description?: string;
}
