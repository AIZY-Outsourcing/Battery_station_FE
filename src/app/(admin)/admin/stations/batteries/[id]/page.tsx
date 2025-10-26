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
  Battery,
  Calendar,
  MapPin,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Mock data - trong thực tế sẽ fetch từ API theo ID
const batteryData = {
  id: "BAT001",
  serialNumber: "VF8-LFP-001",
  type: "LiFePO4",
  capacity: "72V 50Ah",
  manufacturer: "CATL",
  stationId: "ST001",
  stationName: "Trạm Quận 1",
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
};

export default function BatteryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="default">Khả dụng</Badge>;
      case "charging":
        return <Badge variant="secondary">Đang sạc</Badge>;
      case "in-use":
        return (
          <Badge className="bg-blue-100 text-blue-800">Đang sử dụng</Badge>
        );
      case "maintenance":
        return <Badge variant="destructive">Bảo trì</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "excellent":
        return <Badge variant="default">Tuyệt vời</Badge>;
      case "good":
        return <Badge className="bg-green-100 text-green-800">Tốt</Badge>;
      case "fair":
        return <Badge variant="secondary">Trung bình</Badge>;
      case "poor":
        return <Badge variant="destructive">Kém</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getBatteryLevelColor = (level: number) => {
    if (level >= 80) return "text-green-600";
    if (level >= 50) return "text-yellow-600";
    if (level >= 20) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/stations/batteries">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết pin #{batteryData.id}
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và trạng thái của pin
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/stations/batteries/${batteryData.id}/edit`}>
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
              <Battery className="h-5 w-5" />
              Thông tin pin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Mã pin
                </label>
                <p className="text-lg font-semibold">{batteryData.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Số serial
                </label>
                <p className="text-lg">{batteryData.serialNumber}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Loại pin
                </label>
                <p>{batteryData.type}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Dung lượng
                </label>
                <p>{batteryData.capacity}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nhà sản xuất
                </label>
                <p>{batteryData.manufacturer}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </label>
                <div>{getStatusBadge(batteryData.status)}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Vị trí
              </label>
              <p>
                {batteryData.stationName} ({batteryData.stationId})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trạng thái pin */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Trạng thái pin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Mức pin
                </label>
                <p
                  className={`text-2xl font-bold ${getBatteryLevelColor(
                    batteryData.batteryLevel
                  )}`}
                >
                  {batteryData.batteryLevel}%
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Điện áp
                </label>
                <p className="text-xl font-semibold">{batteryData.voltage}V</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nhiệt độ
                </label>
                <p className="text-xl font-semibold">
                  {batteryData.temperature}°C
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Sức khỏe pin
                </label>
                <div>{getHealthBadge(batteryData.health)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Chu kỳ sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Chu kỳ hiện tại
                </label>
                <p className="text-xl font-bold text-blue-600">
                  {batteryData.cycleCount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Chu kỳ tối đa
                </label>
                <p className="text-lg">
                  {batteryData.maxCycles.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tiến độ sử dụng
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (batteryData.cycleCount / batteryData.maxCycles) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (batteryData.cycleCount / batteryData.maxCycles) * 100
                  )}
                  % đã sử dụng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lịch sử bảo trì */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử bảo trì</CardTitle>
          <CardDescription>
            Thông tin bảo trì và lịch trình kiểm tra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Ngày sản xuất
              </label>
              <p>
                {new Date(batteryData.manufacturingDate).toLocaleDateString(
                  "vi-VN"
                )}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Bảo trì cuối
              </label>
              <p>
                {new Date(batteryData.lastMaintenance).toLocaleDateString(
                  "vi-VN"
                )}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Bảo trì tiếp theo
              </label>
              <p className="font-medium text-orange-600">
                {new Date(batteryData.nextMaintenance).toLocaleDateString(
                  "vi-VN"
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
