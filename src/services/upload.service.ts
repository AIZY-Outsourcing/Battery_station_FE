import api from "@/lib/api";
import { UploadImageRequest, UploadImageApiResponse, DeleteImageApiResponse } from "@/types/upload.type";

/**
 * Upload a single image to Cloudinary
 * @param params - Upload parameters including file, folder, and public_id
 * @returns Promise with upload response
 */
export const uploadImage = async (params: UploadImageRequest): Promise<UploadImageApiResponse> => {
  const formData = new FormData();
  formData.append("file", params.file);
  
  if (params.folder) {
    formData.append("folder", params.folder);
  }
  
  if (params.public_id) {
    formData.append("public_id", params.public_id);
  }

  const response = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Delete an image from Cloudinary by public ID
 * @param publicId - Cloudinary public ID of the image to delete (e.g., "stations/station_001")
 * @returns Promise with delete response
 */
export const deleteImage = async (publicId: string): Promise<DeleteImageApiResponse> => {
  const response = await api.delete(`/upload/image/${encodeURIComponent(publicId)}`);
  return response.data;
};
