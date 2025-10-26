import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Battery, Save, X } from "lucide-react";
import Link from "next/link";

// Mock data - trong thực tế sẽ fetch từ API theo ID
const batteryData = {
  id: "BAT001",
  serialNumber: "VF8-LFP-001",
  type: "LiFePO4",
  capacity: "72V 50Ah",
  manufacturer: "CATL",
  stationId: "ST001",
  status: "available",
  batteryLevel: 95,
  cycleCount: 1250,
  maxCycles: 3000,
  manufacturingDate: "2024-01-15",
  lastMaintenance: "2024-10-01",
  nextMaintenance: "2025-01-01",
  temperature: 28,
  voltage: 71.8,
  health: "excellent",
  notes: "Pin hoạt động bình thường, không có vấn đề gì đặc biệt.",
};

const stations = [
  { id: "ST001", name: "Trạm Quận 1" },
  { id: "ST002", name: "Trạm Cầu Giấy" },
  { id: "ST003", name: "Trạm Đà Nẵng" },
  { id: "ST004", name: "Trạm Bình Thạnh" },
];

export default function EditBatteryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/stations/batteries/${batteryData.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa pin #{batteryData.id}
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin và trạng thái của pin
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Form chỉnh sửa */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Thông tin pin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">Mã pin</Label>
                <Input id="id" value={batteryData.id} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Số serial</Label>
                <Input
                  id="serialNumber"
                  defaultValue={batteryData.serialNumber}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại pin</Label>
                <Select defaultValue={batteryData.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LiFePO4">LiFePO4</SelectItem>
                    <SelectItem value="Li-ion">Li-ion</SelectItem>
                    <SelectItem value="Lead Acid">Lead Acid</SelectItem>
                    <SelectItem value="NiMH">NiMH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Dung lượng</Label>
                <Input id="capacity" defaultValue={batteryData.capacity} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                <Input
                  id="manufacturer"
                  defaultValue={batteryData.manufacturer}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select defaultValue={batteryData.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Khả dụng</SelectItem>
                    <SelectItem value="charging">Đang sạc</SelectItem>
                    <SelectItem value="in-use">Đang sử dụng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="decommissioned">
                      Ngừng hoạt động
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="station">Trạm đổi pin</Label>
              <Select defaultValue={batteryData.stationId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name} ({station.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                defaultValue={batteryData.notes}
                placeholder="Nhập ghi chú về pin..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông số kỹ thuật */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batteryLevel">Mức pin (%)</Label>
                <Input
                  id="batteryLevel"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={batteryData.batteryLevel}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voltage">Điện áp (V)</Label>
                <Input
                  id="voltage"
                  type="number"
                  step="0.1"
                  defaultValue={batteryData.voltage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Nhiệt độ (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  defaultValue={batteryData.temperature}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="health">Sức khỏe pin</Label>
                <Select defaultValue={batteryData.health}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Tuyệt vời</SelectItem>
                    <SelectItem value="good">Tốt</SelectItem>
                    <SelectItem value="fair">Trung bình</SelectItem>
                    <SelectItem value="poor">Kém</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chu kỳ sử dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycleCount">Chu kỳ hiện tại</Label>
                <Input
                  id="cycleCount"
                  type="number"
                  defaultValue={batteryData.cycleCount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCycles">Chu kỳ tối đa</Label>
                <Input
                  id="maxCycles"
                  type="number"
                  defaultValue={batteryData.maxCycles}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lịch sử bảo trì */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch trình bảo trì</CardTitle>
          <CardDescription>
            Cập nhật thông tin bảo trì và kiểm tra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Ngày sản xuất</Label>
              <Input
                id="manufacturingDate"
                type="date"
                defaultValue={batteryData.manufacturingDate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastMaintenance">Bảo trì cuối</Label>
              <Input
                id="lastMaintenance"
                type="date"
                defaultValue={batteryData.lastMaintenance}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextMaintenance">Bảo trì tiếp theo</Label>
              <Input
                id="nextMaintenance"
                type="date"
                defaultValue={batteryData.nextMaintenance}
              />
            </div>
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
          <Link href={`/admin/stations/batteries/${batteryData.id}`}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Link>
        </Button>
      </div>
    </main>
  );
}
