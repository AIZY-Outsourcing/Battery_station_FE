"use client";

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
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useGetBattery, useDeleteBattery } from "@/hooks/admin/useBatteries";
import { useGetStations } from "@/hooks/admin/useStations";
import { useGetBatteryTypes } from "@/hooks/admin/useBatteryTypes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BatteryDetailPageProps {
  params: {
    id: string;
  };
}

export default function BatteryDetailPage({ params }: BatteryDetailPageProps) {
  const router = useRouter();
  const batteryId = params.id;

  // Fetch battery data
  const { data: batteryResponse, isLoading: isBatteryLoading } =
    useGetBattery(batteryId);
  const battery = batteryResponse?.data;

  // Fetch lookup data
  const { data: stationsResponse } = useGetStations({ page: 1, limit: 1000 });
  const { data: batteryTypesResponse } = useGetBatteryTypes({
    page: 1,
    limit: 1000,
  });

  const stations = stationsResponse?.data?.data || [];
  const batteryTypes = batteryTypesResponse?.data?.data || [];

  // Delete mutation
  const deleteBatteryMutation = useDeleteBattery();

  // Helper functions
  const getStationName = (stationId: string) => {
    const station = stations.find((s) => s.id === stationId);
    return station?.name || stationId;
  };

  const getBatteryTypeName = (typeId: string) => {
    const type = batteryTypes.find((t) => t.id === typeId);
    return type?.name || typeId;
  };

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

  const getBatteryLevelColor = (level: number) => {
    if (level >= 80) return "text-green-600";
    if (level >= 50) return "text-yellow-600";
    if (level >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const handleDelete = async () => {
    try {
      await deleteBatteryMutation.mutateAsync(batteryId);
      toast.success("Pin đã được xóa thành công!");
      router.push("/admin/stations/batteries");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa pin");
      console.error("Error deleting battery:", error);
    }
  };

  const handleBack = () => {
    router.push("/admin/stations/batteries");
  };

  if (isBatteryLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Không tìm thấy pin</h3>
            <p className="text-muted-foreground">
              Pin với ID {batteryId} không tồn tại.
            </p>
            <Button onClick={handleBack} className="mt-4">
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sohValue =
    typeof battery.soh === "string"
      ? parseFloat(battery.soh) || 0
      : battery.soh || 0;
  const capacityValue =
    typeof battery.capacity_kwh === "string"
      ? parseFloat(battery.capacity_kwh) || 0
      : battery.capacity_kwh || 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết pin: {battery.name}
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và trạng thái của pin
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/stations/batteries/${battery.id}/edit`}>
              <Settings className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="default">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa pin
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa pin</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa pin "{battery.name}"? Hành động này
                  không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteBatteryMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteBatteryMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Xóa pin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
                <p className="text-lg font-semibold">{battery.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tên pin
                </label>
                <p className="text-lg">{battery.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Số serial
                </label>
                <p>{battery.serial_number}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Dung lượng
                </label>
                <p>{capacityValue} kWh</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Loại pin
                </label>
                <p>{getBatteryTypeName(battery.battery_type_id)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </label>
                <div>{getStatusBadge(battery.status)}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Vị trí
              </label>
              <p>
                {battery.station_id
                  ? `${getStationName(battery.station_id)}${
                      battery.station_kiosk_slot
                        ? ` / Slot ${battery.station_kiosk_slot}`
                        : ""
                    }`
                  : "Chưa gán trạm"}
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
                  SOH (State of Health)
                </label>
                <p
                  className={`text-2xl font-bold ${getBatteryLevelColor(
                    sohValue
                  )}`}
                >
                  {sohValue}%
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Dung lượng
                </label>
                <p className="text-xl font-semibold">{capacityValue} kWh</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thông tin thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Ngày tạo
                </label>
                <p className="text-sm">
                  {battery.created_at
                    ? new Date(battery.created_at).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Cập nhật cuối
                </label>
                <p className="text-sm">
                  {battery.updated_at
                    ? new Date(battery.updated_at).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
