"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadImage, useDeleteImage } from "@/hooks/useUpload";
import { Upload, X, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  folder?: string;
  publicId?: string;
  onUploadSuccess?: (url: string, secureUrl: string, publicId: string) => void;
  onUploadError?: (error: Error) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: Error) => void;
  currentImageUrl?: string | null;
  currentPublicId?: string | null;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  allowDelete?: boolean; // Cho phép xóa ảnh hiện tại
}

export function ImageUpload({
  folder = "stations",
  publicId,
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onDeleteError,
  currentImageUrl,
  currentPublicId,
  label = "Upload hình ảnh",
  accept = "image/*",
  maxSize = 5, // 5MB default
  allowDelete = true,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(
    currentPublicId || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      toast.error(`File quá lớn. Kích thước tối đa là ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file để upload");
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        file: selectedFile,
        folder,
        public_id: publicId,
      });

      toast.success("Upload ảnh thành công!");

      // Save the uploaded public_id for deletion later
      setUploadedPublicId(result.data.public_id);

      if (onUploadSuccess) {
        onUploadSuccess(
          result.data.url,
          result.data.secure_url,
          result.data.public_id
        );
      }

      // Keep the preview after successful upload
      setPreview(result.data.secure_url);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload ảnh thất bại");

      if (onUploadError) {
        onUploadError(error as Error);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setUploadedPublicId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async () => {
    const publicIdToDelete = uploadedPublicId || currentPublicId;

    if (!publicIdToDelete) {
      toast.error("Không tìm thấy public ID để xóa");
      return;
    }

    try {
      await deleteMutation.mutateAsync(publicIdToDelete);
      toast.success("Xóa ảnh thành công!");

      // Clear preview and state
      setPreview(null);
      setUploadedPublicId(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Xóa ảnh thất bại");

      if (onDeleteError) {
        onDeleteError(error as Error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative w-full max-w-md">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            {allowDelete && (uploadedPublicId || currentPublicId) && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteImage}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-md">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click để chọn ảnh</span> hoặc
                kéo thả
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF (MAX. {maxSize}MB)
              </p>
            </div>
          </label>
        </div>
      )}

      <Input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile && !uploadMutation.isPending && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground flex-1">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang upload...
        </div>
      )}
    </div>
  );
}
