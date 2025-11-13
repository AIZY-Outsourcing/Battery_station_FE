# Image Upload & Delete Feature Documentation

## 📁 Cấu trúc files đã tạo

### 1. **Types** (`src/types/upload.type.ts`)

- `UploadImageResponse`: Response từ API sau khi upload
- `UploadImageRequest`: Request parameters cho upload
- `UploadImageApiResponse`: Wrapper response từ API
- `DeleteImageResponse`: Response từ API sau khi xóa
- `DeleteImageApiResponse`: Wrapper response từ delete API

### 2. **Services** (`src/services/upload.service.ts`)

- `uploadImage()`: Function gọi API upload ảnh
  - Tự động tạo FormData
  - Hỗ trợ custom folder và public_id
  - Tự động set header `multipart/form-data`
- `deleteImage(publicId)`: Function gọi API xóa ảnh
  - Xóa ảnh từ Cloudinary theo public_id
  - Tự động encode publicId trong URL

### 3. **Hooks** (`src/hooks/useUpload.ts`)

- `useUploadImage()`: React Query mutation hook
  - Trả về mutation object với states (isPending, error, data)
  - Tự động handle loading và error states
- `useDeleteImage()`: React Query mutation hook
  - Xóa ảnh trên Cloudinary
  - Trả về mutation object với delete states

### 4. **UI Component** (`src/components/ui/image-upload.tsx`)

- Component có thể tái sử dụng cho upload và xóa ảnh
- Features:
  - ✅ Drag & drop hoặc click để chọn file
  - ✅ Preview ảnh trước khi upload
  - ✅ Validation file size và file type
  - ✅ Progress indicator khi đang upload
  - ✅ Remove ảnh đã chọn (local only)
  - ✅ Delete ảnh từ Cloudinary (nếu có publicId)
  - ✅ Hiển thị ảnh hiện tại (cho edit mode)
  - ✅ 2 buttons: Trash (delete từ server) và X (remove local preview)

## 🚀 Cách sử dụng

### Sử dụng Component ImageUpload

```tsx
import { ImageUpload } from "@/components/ui/image-upload";

<ImageUpload
  folder="stations" // Folder trong Cloudinary
  publicId="station_001" // Custom public ID (optional)
  label="Hình ảnh trạm" // Label hiển thị
  currentImageUrl={imageUrl} // URL ảnh hiện tại (cho edit)
  currentPublicId={publicId} // Public ID của ảnh hiện tại (để xóa)
  maxSize={5} // Max size in MB (default: 5)
  accept="image/*" // File types accepted
  allowDelete={true} // Cho phép xóa ảnh (default: true)
  onUploadSuccess={(url, secureUrl, publicId) => {
    // Handle sau khi upload thành công
    setImageUrl(secureUrl);
    form.setValue("image_url", secureUrl);
    // Có thể lưu publicId để xóa sau này
  }}
  onUploadError={(error) => {
    // Handle khi upload lỗi
    toast.error("Upload failed: " + error.message);
  }}
  onDeleteSuccess={() => {
    // Handle sau khi xóa thành công
    setImageUrl("");
    form.setValue("image_url", "");
  }}
  onDeleteError={(error) => {
    // Handle khi xóa lỗi
    toast.error("Delete failed: " + error.message);
  }}
/>;
```

### Sử dụng Hook trực tiếp

#### Upload Hook

```tsx
import { useUploadImage } from "@/hooks/useUpload";

const uploadMutation = useUploadImage();

const handleUpload = async (file: File) => {
  try {
    const result = await uploadMutation.mutateAsync({
      file,
      folder: "stations",
      public_id: "custom_id",
    });

    console.log("Uploaded URL:", result.data.secure_url);
    console.log("Public ID:", result.data.public_id);
  } catch (error) {
    console.error("Upload error:", error);
  }
};
```

#### Delete Hook

```tsx
import { useDeleteImage } from "@/hooks/useUpload";

const deleteMutation = useDeleteImage();

const handleDelete = async (publicId: string) => {
  try {
    await deleteMutation.mutateAsync(publicId);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
  }
};

// Hoặc dùng callbacks
deleteMutation.mutate("stations/station_001", {
  onSuccess: () => {
    console.log("Deleted successfully");
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});
```

## 📝 API Endpoints

### Upload Image

**POST** `/api/v1/upload/image`

**Request:**

- `Content-Type: multipart/form-data`
- `file`: File binary (required)
- `folder`: Folder name in Cloudinary (optional)
- `public_id`: Custom public ID (optional)

**Response:**

```json
{
  "data": {
    "public_id": "stations/station_001",
    "url": "https://res.cloudinary.com/...",
    "secure_url": "https://res.cloudinary.com/...",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 256000
  },
  "statusCode": 201,
  "message": "Success",
  "timestamp": "2025-11-13T..."
}
```

### Delete Image

**DELETE** `/api/v1/upload/image/{publicId}`

**Parameters:**

- `publicId` (path): Cloudinary public ID (e.g., "stations/station_001")

**Response:**

```json
{
  "result": "ok"
}
```

## ✅ Đã tích hợp vào

1. **Station Add Page** (`/admin/stations/add`)

   - Upload ảnh mới khi tạo trạm
   - Lưu URL vào `image_url` field

2. **Station Edit Page** (`/admin/stations/[id]/edit`)
   - Hiển thị ảnh hiện tại
   - Upload ảnh mới để thay thế
   - **Xóa ảnh cũ từ Cloudinary** (nút Trash icon)
   - Remove preview local (nút X icon)
   - Hoặc nhập URL trực tiếp

## 🎨 Features

- ✅ Drag & Drop upload
- ✅ File validation (type, size)
- ✅ Image preview
- ✅ Loading states (upload & delete)
- ✅ Error handling
- ✅ Success/Error toasts
- ✅ **Delete image from Cloudinary**
- ✅ Remove local preview
- ✅ Show current image in edit mode
- ✅ Responsive design
- ✅ TypeScript support
- ✅ 2 buttons khi có ảnh:
  - 🗑️ **Trash button** (red): Xóa ảnh từ Cloudinary server
  - ❌ **X button** (gray): Chỉ remove preview local

## 🔧 Customization

Component có thể custom qua props:

- `folder`: Thư mục lưu trên Cloudinary
- `publicId`: ID tùy chỉnh cho file upload
- `label`: Text hiển thị
- `accept`: Loại file chấp nhận
- `maxSize`: Kích thước tối đa (MB)
- `currentImageUrl`: URL ảnh hiện tại
- `currentPublicId`: Public ID của ảnh hiện tại (để xóa)
- `allowDelete`: Cho phép xóa ảnh từ server (default: true)
- `onUploadSuccess`: Callback khi upload thành công
- `onUploadError`: Callback khi upload lỗi
- `onDeleteSuccess`: Callback khi xóa thành công
- `onDeleteError`: Callback khi xóa lỗi

## 🔄 Flow hoạt động

### Upload Flow

1. User chọn file (drag-drop hoặc click)
2. Component validate file (size, type)
3. Hiển thị preview local
4. User click "Upload" button
5. Call API POST /upload/image
6. Lưu `secure_url` và `public_id` vào form
7. Show success toast

### Delete Flow

1. User click Trash button (🗑️)
2. Component lấy `currentPublicId` hoặc `uploadedPublicId`
3. Call API DELETE /upload/image/{publicId}
4. Clear preview và state
5. Trigger `onDeleteSuccess` callback
6. Show success toast

### Remove Local Preview Flow

1. User click X button (❌)
2. Clear preview và selected file
3. KHÔNG gọi API delete
4. Chỉ reset local state

## 📦 Dependencies

- `@tanstack/react-query`: State management cho async operations
- `axios`: HTTP client
- `sonner`: Toast notifications
- `lucide-react`: Icons (Upload, X, Trash2, Loader2, Image)
- `next/image`: Optimized image component

## 🎯 Use Cases

### Case 1: Upload ảnh mới (Add Page)

- User chọn file → Preview → Upload → Save URL

### Case 2: Thay thế ảnh (Edit Page)

- Hiển thị ảnh cũ
- User upload ảnh mới
- Ảnh mới thay thế trong form
- (Optional) Có thể delete ảnh cũ nếu cần

### Case 3: Xóa ảnh (Edit Page)

- User click Trash button
- Ảnh bị xóa khỏi Cloudinary
- Form field được clear

### Case 4: Hủy preview (Any Page)

- User click X button
- Preview biến mất
- Có thể chọn file khác
