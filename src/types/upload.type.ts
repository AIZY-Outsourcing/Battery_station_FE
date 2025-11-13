// Upload image response
export interface UploadImageResponse {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// Upload image request parameters
export interface UploadImageRequest {
  file: File;
  folder?: string;
  public_id?: string;
}

// API Response wrapper
export interface UploadImageApiResponse {
  data: UploadImageResponse;
  statusCode: number;
  message: string;
  timestamp: string;
}

// Delete image response
export interface DeleteImageResponse {
  result: string;
}

// Delete image API response
export interface DeleteImageApiResponse {
  data?: DeleteImageResponse;
  result?: string;
  statusCode?: number;
  message?: string;
  timestamp?: string;
}
