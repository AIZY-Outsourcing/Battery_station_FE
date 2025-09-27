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
import { ArrowLeft, Battery, Save, Plus } from "lucide-react";

const availableStations = [
  { id: "ST001", name: "Trạm Quận 1" },
  { id: "ST002", name: "Trạm Cầu Giấy" },
  { id: "ST003", name: "Trạm Đà Nẵng" },
  { id: "ST004", name: "Trạm Bình Thạnh" },
  { id: "ST005", name: "Trạm Hà Đông" },
];

const batteryModels = [
  { value: "LiFePO4-72V", label: "LiFePO4 72V" },
  { value: "LiFePO4-60V", label: "LiFePO4 60V" },
  { value: "Li-ion-72V", label: "Li-ion 72V" },
  { value: "Li-ion-60V", label: "Li-ion 60V" },
];

const batteryCapacities = [
  { value: "15kWh", label: "15 kWh" },
  { value: "20kWh", label: "20 kWh" },
  { value: "25kWh", label: "25 kWh" },
  { value: "30kWh", label: "30 kWh" },
];

export default function NewBatteryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    batteryId: "",
    stationId: "",
    model: "",
    capacity: "",
    manufacturer: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    initialSoh: "100",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create new battery
    console.log("Creating new battery:", formData);
    // Redirect back to batteries list
    router.push("/admin/stations/batteries");
  };

  const handleCancel = () => {
    router.push("/admin/stations/batteries");
  };

  const generateBatteryId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    return `BT${timestamp}${randomNum}`;
  };

  const autoGenerateId = () => {
    handleInputChange("batteryId", generateBatteryId());
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
            Thêm pin mới vào hệ thống
          </h1>
          <p className="text-muted-foreground">
            Đăng ký pin mới và gán vào trạm đổi pin
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Battery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Thông tin pin
              </CardTitle>
              <CardDescription>Nhập thông tin cơ bản của pin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batteryId">Mã pin *</Label>
                <div className="flex gap-2">
                  <Input
                    id="batteryId"
                    value={formData.batteryId}
                    onChange={(e) =>
                      handleInputChange("batteryId", e.target.value)
                    }
                    placeholder="BT001"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={autoGenerateId}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Mã định danh duy nhất cho pin
                </p>
              </div>

              <div>
                <Label htmlFor="stationId">Trạm phụ trách *</Label>
                <Select
                  value={formData.stationId}
                  onValueChange={(value) =>
                    handleInputChange("stationId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model pin *</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => handleInputChange("model", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn model" />
                  </SelectTrigger>
                  <SelectContent>
                    {batteryModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="capacity">Dung lượng *</Label>
                <Select
                  value={formData.capacity}
                  onValueChange={(value) =>
                    handleInputChange("capacity", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dung lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    {batteryCapacities.map((capacity) => (
                      <SelectItem key={capacity.value} value={capacity.value}>
                        {capacity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết kỹ thuật</CardTitle>
              <CardDescription>
                Thông tin nhà sản xuất và bảo hành
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manufacturer">Nhà sản xuất *</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    handleInputChange("manufacturer", e.target.value)
                  }
                  placeholder="VD: CATL, BYD, Samsung SDI..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="serialNumber">Số serial</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    handleInputChange("serialNumber", e.target.value)
                  }
                  placeholder="Nhập số serial từ nhà sản xuất..."
                />
              </div>

              <div>
                <Label htmlFor="purchaseDate">Ngày mua *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    handleInputChange("purchaseDate", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="warrantyExpiry">Hết hạn bảo hành</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) =>
                    handleInputChange("warrantyExpiry", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="initialSoh">SoH ban đầu (%)</Label>
                <Input
                  id="initialSoh"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.initialSoh}
                  onChange={(e) =>
                    handleInputChange("initialSoh", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Thường là 100% đối với pin mới
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bổ sung</CardTitle>
            <CardDescription>Ghi chú và thông tin khác về pin</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Ghi chú về tình trạng pin, lịch sử sử dụng, hoặc thông tin khác..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt thông tin</CardTitle>
            <CardDescription>
              Kiểm tra lại thông tin pin trước khi thêm vào hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã pin:</span>
                  <span className="font-medium">
                    {formData.batteryId || "Chưa nhập"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạm:</span>
                  <span className="font-medium">
                    {availableStations.find((s) => s.id === formData.stationId)
                      ?.name || "Chưa chọn"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">
                    {formData.model || "Chưa chọn"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dung lượng:</span>
                  <span className="font-medium">
                    {formData.capacity || "Chưa chọn"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nhà sản xuất:</span>
                  <span className="font-medium">
                    {formData.manufacturer || "Chưa nhập"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SoH ban đầu:</span>
                  <span className="font-medium">{formData.initialSoh}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={
              !formData.batteryId ||
              !formData.stationId ||
              !formData.model ||
              !formData.capacity ||
              !formData.manufacturer
            }
          >
            <Save className="h-4 w-4 mr-2" />
            Thêm pin vào hệ thống
          </Button>
        </div>
      </form>
    </div>
  );
}
