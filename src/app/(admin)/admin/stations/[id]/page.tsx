"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Clock,
  Battery,
  Settings,
  Trash2,
  Activity,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface Station {
  id: string;
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
  totalBatteries: number;
  available: number;
  charging: number;
  maintenance: number;
  createdAt: string;
  lastMaintenance: string;
}

interface BatterySlot {
  id: number;
  slotNumber: string;
  batteryId: string | null;
  status: "empty" | "available" | "charging" | "maintenance" | "error";
  batteryLevel: number | null;
  lastUpdated: string;
}

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id as string;

  const [station, setStation] = useState<Station | null>(null);
  const [batterySlots, setBatterySlots] = useState<BatterySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data - in real app would fetch from API
        const mockStation: Station = {
          id: stationId,
          name: "Trạm Quận 1",
          location: "Ngã tư Lê Lợi - Nguyễn Huệ",
          address: "123 Nguyễn Huệ",
          city: "TP. Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          totalSlots: 20,
          description:
            "Trạm đổi pin chính tại trung tâm Quận 1, phục vụ khu vực đông dân cư và du lịch",
          operatingHours: {
            open: "06:00",
            close: "22:00",
          },
          status: "active",
          totalBatteries: 18,
          available: 15,
          charging: 2,
          maintenance: 1,
          createdAt: "2024-01-15",
          lastMaintenance: "2024-10-20",
        };

        // Mock battery slots
        const mockSlots: BatterySlot[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          slotNumber: `S${String(i + 1).padStart(2, "0")}`,
          batteryId: i < 18 ? `BAT${String(i + 1).padStart(3, "0")}` : null,
          status:
            i < 15
              ? "available"
              : i < 17
              ? "charging"
              : i < 18
              ? "maintenance"
              : "empty",
          batteryLevel: i < 18 ? Math.floor(Math.random() * 100) + 1 : null,
          lastUpdated: new Date().toISOString(),
        }));

        setStation(mockStation);
        setBatterySlots(mockSlots);
      } catch (error) {
        console.error("Error fetching station data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationData();
  }, [stationId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Hoạt động</Badge>;
      case "inactive":
        return <Badge variant="secondary">Tạm dừng</Badge>;
      case "maintenance":
        return <Badge variant="destructive">Bảo trì</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getSlotStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Sẵn sàng
          </Badge>
        );
      case "charging":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Đang sạc
          </Badge>
        );
      case "maintenance":
        return <Badge variant="destructive">Bảo trì</Badge>;
      case "error":
        return <Badge variant="destructive">Lỗi</Badge>;
      case "empty":
        return <Badge variant="outline">Trống</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>Đang tải...</div>
      </main>
    );
  }

  if (!station) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>Không tìm thấy trạm</div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/stations">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {station.name}
            </h1>
            <p className="text-muted-foreground">{station.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/stations/${station.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ngăn pin</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{station.totalSlots}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pin khả dụng</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {station.available}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang sạc</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {station.charging}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bảo trì</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {station.maintenance}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="batteries">Trạng thái pin</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin trạm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mã trạm</p>
                    <p className="font-medium">{station.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    {getStatusBadge(station.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Địa chỉ đầy đủ
                  </p>
                  <p className="font-medium">
                    {station.address}, {station.ward}, {station.district},{" "}
                    {station.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p className="text-sm">{station.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">{station.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Bảo trì gần nhất
                    </p>
                    <p className="font-medium">{station.lastMaintenance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Giờ hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Giờ mở cửa:
                    </span>
                    <span className="font-medium">
                      {station.operatingHours.open}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Giờ đóng cửa:
                    </span>
                    <span className="font-medium">
                      {station.operatingHours.close}
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Trạm hoạt động{" "}
                      {parseInt(station.operatingHours.close) -
                        parseInt(station.operatingHours.open)}{" "}
                      giờ/ngày
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batteries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái chi tiết các ngăn pin</CardTitle>
              <CardDescription>
                Theo dõi tình trạng từng ngăn pin trong trạm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngăn</TableHead>
                    <TableHead>Mã pin</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Mức pin</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batterySlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell className="font-medium">
                        {slot.slotNumber}
                      </TableCell>
                      <TableCell>{slot.batteryId || "-"}</TableCell>
                      <TableCell>{getSlotStatusBadge(slot.status)}</TableCell>
                      <TableCell>
                        {slot.batteryLevel ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${slot.batteryLevel}%` }}
                              />
                            </div>
                            <span className="text-sm">
                              {slot.batteryLevel}%
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(slot.lastUpdated).toLocaleString("vi-VN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <CardDescription>Các hoạt động gần đây của trạm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Pin BAT015 được đổi tại ngăn S05</p>
                    <p className="text-xs text-muted-foreground">
                      2 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Pin BAT008 bắt đầu sạc tại ngăn S12
                    </p>
                    <p className="text-xs text-muted-foreground">
                      15 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Ngăn S03 báo lỗi, chuyển sang chế độ bảo trì
                    </p>
                    <p className="text-xs text-muted-foreground">1 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Pin BAT022 hoàn thành sạc (100%)</p>
                    <p className="text-xs text-muted-foreground">2 giờ trước</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
