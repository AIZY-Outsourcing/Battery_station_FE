import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Shield, Save, X } from "lucide-react";
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
  notes: "Nhân viên có kinh nghiệm làm việc lâu năm, đáng tin cậy.",
};

const availablePermissions = [
  { id: "station_management", label: "Quản lý trạm sạc" },
  { id: "user_management", label: "Quản lý người dùng" },
  { id: "battery_management", label: "Quản lý pin" },
  { id: "transaction_management", label: "Quản lý giao dịch" },
  { id: "report_access", label: "Truy cập báo cáo" },
  { id: "system_admin", label: "Quản trị hệ thống" },
  { id: "maintenance", label: "Bảo trì hệ thống" },
  { id: "customer_support", label: "Hỗ trợ khách hàng" },
];

export default function EditStaffPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/users/staff/${staffData.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa nhân viên - {staffData.name}
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin và quyền hạn của nhân viên
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Form thông tin cá nhân */}
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
                <Label htmlFor="id">Mã nhân viên</Label>
                <Input id="id" value={staffData.id} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select defaultValue={staffData.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                    <SelectItem value="supervisor">Giám sát</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" defaultValue={staffData.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select defaultValue={staffData.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Nghỉ phép</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={staffData.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" defaultValue={staffData.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" defaultValue={staffData.address} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                <Input
                  id="emergencyContact"
                  defaultValue={staffData.emergencyContact}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban</Label>
                <Input id="department" defaultValue={staffData.department} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Chức vụ</Label>
                <Input id="position" defaultValue={staffData.position} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workSchedule">Loại hình làm việc</Label>
                <Select defaultValue={staffData.workSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Toàn thời gian</SelectItem>
                    <SelectItem value="Part-time">Bán thời gian</SelectItem>
                    <SelectItem value="Contract">Hợp đồng</SelectItem>
                    <SelectItem value="Intern">Thực tập</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinedAt">Ngày bắt đầu</Label>
                <Input
                  id="joinedAt"
                  type="date"
                  defaultValue={staffData.joinedAt}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                defaultValue={staffData.notes}
                placeholder="Nhập ghi chú về nhân viên..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form mật khẩu */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu đăng nhập cho nhân viên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Phân quyền */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Phân quyền hệ thống
          </CardTitle>
          <CardDescription>
            Chọn các quyền truy cập và chức năng cho nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={permission.id}
                  defaultChecked={staffData.permissions.includes(permission.id)}
                />
                <Label
                  htmlFor={permission.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permission.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/admin/users/staff/${staffData.id}`}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Link>
        </Button>
        <Button variant="destructive" className="ml-auto">
          Xóa nhân viên
        </Button>
      </div>
    </main>
  );
}
