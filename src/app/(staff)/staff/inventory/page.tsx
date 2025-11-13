"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Battery,
  Search,
  Filter,
  AlertTriangle,
  Zap,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Info,
  Calendar,
  User,
  Hash,
  RotateCcw,
} from "lucide-react";
import { useStationBatteries } from "@/hooks/staff/useStationBatteries";
import { useUpdateBatteryStatus } from "@/hooks/staff/useUpdateBatteryStatus";
import { useBatteryStatusLogs } from "@/hooks/staff/useBatteryStatusLogs";
import { useQueryClient } from "@tanstack/react-query";
import type { Battery as BatteryType } from "@/types/staff/battery.type";

export default function StaffInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [stationId, setStationId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Dialog state for status update
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState<BatteryType | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [note, setNote] = useState<string>("");
  
  // Dialog state for detail view
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailBattery, setDetailBattery] = useState<BatteryType | null>(null);
  
  // Mutation hook
  const updateStatusMutation = useUpdateBatteryStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    const stationData = localStorage.getItem("selectedStation");
    if (stationData) {
      try {
        const station = JSON.parse(stationData);
        setStationId(station.id);
      } catch (error) {
        console.error("Error parsing station:", error);
      }
    }
  }, []);

  // Listen for station changes (when station is changed from sidebar)
  useEffect(() => {
    const handleStationChange = (event: CustomEvent) => {
      setStationId(event.detail.id);
    };

    window.addEventListener("stationChanged", handleStationChange as EventListener);
    return () => window.removeEventListener("stationChanged", handleStationChange as EventListener);
  }, []);

  // Fetch ALL batteries without pagination
  const { data, isLoading, error, refetch } = useStationBatteries(stationId || "", {});

  // Convert to array if needed (API might return object)
  const allBatteries = data?.batteries 
    ? (Array.isArray(data.batteries) 
        ? data.batteries 
        : Object.values(data.batteries) as BatteryType[])
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sẵn sàng
          </Badge>
        );
      case "charging":
        return (
          <Badge className="bg-blue-500">
            <Zap className="w-3 h-3 mr-1" />
            Đang sạc
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-orange-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Bảo trì
          </Badge>
        );
      case "damaged":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Hỏng
          </Badge>
        );
      case "in_use":
        return (
          <Badge className="bg-purple-500">
            <Battery className="w-3 h-3 mr-1" />
            Đang dùng
          </Badge>
        );
      case "reserved":
        return (
          <Badge className="bg-yellow-500">
            <Battery className="w-3 h-3 mr-1" />
            Đặt trước
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getSoHColor = (soh: number) => {
    if (soh >= 80) return "text-green-600";
    if (soh >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Reset page to 1 when changing tab or search term
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchTerm]);

  // Handle open status dialog
  const handleOpenStatusDialog = (battery: BatteryType) => {
    setSelectedBattery(battery);
    setNewStatus(battery.status);
    setNote("");
    setIsStatusDialogOpen(true);
  };

  // Handle open detail dialog
  const handleOpenDetailDialog = (battery: BatteryType) => {
    setDetailBattery(battery);
    setIsDetailDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Handle refresh data
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ["station-batteries"] });
    await refetch();
  };

  // Handle submit status update
  const handleSubmitStatusUpdate = () => {
    if (!selectedBattery || !newStatus) return;
    
    updateStatusMutation.mutate({
      batteryId: selectedBattery.id,
      data: {
        status: newStatus as any,
        note: note || undefined,
      },
    });
    
    setIsStatusDialogOpen(false);
    setSelectedBattery(null);
    setNewStatus("");
    setNote("");
  };

  // Client-side filter
  const filteredBatteries = allBatteries.filter((battery) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      battery.serial_number.toLowerCase().includes(searchLower) ||
      battery.name.toLowerCase().includes(searchLower) ||
      battery.station_kiosk_slot.toLowerCase().includes(searchLower) ||
      battery.capacity_kwh.toLowerCase().includes(searchLower) ||
      battery.soh.toLowerCase().includes(searchLower) ||
      battery.status.toLowerCase().includes(searchLower);
    const matchesTab = selectedTab === "all" || battery.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBatteries = filteredBatteries.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải danh sách pin...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Có lỗi xảy ra khi tải danh sách pin</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (allBatteries.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Battery className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Không có pin nào tại trạm này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Kho Pin</h1>
          <p className="text-gray-600">
            Theo dõi và quản lý tình trạng pin tại trạm
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm theo mã pin, tên, slot, dung lượng, SoH, trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({allBatteries.length})</TabsTrigger>
          <TabsTrigger value="available">
            Sẵn sàng ({allBatteries.filter((b) => b.status === "available").length}
            )
          </TabsTrigger>
          <TabsTrigger value="charging">
            Đang sạc ({allBatteries.filter((b) => b.status === "charging").length})
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Bảo trì (
            {allBatteries.filter((b) => b.status === "maintenance").length})
          </TabsTrigger>
          <TabsTrigger value="damaged">
            Hỏng ({allBatteries.filter((b) => b.status === "damaged").length})
          </TabsTrigger>
          <TabsTrigger value="in_use">
            Đang dùng ({allBatteries.filter((b) => b.status === "in_use").length})
          </TabsTrigger>
          <TabsTrigger value="reserved">
            Đặt trước ({allBatteries.filter((b) => b.status === "reserved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {paginatedBatteries.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Battery className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Không có pin nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              paginatedBatteries.map((battery) => {
              const soh = parseFloat(battery.soh);
              return (
                <Card
                  key={battery.id}
                  className="hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Battery className="w-5 h-5 mr-2 text-blue-600" />
                        {battery.serial_number}
                      </CardTitle>
                      {getStatusBadge(battery.status)}
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {battery.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">SoH</p>
                        <p
                          className={`font-semibold ${getSoHColor(soh)}`}
                        >
                          {soh.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Dung lượng</p>
                        <p className="font-semibold">
                          {parseFloat(battery.capacity_kwh).toFixed(1)}kWh
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Vị trí slot</p>
                        <p className="font-semibold">{battery.station_kiosk_slot}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Trạng thái</p>
                        <p className="font-semibold capitalize">
                          {battery.status === "available"
                            ? "Sẵn sàng"
                            : battery.status === "charging"
                            ? "Đang sạc"
                            : battery.status === "maintenance"
                            ? "Bảo trì"
                            : battery.status === "damaged"
                            ? "Hỏng"
                            : battery.status === "in_use"
                            ? "Đang dùng"
                            : battery.status === "reserved"
                            ? "Đặt trước"
                            : battery.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleOpenDetailDialog(battery)}
                      >
                        <Info className="w-3 h-3 mr-1" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleOpenStatusDialog(battery)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Cập nhật
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Client-side Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages} ({filteredBatteries.length} pin)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage >= totalPages}
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái pin</DialogTitle>
            <DialogDescription>
              {selectedBattery && (
                <span>
                  Pin: <strong>{selectedBattery.serial_number}</strong> -{" "}
                  {selectedBattery.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Sẵn sàng</SelectItem>
                  <SelectItem value="charging">Đang sạc</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                  <SelectItem value="damaged">Hỏng</SelectItem>
                  <SelectItem value="in_use">Đang dùng</SelectItem>
                  <SelectItem value="reserved">Đặt trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
              <Input
                id="note"
                placeholder="Nhập ghi chú..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsStatusDialogOpen(false);
                setSelectedBattery(null);
                setNewStatus("");
                setNote("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitStatusUpdate}
              disabled={updateStatusMutation.isPending || !newStatus}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-blue-600" />
              Chi tiết Pin
            </DialogTitle>
            <DialogDescription>
              {detailBattery && (
                <span>
                  <strong>{detailBattery.serial_number}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {detailBattery && (
            <BatteryDetailContent battery={detailBattery} />
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDetailDialogOpen(false);
                setDetailBattery(null);
              }}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Battery Detail Content Component
function BatteryDetailContent({ battery }: { battery: BatteryType }) {
  const { data: statusLogsData, isLoading: isLoadingLogs, error: statusLogsError } = useBatteryStatusLogs(battery.id);
  
  console.log('Status Logs Data:', statusLogsData);
  console.log('Is Loading:', isLoadingLogs);
  console.log('Error:', statusLogsError);
  
  // Handle response structure
  // Actual structure: { data: { 0: {...}, 1: {...}, message, statusCode, timestamp }, statusCode, message, timestamp }
  let statusLogs: any[] = [];
  if (statusLogsData) {
    const rawData = statusLogsData.data;
    
    if (rawData) {
      // Check if it's an array
      if (Array.isArray(rawData)) {
        statusLogs = rawData;
      }
      // Check if it's an object with numeric keys (like { 0: {...}, 1: {...} })
      else if (typeof rawData === 'object' && rawData !== null) {
        // Convert object to array, filter out non-log properties
        const values = Object.values(rawData);
        statusLogs = values.filter((item: any) => 
          item && typeof item === 'object' && item.id && item.old_status && item.new_status
        );
      }
      // Check nested data.data structure
      else if (rawData.data && Array.isArray(rawData.data)) {
        statusLogs = rawData.data;
      }
    }
  }
  
  console.log('Processed Status Logs:', statusLogs);
  console.log('Status Logs Length:', statusLogs.length);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Sẵn sàng";
      case "charging":
        return "Đang sạc";
      case "maintenance":
        return "Bảo trì";
      case "damaged":
        return "Hỏng";
      case "in_use":
        return "Đang dùng";
      case "reserved":
        return "Đặt trước";
      default:
        return status;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "charging":
        return "bg-blue-500";
      case "maintenance":
        return "bg-orange-500";
      case "damaged":
        return "bg-red-500";
      case "in_use":
        return "bg-purple-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sẵn sàng
          </Badge>
        );
      case "charging":
        return (
          <Badge className="bg-blue-500">
            <Zap className="w-3 h-3 mr-1" />
            Đang sạc
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-orange-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Bảo trì
          </Badge>
        );
      case "damaged":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Hỏng
          </Badge>
        );
      case "in_use":
        return (
          <Badge className="bg-purple-500">
            <Battery className="w-3 h-3 mr-1" />
            Đang dùng
          </Badge>
        );
      case "reserved":
        return (
          <Badge className="bg-yellow-500">
            <Battery className="w-3 h-3 mr-1" />
            Đặt trước
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getSoHColor = (soh: number) => {
    if (soh >= 80) return "text-green-600";
    if (soh >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Basic Information */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
          Thông tin cơ bản
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Mã pin
            </Label>
            <p className="text-sm font-medium mt-1">{battery.serial_number}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Battery className="w-3 h-3" />
              Trạng thái
            </Label>
            <div className="mt-1">{getStatusBadge(battery.status)}</div>
          </div>
          <div className="col-span-2">
            <Label className="text-xs text-gray-500">Tên pin</Label>
            <p className="text-sm font-medium mt-1">{battery.name}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Dung lượng</Label>
            <p className="text-sm font-medium mt-1">
              {parseFloat(battery.capacity_kwh).toFixed(2)} kWh
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">SoH (State of Health)</Label>
            <p className={`text-sm font-medium mt-1 ${getSoHColor(parseFloat(battery.soh))}`}>
              {parseFloat(battery.soh).toFixed(2)}%
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Vị trí slot</Label>
            <p className="text-sm font-medium mt-1">{battery.station_kiosk_slot}</p>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
          Thông tin hệ thống
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              ID Pin
            </Label>
            <p className="text-sm font-mono text-xs mt-1 break-all">{battery.id}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              ID Trạm
            </Label>
            <p className="text-sm font-mono text-xs mt-1 break-all">{battery.station_id}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              ID Loại pin
            </Label>
            <p className="text-sm font-mono text-xs mt-1 break-all">{battery.battery_type_id}</p>
          </div>
        </div>
      </div>

      {/* Timestamp Information */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
          Thông tin thời gian
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Ngày tạo
            </Label>
            <p className="text-sm mt-1">{formatDate(battery.created_at)}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Ngày cập nhật
            </Label>
            <p className="text-sm mt-1">{formatDate(battery.updated_at)}</p>
          </div>
          {battery.deleted_at && (
            <div>
              <Label className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Ngày xóa
              </Label>
              <p className="text-sm mt-1 text-red-600">{formatDate(battery.deleted_at)}</p>
            </div>
          )}
        </div>
      </div>

      {/* User Information */}
      {(battery.created_by || battery.updated_by) && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
            Thông tin người dùng
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {battery.created_by && (
              <div>
                <Label className="text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Người tạo
                </Label>
                <p className="text-sm font-mono text-xs mt-1 break-all">{battery.created_by}</p>
              </div>
            )}
            {battery.updated_by && (
              <div>
                <Label className="text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Người cập nhật
                </Label>
                <p className="text-sm font-mono text-xs mt-1 break-all">{battery.updated_by}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
          Lịch sử trạng thái
        </h3>
        {isLoadingLogs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Đang tải lịch sử...</span>
          </div>
        ) : statusLogs.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            Không có lịch sử trạng thái
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {statusLogs.map((log, index) => (
              <div
                key={log.id}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusBadgeColor(log.old_status)} text-white text-xs`}>
                        {getStatusLabel(log.old_status)}
                      </Badge>
                      <span className="text-gray-400">→</span>
                      <Badge className={`${getStatusBadgeColor(log.new_status)} text-white text-xs`}>
                        {getStatusLabel(log.new_status)}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                {log.note && (
                  <p className="text-xs text-gray-600 mt-2">{log.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
