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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface StationFormData {
  name: string;
  location: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  totalSlots: number;
  description: string;
  operatingHours: {
    open: string;
    close: string;
  };
  status: "active" | "inactive" | "maintenance";
}

export default function AddStationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<StationFormData>({
    name: "",
    location: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    totalSlots: 20,
    description: "",
    operatingHours: {
      open: "06:00",
      close: "22:00",
    },
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof StationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOperatingHoursChange = (
    field: "open" | "close",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, would call: await createStation(formData)
      console.log("Creating station:", formData);

      // Redirect back to stations list
      router.push("/admin/stations");
    } catch (error) {
      console.error("Error creating station:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/stations">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm trạm đổi pin mới
          </h1>
          <p className="text-muted-foreground">
            Tạo một trạm đổi pin mới trong hệ thống
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Thông tin chi tiết về trạm đổi pin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên trạm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ví dụ: Trạm Quận 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Vị trí ngắn gọn *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Ví dụ: Ngã tư Lê Lợi - Nguyễn Huệ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSlots">Số ngăn pin *</Label>
                <Input
                  id="totalSlots"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.totalSlots}
                  onChange={(e) =>
                    handleInputChange("totalSlots", parseInt(e.target.value))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Địa chỉ */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ chi tiết</CardTitle>
              <CardDescription>
                Thông tin địa chỉ đầy đủ của trạm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Số nhà, tên đường"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    placeholder="Phường 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    placeholder="Quận 1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="TP. Hồ Chí Minh"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Giờ mở cửa</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={formData.operatingHours.open}
                    onChange={(e) =>
                      handleOperatingHoursChange("open", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={formData.operatingHours.close}
                    onChange={(e) =>
                      handleOperatingHoursChange("close", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mô tả */}
        <Card>
          <CardHeader>
            <CardTitle>Mô tả</CardTitle>
            <CardDescription>
              Thêm thông tin mô tả cho trạm (tùy chọn)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Mô tả về vị trí, đặc điểm của trạm..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/stations">Hủy</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Đang tạo..." : "Tạo trạm"}
          </Button>
        </div>
      </form>
    </main>
  );
}
