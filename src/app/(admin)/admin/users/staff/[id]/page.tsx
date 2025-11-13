import { use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Settings,
} from "lucide-react";
import Link from "next/link";

// Mock data - trong thực tế sẽ fetch từ API theo ID
const staffData = {
  id: "STF001",
  name: "Admin Nguyễn",
  email: "admin@enerzy.com",
  phone: "0987654321",
  role: "admin",
  status: "active",
  joinedAt: "2024-01-01",
  lastLogin: "2024-10-26 09:30",
  address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
  emergencyContact: "0901234567",
  department: "Quản lý hệ thống",
  position: "Quản trị viên hệ thống",
  workSchedule: "Full-time",
  permissions: [
    "station_management",
    "user_management",
    "report_access",
    "system_admin",
  ],
};

const permissionLabels = {
  station_management: "Quản lý trạm",
  user_management: "Quản lý người dùng",
  report_access: "Truy cập báo cáo",
  system_admin: "Quản trị hệ thống",
  battery_management: "Quản lý pin",
  transaction_management: "Quản lý giao dịch",
};

export default function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Hoạt động</Badge>;
      case "inactive":
        return <Badge variant="secondary">Nghỉ phép</Badge>;
      case "suspended":
        return <Badge variant="destructive">Tạm khóa</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Quản trị viên</Badge>;
      case "staff":
        return <Badge variant="default">Nhân viên</Badge>;
      case "supervisor":
        return <Badge className="bg-blue-100 text-blue-800">Giám sát</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết nhân viên - {staffData.name}
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và quyền hạn của nhân viên
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/users/staff/${staffData.id}/edit`}>
            <Settings className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Thông tin cơ bản */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Mã nhân viên
                </label>
                <p className="text-lg font-semibold">{staffData.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Vai trò
                </label>
                <div>{getRoleBadge(staffData.role)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Họ và tên
                </label>
                <p className="text-lg">{staffData.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </label>
                <div>{getStatusBadge(staffData.status)}</div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p>{staffData.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </label>
                <p>{staffData.phone}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Địa chỉ
                </label>
                <p>{staffData.address}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Liên hệ khẩn cấp
                </label>
                <p>{staffData.emergencyContact}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Phòng ban
                </label>
                <p>{staffData.department}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Chức vụ
                </label>
                <p>{staffData.position}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Loại hình làm việc
                </label>
                <p>{staffData.workSchedule}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ngày bắt đầu
                </label>
                <p>
                  {new Date(staffData.joinedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin hoạt động */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Đăng nhập cuối
                </label>
                <p className="text-lg font-semibold text-green-600">
                  {staffData.lastLogin}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Thời gian làm việc
                </label>
                <p className="text-lg font-semibold">
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(staffData.joinedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  ngày
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quyền hạn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quyền hạn và phân quyền
          </CardTitle>
          <CardDescription>
            Các quyền truy cập và chức năng được phân cho nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {staffData.permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-2 p-3 border rounded-lg"
              >
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  {permissionLabels[
                    permission as keyof typeof permissionLabels
                  ] || permission}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
