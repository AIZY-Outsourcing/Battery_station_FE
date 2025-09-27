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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function NewSubscriptionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    duration: "",
    swapLimit: "",
    description: "",
    status: "active",
    hasUnlimitedSwaps: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create new subscription
    console.log("Creating new subscription:", formData);
    // Redirect back to subscriptions list
    router.push("/admin/users/subscriptions");
  };

  const handleCancel = () => {
    router.push("/admin/users/subscriptions");
  };

  const formatPrice = (value: string) => {
    const numValue = value.replace(/\D/g, "");
    return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            Tạo gói thuê pin mới
          </h1>
          <p className="text-muted-foreground">
            Thiết lập gói thuê pin với các thông số và giá cả phù hợp
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thông tin cơ bản
              </CardTitle>
              <CardDescription>Nhập tên và loại gói thuê pin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên gói *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="VD: Gói Unlimited Premium"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Loại gói *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại gói" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlimited">Không giới hạn</SelectItem>
                    <SelectItem value="limited">Giới hạn lượt</SelectItem>
                    <SelectItem value="period">Theo thời gian</SelectItem>
                    <SelectItem value="student">Sinh viên</SelectItem>
                    <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
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
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Duration */}
          <Card>
            <CardHeader>
              <CardTitle>Giá cả & Thời hạn</CardTitle>
              <CardDescription>
                Thiết lập giá và thời gian hiệu lực
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Giá gói (VNĐ) *</Label>
                <Input
                  id="price"
                  value={formatPrice(formData.price)}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="500,000"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Giá sẽ được hiển thị cho khách hàng
                </p>
              </div>

              <div>
                <Label htmlFor="duration">Thời hạn *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    handleInputChange("duration", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời hạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7_days">7 ngày</SelectItem>
                    <SelectItem value="1_month">1 tháng</SelectItem>
                    <SelectItem value="3_months">3 tháng</SelectItem>
                    <SelectItem value="6_months">6 tháng</SelectItem>
                    <SelectItem value="1_year">1 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="swapLimit">Giới hạn lượt đổi</Label>
                <Input
                  id="swapLimit"
                  type="number"
                  value={formData.swapLimit}
                  onChange={(e) =>
                    handleInputChange("swapLimit", e.target.value)
                  }
                  placeholder="10"
                  disabled={formData.type === "unlimited"}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Để trống nếu không giới hạn
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết gói</CardTitle>
            <CardDescription>Mô tả chi tiết về gói thuê pin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Mô tả gói *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về gói thuê pin, các ưu đãi và điều kiện sử dụng..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium">Tùy chọn bổ sung</h4>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="unlimited-swaps">
                    Đổi pin không giới hạn
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép khách hàng đổi pin không giới hạn số lần
                  </p>
                </div>
                <Switch
                  id="unlimited-swaps"
                  checked={formData.hasUnlimitedSwaps}
                  onCheckedChange={(checked) =>
                    handleInputChange("hasUnlimitedSwaps", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Xem trước gói</CardTitle>
            <CardDescription>
              Kiểm tra thông tin gói trước khi tạo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="text-lg font-semibold">
                {formData.name || "Tên gói"}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Giá: {formatPrice(formData.price) || "0"} VNĐ</span>
                <span>•</span>
                <span>
                  Thời hạn:{" "}
                  {formData.duration === "1_month"
                    ? "1 tháng"
                    : formData.duration === "3_months"
                    ? "3 tháng"
                    : formData.duration === "6_months"
                    ? "6 tháng"
                    : formData.duration === "1_year"
                    ? "1 năm"
                    : formData.duration === "7_days"
                    ? "7 ngày"
                    : "Chưa chọn"}
                </span>
                {formData.swapLimit && (
                  <>
                    <span>•</span>
                    <span>{formData.swapLimit} lượt đổi</span>
                  </>
                )}
              </div>
              <p className="text-sm">
                {formData.description || "Chưa có mô tả"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Tạo gói thuê
          </Button>
        </div>
      </form>
    </div>
  );
}
