"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, UserPlus, Save } from "lucide-react";

const availableStations = [
  { id: "ST001", name: "Trạm Quận 1" },
  { id: "ST002", name: "Trạm Cầu Giấy" },
  { id: "ST003", name: "Trạm Đà Nẵng" },
  { id: "ST004", name: "Trạm Bình Thạnh" },
  { id: "ST005", name: "Trạm Hà Đông" },
];

export default function NewStaffPage() {
  const router = useRouter();
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleStationChange = (stationId: string, checked: boolean) => {
    setSelectedStations((prev) =>
      checked ? [...prev, stationId] : prev.filter((id) => id !== stationId)
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create new staff
    console.log("Creating new staff:", {
      ...formData,
      stations: selectedStations,
    });
    // Redirect back to staff list
    router.push("/admin/users/staff");
  };

  const handleCancel = () => {
    router.push("/admin/users/staff");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm nhân viên mới
          </h1>
          <p className="text-muted-foreground">
            Tạo tài khoản nhân viên mới cho hệ thống
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản của nhân viên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập họ và tên..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@company.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0xxxxxxxxx"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Vai trò *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
              <CardDescription>
                Thiết lập mật khẩu đăng nhập cho nhân viên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Nhập lại mật khẩu..."
                  required
                />
              </div>

              {formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600">
                    Mật khẩu xác nhận không khớp
                  </p>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Station Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Phân công trạm làm việc</CardTitle>
            <CardDescription>
              Chọn các trạm mà nhân viên sẽ được phụ trách
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {availableStations.map((station) => (
                <div key={station.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={station.id}
                    checked={selectedStations.includes(station.id)}
                    onCheckedChange={(checked) =>
                      handleStationChange(station.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={station.id} className="text-sm">
                    {station.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedStations.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Chưa chọn trạm nào. Nhân viên sẽ không thể truy cập vào hệ
                thống.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={selectedStations.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Tạo nhân viên
          </Button>
        </div>
      </form>
    </div>
  );
}
