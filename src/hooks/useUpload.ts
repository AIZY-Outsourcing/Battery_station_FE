import { useMutation } from "@tanstack/react-query";
import { uploadImage, deleteImage } from "@/services/upload.service";
import { UploadImageRequest, UploadImageApiResponse, DeleteImageApiResponse } from "@/types/upload.type";

/**
 * Hook for uploading images
 * @returns Mutation object with upload function and states
 */
export const useUploadImage = () => {
  return useMutation<UploadImageApiResponse, Error, UploadImageRequest>({
    mutationFn: uploadImage,
  });
};

/**
 * Hook for deleting images
 * @returns Mutation object with delete function and states
 */
export const useDeleteImage = () => {
  return useMutation<DeleteImageApiResponse, Error, string>({
    mutationFn: deleteImage,
  });
};
