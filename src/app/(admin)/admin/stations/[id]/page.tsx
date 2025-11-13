"use client";

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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  useGetStationDetails,
  useDeleteStation,
} from "@/hooks/admin/useStations";
import { useGetBatteries } from "@/hooks/admin/useBatteries";
import { Batteries } from "@/types/admin/batteries.type";
import { toast } from "sonner";

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id as string;

  const {
    data: stationResponse,
    isLoading,
    error,
  } = useGetStationDetails(stationId);

  const {
    data: batteriesResponse,
    isLoading: batteriesLoading,
    error: batteriesError,
  } = useGetBatteries({});

  const deleteStationMutation = useDeleteStation();

  const station = stationResponse?.data;

  // Debug logging to see the actual data structure
  console.log("batteriesResponse:", batteriesResponse);
  console.log("station ID:", stationId);

  // Handle both array format and object format from API
  const batteriesData = batteriesResponse?.data;
  let allBatteries = (
    batteriesData
      ? Array.isArray(batteriesData)
        ? batteriesData
        : batteriesData.data
        ? Array.isArray(batteriesData.data)
          ? batteriesData.data
          : Object.values(batteriesData.data || {})
        : Object.values(batteriesData || {})
      : []
  ) as Batteries[];

  // Filter batteries by station_id to ensure we only show batteries for this station
  const batteries = allBatteries.filter(
    (battery) => battery.station_id === stationId
  );

  console.log("all batteries:", allBatteries);
  console.log("filtered batteries for station:", batteries);

  // Check if station is deleted
  const isDeleted = station?.deleted_at !== null;

  // Handle delete station
  const handleDeleteStation = async () => {
    try {
      await deleteStationMutation.mutateAsync(stationId);
      toast.success("Xóa trạm thành công!");
      router.push("/admin/stations");
    } catch (error) {
      console.error("Error deleting station:", error);
      toast.error("Có lỗi xảy ra khi xóa trạm");
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const getBatteryStatusBadge = (status: string) => {
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
      case "in_use":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Đang sử dụng
          </Badge>
        );
      case "maintenance":
        return <Badge variant="destructive">Bảo trì</Badge>;
      case "error":
        return <Badge variant="destructive">Lỗi</Badge>;
      case "damaged":
        return <Badge variant="destructive">Hư hỏng</Badge>;
      case "inactive":
        return <Badge variant="outline">Không hoạt động</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải thông tin trạm...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">
              Có lỗi xảy ra khi tải thông tin trạm
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!station) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Không tìm thấy trạm</p>
            <Button variant="outline" asChild className="mt-2">
              <Link href="/admin/stations">Quay lại danh sách</Link>
            </Button>
          </div>
        </div>
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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {station.name}
              </h1>
              {isDeleted && <Badge variant="destructive">Đã xóa</Badge>}
            </div>
            <p className="text-muted-foreground">
              {station.address}, {station.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isDeleted ? (
            <Button variant="outline" asChild>
              <Link href={`/admin/stations/${station.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleted || deleteStationMutation.isPending}
                title={isDeleted ? "Không thể xóa trạm đã bị xóa" : "Xóa trạm"}
              >
                {deleteStationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa trạm</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa trạm &ldquo;{station.name}&rdquo;
                  không? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteStation}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteStationMutation.isPending}
                >
                  {deleteStationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xóa trạm"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mã trạm</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">{station.id.slice(0, 8)}...</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nhân viên phụ trách
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {station.staff ? station.staff.name : "Chưa gán"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{getStatusBadge(station.status)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tọa độ</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <a
              href={`https://www.google.com/maps?q=${station.lat},${station.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-600 hover:underline cursor-pointer"
              title="Xem trên Google Maps"
            >
              {station.lat}, {station.lng}
            </a>
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
                    {station.address}, {station.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Hình ảnh</p>
                  <p className="text-sm">
                    {station.image_url ? (
                      <a
                        href={station.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Xem hình ảnh
                      </a>
                    ) : (
                      "Chưa có hình ảnh"
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">
                      {formatDate(station.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cập nhật cuối
                    </p>
                    <p className="font-medium">
                      {formatDate(station.updated_at)}
                    </p>
                  </div>
                </div>

                {isDeleted && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <p className="text-sm text-red-800 font-medium">
                        Trạm đã bị xóa
                      </p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Trạm này đã bị xóa vào {formatDate(station.deleted_at!)}{" "}
                      và không thể thực hiện các thao tác chỉnh sửa.
                    </p>
                  </div>
                )}

                {station.staff && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Nhân viên phụ trách
                    </p>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="font-medium">{station.staff.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {station.staff.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {station.staff.phone}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Thông tin bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vĩ độ:</p>
                      <p className="font-medium font-mono text-sm">
                        {station.lat}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kinh độ:</p>
                      <p className="font-medium font-mono text-sm">
                        {station.lng}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <a
                      href={`https://www.google.com/maps?q=${station.lat},${station.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <MapPin className="h-4 w-4" />
                      Xem vị trí trên Google Maps
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Người tạo:</p>
                    <p className="font-medium">
                      {station.created_by || "Hệ thống"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Người cập nhật cuối:
                    </p>
                    <p className="font-medium">
                      {station.updated_by || "Chưa có"}
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Trạm này đang{" "}
                      {station.status === "active"
                        ? "hoạt động bình thường"
                        : "không hoạt động"}
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
              <CardTitle>Danh sách pin tại trạm</CardTitle>
              <CardDescription>
                Theo dõi tình trạng các pin đang có tại trạm này
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batteriesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Đang tải danh sách pin...</span>
                </div>
              ) : batteriesError ? (
                <div className="text-center py-8">
                  <p className="text-destructive">
                    Có lỗi xảy ra khi tải danh sách pin
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {batteriesError instanceof Error
                      ? batteriesError.message
                      : "Unknown error"}
                  </p>
                </div>
              ) : batteries.length === 0 ? (
                <div className="text-center py-8">
                  <Battery className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">
                    Chưa có pin nào tại trạm này
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên pin</TableHead>
                      <TableHead>Số serial</TableHead>
                      <TableHead>Ngăn</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Dung lượng</TableHead>
                      <TableHead>SOH</TableHead>
                      <TableHead>Cập nhật lần cuối</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batteries.map((battery) => (
                      <TableRow key={battery.id}>
                        <TableCell className="font-medium">
                          {battery.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {battery.serial_number}
                        </TableCell>
                        <TableCell>
                          {battery.station_kiosk_slot || "-"}
                        </TableCell>
                        <TableCell>
                          {getBatteryStatusBadge(battery.status)}
                        </TableCell>
                        <TableCell>{battery.capacity_kwh} kWh</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  parseInt(battery.soh) >= 80
                                    ? "bg-green-600"
                                    : parseInt(battery.soh) >= 50
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                                }`}
                                style={{ width: `${battery.soh}%` }}
                              />
                            </div>
                            <span className="text-sm">{battery.soh}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(battery.updated_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
