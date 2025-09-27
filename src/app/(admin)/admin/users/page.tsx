export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tổng số trạm</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Người dùng hoạt động
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% từ tháng trước</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Doanh thu tháng
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">₫24.5M</div>
            <p className="text-xs text-muted-foreground">+15% từ tháng trước</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Pin hoạt động
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+2% từ tuần trước</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium">Biểu đồ hoạt động</h3>
            <div className="mt-4 h-64 flex items-center justify-center text-muted-foreground">
              [Biểu đồ sẽ được thêm vào đây]
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium">Hoạt động gần đây</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Trạm mới được thêm</p>
                  <p className="text-xs text-muted-foreground">2 phút trước</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pin được thay thế</p>
                  <p className="text-xs text-muted-foreground">5 phút trước</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cảnh báo bảo trì</p>
                  <p className="text-xs text-muted-foreground">10 phút trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
