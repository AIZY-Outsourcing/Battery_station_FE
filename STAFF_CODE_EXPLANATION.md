# 📚 GIẢI THÍCH CHI TIẾT CODE STAFF

## 🗂️ CẤU TRÚC THƯ MỤC STAFF

```
src/
├── app/(staff)/                    # Next.js App Router - Staff routes
│   ├── layout.tsx                  # Root layout cho toàn bộ staff section
│   ├── station-select/             # Trang chọn trạm làm việc
│   └── staff/                      # Các trang chính của staff
│       ├── layout.tsx              # Layout wrapper cho staff pages
│       ├── page.tsx                # Redirect page
│       ├── dashboard/              # Trang tổng quan trạm
│       ├── inventory/              # Trang quản lý pin
│       ├── transactions/           # Trang quản lý giao dịch
│       ├── exchange/               # Trang đổi chéo pin
│       └── support/                # Trang hỗ trợ khách hàng
│
├── components/staff/               # UI Components dùng cho staff
│   ├── sidebar.tsx                 # Sidebar navigation
│   ├── top-bar.tsx                 # Top bar với search, notifications
│   ├── layout-wrapper.tsx          # Wrapper layout (sidebar + topbar)
│   └── staff-auth-wrapper.tsx      # Auth guard cho staff
│
├── hooks/staff/                    # Custom React Hooks
│   ├── useStationBatteries.ts      # Hook lấy danh sách pin của trạm
│   ├── useUpdateBatteryStatus.ts   # Hook cập nhật trạng thái pin
│   ├── useBatteryStatusLogs.ts     # Hook lấy lịch sử trạng thái pin
│   ├── useTransactions.ts          # Hook quản lý giao dịch
│   ├── useBatteryMovements.ts      # Hook quản lý đổi chéo pin
│   ├── useSupportTickets.ts        # Hook quản lý ticket hỗ trợ
│   └── useStaffStations.ts         # Hook lấy danh sách trạm của staff
│
├── services/staff/                 # API Services
│   ├── battery.service.ts          # API calls liên quan đến pin
│   ├── transaction.service.ts      # API calls liên quan đến giao dịch
│   ├── battery-movement.service.ts # API calls đổi chéo pin
│   ├── support.service.ts          # API calls ticket hỗ trợ
│   └── station.service.ts          # API calls trạm
│
└── types/staff/                    # TypeScript Type Definitions
    ├── battery.type.ts             # Types cho pin
    ├── transaction.type.ts         # Types cho giao dịch
    ├── battery-movement.type.ts    # Types cho đổi chéo pin
    ├── support.type.ts             # Types cho ticket hỗ trợ
    └── station.type.ts             # Types cho trạm
```

---

## 📄 CHI TIẾT TỪNG FILE

### 🎯 1. APP ROUTES (src/app/(staff)/)

#### 1.1. `layout.tsx` - Root Layout
**Chức năng:**
- Layout gốc cho toàn bộ staff section
- Bọc tất cả staff pages bằng `StaffAuthWrapper` để kiểm tra quyền truy cập
- Áp dụng font Inter cho toàn bộ section

**Code chính:**
```typescript
<StaffAuthWrapper>{children}</StaffAuthWrapper>
```

---

#### 1.2. `station-select/page.tsx` - Trang Chọn Trạm
**Chức năng:**
- Hiển thị danh sách các trạm mà staff được phân công
- Cho phép staff chọn trạm để làm việc
- Lưu thông tin trạm đã chọn vào `localStorage`
- Redirect đến dashboard sau khi chọn

**Luồng hoạt động:**
1. Fetch danh sách trạm từ API (`useStaffStations`)
2. Hiển thị danh sách trạm dạng card
3. Staff click chọn trạm
4. Lưu vào `localStorage` với key `"selectedStation"`
5. Redirect đến `/staff/dashboard`

**Key Features:**
- Hiển thị trạng thái trạm (Hoạt động/Bảo trì/Không hoạt động)
- Hiển thị địa chỉ, thành phố
- Loading state khi fetch data
- Error handling

---

#### 1.3. `staff/layout.tsx` - Staff Business Layout
**Chức năng:**
- Layout wrapper cho các trang staff (dashboard, inventory, transactions, etc.)
- Bọc children bằng `StaffLayoutWrapper` (có sidebar + topbar)

**Code:**
```typescript
<StaffLayoutWrapper>{children}</StaffLayoutWrapper>
```

---

#### 1.4. `staff/dashboard/page.tsx` - Trang Tổng Quan
**Chức năng:**
- Hiển thị tổng quan trạm đang làm việc
- Hiển thị thống kê pin (Tổng, Khả dụng, Đang dùng, Đang sạc, Đặt trước, Cần bảo trì, Hỏng)
- Hiển thị giao dịch gần đây (chỉ hiển thị giao dịch hoàn thành)
- Hiển thị yêu cầu đổi chéo pin gần đây

**Data Sources:**
- `useStationBatteries` - Lấy danh sách pin của trạm
- `useStaffTransactions` - Lấy giao dịch gần đây
- `useBatteryMovements` - Lấy yêu cầu đổi chéo pin

**Layout:**
- Row 1: 3 cards (Tổng, Khả dụng, Đang dùng)
- Row 2: 4 cards (Đang sạc, Đặt trước, Cần bảo trì, Hỏng)
- Row 3: 2 columns (Giao dịch gần đây, Yêu cầu đổi chéo pin)

**Key Features:**
- Real-time data từ API
- Auto-refresh khi đổi trạm
- Loading states
- Error handling

---

#### 1.5. `staff/inventory/page.tsx` - Trang Quản Lý Pin
**Chức năng:**
- Hiển thị danh sách pin trong trạm
- Lọc pin theo trạng thái (Tất cả, Khả dụng, Đang sạc, Đang dùng, Đặt trước, Cần bảo trì, Hỏng)
- Tìm kiếm pin
- Cập nhật trạng thái pin
- Xem chi tiết pin (thông tin + lịch sử trạng thái)

**Key Features:**
- **Filter tabs:** Tất cả, Khả dụng, Đang sạc, Đang dùng, Đặt trước, Cần bảo trì, Hỏng
- **Search:** Tìm kiếm theo tên, serial number
- **Update Status:** Dropdown để đổi trạng thái pin (có note)
- **Detail Dialog:** 
  - Hiển thị thông tin chi tiết pin
  - Hiển thị lịch sử thay đổi trạng thái (từ API `/battery-status-logs/{battery_id}`)
- **Refresh Button:** Làm mới danh sách pin
- **Card Layout:** Buttons luôn ở bottom (dùng flexbox)

**Data Flow:**
1. Fetch pin từ `useStationBatteries(stationId)`
2. Filter client-side theo status
3. Update status qua `useUpdateBatteryStatus`
4. Fetch status logs qua `useBatteryStatusLogs(batteryId)`

---

#### 1.6. `staff/transactions/page.tsx` - Trang Giao Dịch
**Chức năng:**
- Hiển thị danh sách giao dịch của trạm
- Lọc theo trạng thái (Tất cả, Đang xử lý, Hoàn thành, Thất bại, Đã hủy)
- Tìm kiếm giao dịch
- Xem chi tiết giao dịch
- Hiển thị thống kê (tổng số giao dịch theo từng trạng thái)

**Key Features:**
- **Filter Tabs:** Tất cả, Đang xử lý, Hoàn thành, Thất bại, Đã hủy
- **In Progress Filter:** Client-side filter (vì API không support multiple statuses)
- **Search:** Tìm kiếm theo tên khách hàng, ID giao dịch
- **Detail Dialog:** Hiển thị đầy đủ thông tin giao dịch
- **Stats:** Hiển thị số lượng giao dịch theo từng trạng thái
- **Refresh Button:** Làm mới danh sách
- **Auto-refresh:** Tự động refresh mỗi 30 giây

**Data Sources:**
- `useStaffTransactions` - Lấy danh sách giao dịch
- `useStaffStats` - Lấy thống kê giao dịch
- `useTransactionDetail` - Lấy chi tiết giao dịch

**Special Logic:**
- Tab "Đang xử lý" filter client-side các status: `PENDING`, `PROCESSING`, `CONFIRMED`
- Fetch 100 records khi chọn tab "Đang xử lý" để có đủ data filter

---

#### 1.7. `staff/exchange/page.tsx` - Trang Đổi Chéo Pin
**Chức năng:**
- Hiển thị danh sách yêu cầu đổi chéo pin giữa các trạm
- Lọc theo trạng thái (Tất cả, Chờ xác nhận, Đã xác nhận, Hoàn thành)
- Xem chi tiết yêu cầu
- Xác nhận yêu cầu đổi chéo pin (chỉ cho status PENDING)

**Key Features:**
- **Filter Tabs:** Tất cả, Chờ xác nhận, Đã xác nhận, Hoàn thành
- **Detail Dialog:** 
  - Hiển thị thông tin trạm nguồn, trạm đích
  - Số lượng pin
  - Trạng thái yêu cầu
- **Confirm Button:** 
  - Chỉ hiển thị khi status = PENDING
  - Có confirmation dialog trước khi xác nhận
- **Auto-refresh:** Tự động refresh mỗi 30 giây

**Data Sources:**
- `useBatteryMovements` - Lấy danh sách yêu cầu
- `useConfirmSubRequest` - Mutation để xác nhận yêu cầu

**Filter Logic:**
- Chỉ hiển thị các sub-requests (có `parent_request_id`)
- Chỉ hiển thị requests liên quan đến trạm hiện tại (from_station hoặc to_station)

---

#### 1.8. `staff/support/page.tsx` - Trang Hỗ Trợ
**Chức năng:**
- Hiển thị danh sách ticket hỗ trợ
- Lọc theo trạng thái (Tất cả, Mới, Đang xử lý, Đã giải quyết, Đã đóng)
- Tìm kiếm ticket
- Xem chi tiết ticket

**Key Features:**
- **Filter Tabs:** Tất cả, Mới, Đang xử lý, Đã giải quyết, Đã đóng
- **Search:** Tìm kiếm theo tiêu đề, nội dung
- **Detail Dialog:** 
  - Hiển thị đầy đủ thông tin ticket
  - Thông tin khách hàng
  - Lịch sử xử lý
- **Refresh Button:** Làm mới danh sách
- **Badge Count:** Hiển thị số ticket mới trên sidebar

**Data Sources:**
- `useSupportTickets` - Lấy danh sách ticket

---

### 🧩 2. COMPONENTS (src/components/staff/)

#### 2.1. `sidebar.tsx` - Sidebar Navigation
**Chức năng:**
- Hiển thị menu navigation bên trái
- Cho phép chọn trạm làm việc
- Hiển thị số lượng ticket mới (badge)
- Logout button

**Menu Items:**
1. Tổng quan (`/staff/dashboard`)
2. Quản lý Pin (`/staff/inventory`)
3. Giao dịch (`/staff/transactions`)
4. Đổi chéo pin (`/staff/exchange`)
5. Hỗ trợ (`/staff/support`) - có badge nếu có ticket mới

**Key Features:**
- **Station Selector:** 
  - Popover để chọn trạm
  - Lưu vào localStorage
  - Dispatch event `stationChanged` để notify các components khác
  - Invalidate queries để refresh data
- **Active State:** Highlight menu item đang active
- **Mobile Support:** Có thể dùng trên mobile (qua Sheet component)

**Data Sources:**
- `useStaffStations` - Lấy danh sách trạm
- `useSupportTickets` - Lấy số lượng ticket để hiển thị badge

---

#### 2.2. `top-bar.tsx` - Top Bar
**Chức năng:**
- Hiển thị header bar phía trên
- Search box (placeholder)
- Notifications icon (với badge)
- User menu (Profile, Settings, Logout)
- Mobile menu trigger

**Key Features:**
- **Search:** Input search (chưa implement logic)
- **Notifications:** Bell icon với badge số lượng
- **User Menu:** Dropdown với các options
- **Mobile Menu:** Button để mở sidebar trên mobile

---

#### 2.3. `layout-wrapper.tsx` - Layout Wrapper
**Chức năng:**
- Wrapper component kết hợp Sidebar + TopBar + Main Content
- Layout structure: Sidebar bên trái, TopBar + Content bên phải

**Structure:**
```
<div className="flex h-screen">
  <StaffSidebar />          {/* Left sidebar */}
  <div className="flex-1">
    <StaffTopBar />         {/* Top bar */}
    <main>{children}</main> {/* Page content */}
  </div>
</div>
```

---

#### 2.4. `staff-auth-wrapper.tsx` - Auth Guard
**Chức năng:**
- Bảo vệ staff routes - chỉ cho phép staff/admin truy cập
- Redirect đến `/login` nếu chưa đăng nhập
- Redirect đến `/unauthorize` nếu không phải staff/admin
- Hiển thị loading spinner khi đang check auth

**Logic:**
1. Check `accessToken` và `user` từ `authStore`
2. Nếu không có → redirect `/login`
3. Nếu `user.role !== "staff" && user.role !== "admin"` → redirect `/unauthorize`
4. Nếu hợp lệ → render children

**Key Features:**
- Client-side only (dùng `useEffect` với `isMounted` check)
- Loading state trong khi check
- Delay 100ms để tránh flash và conflict với Next.js routing

---

### 🎣 3. HOOKS (src/hooks/staff/)

#### 3.1. `useStationBatteries.ts`
**Chức năng:**
- Hook để fetch danh sách pin của một trạm
- Sử dụng React Query để cache và manage state

**Parameters:**
- `stationId: string` - ID của trạm
- `params?: BatteriesQueryParams` - Query params (page, limit, sortBy, sortOrder)

**Returns:**
- `{ data, isLoading, error }` từ React Query

**Query Key:**
```typescript
["station-batteries", stationId, params]
```

**Features:**
- Auto-disable nếu không có `stationId`
- No cache (`staleTime: 0, cacheTime: 0`) để luôn fetch fresh data

---

#### 3.2. `useUpdateBatteryStatus.ts`
**Chức năng:**
- Hook để cập nhật trạng thái pin
- Mutation hook (sử dụng `useMutation`)

**Parameters:**
- `batteryId: string` - ID của pin
- `data: UpdateBatteryStatusRequest` - Data update (status, note)

**Returns:**
- Mutation object với `mutate`, `mutateAsync`, `isPending`, etc.

**On Success:**
- Invalidate `["station-batteries"]` queries để refresh list
- Show success toast

**On Error:**
- Show error toast

---

#### 3.3. `useBatteryStatusLogs.ts`
**Chức năng:**
- Hook để fetch lịch sử thay đổi trạng thái pin

**Parameters:**
- `batteryId: string` - ID của pin

**Returns:**
- `{ data, isLoading, error }` từ React Query

**Query Key:**
```typescript
["battery-status-logs", batteryId]
```

**Features:**
- Auto-disable nếu không có `batteryId`
- No cache để luôn fetch fresh data

---

#### 3.4. `useTransactions.ts`
**Chức năng:**
- Hook để fetch giao dịch của staff
- Hook để fetch thống kê giao dịch
- Hook để fetch chi tiết giao dịch

**Exports:**
1. `useStaffTransactions(filters?)` - Lấy danh sách giao dịch
2. `useStaffStats(station_id?)` - Lấy thống kê
3. `useTransactionDetail(id)` - Lấy chi tiết

**Features:**
- Auto-refresh mỗi 30 giây (`refetchInterval: 30000`)
- Support filters (page, limit, status, station_id)

---

#### 3.5. `useBatteryMovements.ts`
**Chức năng:**
- Hook để quản lý đổi chéo pin (battery movements)
- Bao gồm queries và mutations

**Exports:**
1. `useBatteryMovements(filters?, station_id?)` - Lấy danh sách
2. `useBatteryMovementDetail(id)` - Lấy chi tiết
3. `useStationBatteries(stationId, filters?)` - Lấy pin của trạm
4. `useCreateBatteryMovement()` - Tạo yêu cầu mới
5. `useConfirmSubRequest()` - Staff xác nhận sub-request
6. `useExecuteMovement()` - Admin thực thi movement
7. `useUpdateBatteryMovement()` - Cập nhật yêu cầu
8. `useDeleteBatteryMovement()` - Xóa yêu cầu

**Features:**
- Auto-refresh mỗi 30 giây
- Toast notifications cho mutations
- Auto-invalidate queries sau mutations

---

#### 3.6. `useSupportTickets.ts`
**Chức năng:**
- Hook để fetch danh sách ticket hỗ trợ

**Parameters:**
- Filters (page, limit, status, search)

**Returns:**
- `{ data, isLoading, error }` từ React Query

---

#### 3.7. `useStaffStations.ts`
**Chức năng:**
- Hook để fetch danh sách trạm mà staff được phân công

**Returns:**
- `{ data, isLoading, error }` - Array of stations

---

### 🔌 4. SERVICES (src/services/staff/)

#### 4.1. `battery.service.ts`
**Chức năng:**
- API service cho các operations liên quan đến pin

**Functions:**
1. `getStationBatteries(stationId, params?)`
   - GET `/batteries/station/{stationId}`
   - Convert response từ object sang array
   - Return `{ batteries, total, page, limit, totalPages }`

2. `updateBatteryStatus(batteryId, data)`
   - PUT `/batteries/{batteryId}/status`
   - Update status và note

3. `getBatteryStatusLogs(batteryId)`
   - GET `/battery-status-logs/{batteryId}`
   - Lấy lịch sử thay đổi trạng thái

---

#### 4.2. `transaction.service.ts`
**Chức năng:**
- API service cho giao dịch

**Exports:**
- `swapTransactionAPI` object với các methods:
  1. `getStaffTransactions(filters?)` - GET `/swap-transactions/staff/{station_id}`
  2. `getStaffStats(station_id)` - GET `/swap-transactions/staff/stats/{station_id}`
  3. `getTransactionDetail(id)` - GET `/swap-transactions/{id}`

---

#### 4.3. `battery-movement.service.ts`
**Chức năng:**
- API service cho đổi chéo pin

**Functions:**
- `getAllMovements(filters?, station_id?)`
- `getMovementById(id)`
- `getStationBatteries(stationId, filters?)`
- `createMovement(data)`
- `confirmSubRequest(subRequestId, station_id?)`
- `executeMovement(parentRequestId)`
- `updateMovement(id, data)`
- `deleteMovement(id)`

---

#### 4.4. `support.service.ts`
**Chức năng:**
- API service cho ticket hỗ trợ

**Functions:**
- `getSupportTickets(filters?)`
- `getTicketDetail(id)`
- `updateTicketStatus(id, status)`
- etc.

---

#### 4.5. `station.service.ts`
**Chức năng:**
- API service cho trạm

**Functions:**
- `getStaffStations()` - Lấy danh sách trạm của staff

---

### 📝 5. TYPES (src/types/staff/)

#### 5.1. `battery.type.ts`
**Types:**
- `Battery` - Interface cho pin
- `BatteriesListResponse` - Response từ API
- `BatteriesQueryParams` - Query params
- `UpdateBatteryStatusRequest` - Request body để update status
- `BatteryUpdateResponse` - Response sau khi update
- `BatteryStatusLog` - Interface cho log trạng thái
- `BatteryStatusLogsResponse` - Response từ API logs

**Battery Status:**
```typescript
"available" | "charging" | "maintenance" | "damaged" | "in_use" | "reserved"
```

---

#### 5.2. `transaction.type.ts`
**Types:**
- `SwapTransaction` - Interface cho giao dịch
- `TransactionStatus` - Enum các trạng thái
- `TransactionFilters` - Filters cho query
- `PaginatedTransactions` - Paginated response
- `TransactionStats` - Thống kê giao dịch

**Transaction Status:**
```typescript
PENDING | PROCESSING | CONFIRMED | COMPLETED | FAILED | CANCELLED
```

---

#### 5.3. `battery-movement.type.ts`
**Types:**
- `BatteryMovement` - Interface cho yêu cầu đổi chéo pin
- `BatteryMovementStatus` - Enum trạng thái
- `BatteryMovementFilters` - Filters
- `CreateBatteryMovementRequest` - Request body
- `UpdateBatteryMovementRequest` - Update request

**Status:**
```typescript
PENDING | APPROVED | COMPLETED | CANCELLED
```

---

#### 5.4. `support.type.ts`
**Types:**
- `SupportTicket` - Interface cho ticket
- `TicketStatus` - Enum trạng thái
- `SupportTicketFilters` - Filters

---

#### 5.5. `station.type.ts`
**Types:**
- `StaffStation` - Interface cho trạm của staff

---

## 🔄 DATA FLOW

### Luồng dữ liệu khi Staff đăng nhập:

1. **Login** → Lưu token vào `authStore`
2. **StaffAuthWrapper** → Check role, nếu hợp lệ → render
3. **Station Select** → Chọn trạm → Lưu vào `localStorage`
4. **Dashboard/Pages** → Fetch data từ API dựa trên `selectedStation`
5. **Sidebar** → Listen event `stationChanged` → Refresh data

### Luồng cập nhật trạng thái pin:

1. Staff chọn pin → Click "Cập nhật trạng thái"
2. Chọn status mới + nhập note (optional)
3. Call `useUpdateBatteryStatus().mutate()`
4. API PUT `/batteries/{id}/status`
5. On success → Invalidate `["station-batteries"]` queries
6. Auto-refetch → UI update

### Luồng xác nhận đổi chéo pin:

1. Staff xem danh sách yêu cầu → Click "Chi tiết"
2. Xem thông tin → Click "Xác nhận" (nếu status = PENDING)
3. Confirm dialog → Click "Xác nhận"
4. Call `useConfirmSubRequest().mutate()`
5. API POST `/battery-movements/{id}/confirm`
6. On success → Invalidate queries → Refresh list

---

## 🎯 KEY PATTERNS

### 1. **Station Selection Pattern**
- Lưu vào `localStorage` với key `"selectedStation"`
- Dispatch custom event `stationChanged` để notify
- Invalidate queries để refresh data
- Router refresh để reload page

### 2. **Filter Pattern**
- Client-side filtering cho complex filters (như "Đang xử lý")
- Server-side filtering cho simple filters (như status đơn)
- Fetch nhiều data hơn nếu cần filter client-side

### 3. **Auto-refresh Pattern**
- Dùng `refetchInterval` trong React Query
- 30 giây cho transactions và movements
- Manual refresh button cho user control

### 4. **Dialog Pattern**
- Detail dialogs cho xem chi tiết
- Confirmation dialogs cho actions quan trọng
- Form dialogs cho input data

### 5. **Loading States**
- Loading spinner khi fetch data
- Skeleton loaders (nếu có)
- Disable buttons khi đang process

### 6. **Error Handling**
- Try-catch trong services
- Error states trong components
- Toast notifications cho user feedback

---

## 🚀 BEST PRACTICES

1. **Separation of Concerns:**
   - Pages: UI logic
   - Hooks: Data fetching logic
   - Services: API calls
   - Types: Type definitions

2. **React Query:**
   - Use query keys consistently
   - Invalidate related queries after mutations
   - Use `enabled` để control khi nào fetch

3. **State Management:**
   - Local state cho UI (useState)
   - Zustand cho global state (auth, selected station)
   - React Query cho server state

4. **Type Safety:**
   - Define types cho tất cả API responses
   - Use TypeScript strict mode
   - Type all function parameters và returns

5. **Performance:**
   - Memoize expensive computations (useMemo)
   - Lazy load components nếu cần
   - Optimize re-renders với React.memo nếu cần

---

*Tài liệu này giải thích chi tiết toàn bộ code của phần Staff trong dự án Battery Station Frontend*

