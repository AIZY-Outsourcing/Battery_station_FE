# Payment Transactions Management - Tính năng mới

## Tổng quan

Tính năng quản lý giao dịch thanh toán cho phép admin theo dõi và quản lý tất cả các giao dịch thanh toán của người dùng trong hệ thống.

## Các file đã được tạo/cập nhật

### 1. Types (TypeScript Interfaces)

**File:** `src/types/admin/payment-transaction.type.ts`

- Định nghĩa các interface cho Payment Transaction
- Bao gồm: PaymentTransaction, PaymentTransactionsParams, Response types, Request types
- Hỗ trợ các trạng thái: pending, completed, failed, refunded

### 2. Services (API Calls)

**File:** `src/services/admin/payment-transaction.service.ts`

- Các hàm gọi API:
  - `getPaymentTransactions()` - Lấy danh sách giao dịch
  - `getPaymentTransactionById()` - Lấy chi tiết giao dịch
  - `createPaymentTransaction()` - Tạo giao dịch mới
  - `updatePaymentTransaction()` - Cập nhật giao dịch
  - `deletePaymentTransaction()` - Xóa giao dịch

### 3. Hooks (React Query)

**File:** `src/hooks/admin/usePaymentTransactions.ts`

- Custom hooks sử dụng React Query:
  - `useGetPaymentTransactions` - Query danh sách
  - `useGetPaymentTransaction` - Query chi tiết
  - `useCreatePaymentTransaction` - Mutation tạo mới
  - `useUpdatePaymentTransaction` - Mutation cập nhật
  - `useDeletePaymentTransaction` - Mutation xóa

### 4. State Management (Zustand Store)

**File:** `src/stores/payment-transactions.store.ts`

- Quản lý state cho filters và query params:
  - Search term
  - Status filter
  - Payment method filter
  - Pagination (page, limit)
  - Sorting

### 5. UI Pages

#### Trang danh sách

**File:** `src/app/(admin)/admin/users/payments/page.tsx`

- Hiển thị danh sách giao dịch với:
  - Statistics cards (Tổng giao dịch, Doanh thu, TB/Giao dịch, Tỷ lệ thành công)
  - Search và filter (theo status, payment method)
  - Table với pagination
  - Quick status update
  - Recent transactions section

#### Trang chi tiết

**File:** `src/app/(admin)/admin/users/payments/[id]/page.tsx`

- Hiển thị thông tin chi tiết:
  - Thông tin giao dịch (ID, amount, payment method, status)
  - Thông tin người dùng
  - Thông tin gói thuê
  - Timeline (created, updated)
  - Links đến user profile và subscription package

### 6. Navigation

**File:** `src/components/admin/admin-sidebar.tsx` (đã cập nhật)

- Thêm menu item "Giao dịch thanh toán" vào section "Quản lý người dùng"

## Tính năng chính

### 1. Dashboard Statistics

- Tổng số giao dịch
- Tổng doanh thu (chỉ tính giao dịch completed)
- Giá trị trung bình mỗi giao dịch
- Tỷ lệ giao dịch thành công

### 2. Advanced Filtering

- Tìm kiếm theo: transaction ID, user email, user name
- Filter theo trạng thái giao dịch
- Filter theo phương thức thanh toán
- Pagination với tùy chọn số items/page

### 3. Status Management

- Inline status update từ table
- Visual status indicators với colors và icons
- 4 trạng thái: Pending, Completed, Failed, Refunded

### 4. Data Visualization

- Color-coded status badges
- Icons cho từng trạng thái
- Recent transactions preview
- Responsive grid layout

## Cách sử dụng

### Truy cập trang

1. Đăng nhập với tài khoản admin
2. Vào sidebar → "Quản lý người dùng" → "Giao dịch thanh toán"

### Xem danh sách giao dịch

- Tất cả giao dịch hiển thị trong table
- Sử dụng search box để tìm kiếm
- Chọn filter để lọc theo status hoặc payment method

### Xem chi tiết giao dịch

- Click vào icon "Eye" ở cột "Thao tác"
- Xem đầy đủ thông tin giao dịch, user, và subscription package

### Cập nhật trạng thái

- Từ trang danh sách, click vào dropdown status
- Chọn trạng thái mới
- Hệ thống tự động cập nhật và refresh data

## API Endpoints (cần backend hỗ trợ)

```
GET    /payment-transactions              - Lấy danh sách
GET    /payment-transactions/:id          - Lấy chi tiết
POST   /payment-transactions              - Tạo mới
PUT    /payment-transactions/:id          - Cập nhật
DELETE /payment-transactions/:id          - Xóa
```

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items/trang (default: 10)
- `search`: Tìm kiếm
- `status`: Filter theo trạng thái
- `payment_method`: Filter theo phương thức
- `sortBy`: Sắp xếp theo field
- `sortOrder`: asc/desc

## Tech Stack

- **React/Next.js** - Framework
- **TypeScript** - Type safety
- **React Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide Icons** - Icons

## Các điểm lưu ý

1. **Backend Integration**: Cần đảm bảo backend API endpoint `/payment-transactions` hoạt động đúng
2. **Relations**: API nên include relations (user, subscription_package) để hiển thị đầy đủ thông tin
3. **Permissions**: Chỉ admin mới có quyền truy cập trang này
4. **Real-time Updates**: Sử dụng React Query để tự động refetch sau khi update

## Mở rộng trong tương lai

- Export giao dịch ra Excel/PDF
- Thống kê chi tiết theo thời gian
- Biểu đồ doanh thu
- Email notifications cho giao dịch
- Refund workflow
- Integration với payment gateways (Stripe, PayPal, VNPay, etc.)
