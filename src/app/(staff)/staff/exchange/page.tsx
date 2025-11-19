"use client";

import { useEffect, useMemo, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Battery,
  GitCompare,
  MapPin,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Package,
  User,
} from "lucide-react";

const mockRequests = [
  {
    id: "REQ-2025-001",
    fromStation: "Station Central",
    fromStationId: "station-central",
    toStation: "Station A",
    toStationId: "station-a",
    batteryType: "Lithium-Ion 100kWh",
    batteryCount: 8,
    priority: "high",
    status: "pending",
    createdAt: "2025-11-12T09:00:00Z",
    deadline: "2025-11-13T12:00:00Z",
    dispatchedBy: "Nguyễn Văn Điều phối",
    driver: {
      name: "Lê Minh Tâm",
      phone: "0985 123 456",
    },
    notes: "Điều phối khẩn để hỗ trợ khách hàng khu vực trung tâm.",
    batteries: ["BAT-10023", "BAT-10031", "BAT-10058", "BAT-10075"],
  },
  {
    id: "REQ-2025-002",
    fromStation: "Station B",
    fromStationId: "station-b",
    toStation: "Station A",
    toStationId: "station-a",
    batteryType: "Lithium-Ion 80kWh",
    batteryCount: 5,
    priority: "medium",
    status: "in-progress",
    createdAt: "2025-11-11T14:30:00Z",
    deadline: "2025-11-13T08:00:00Z",
    dispatchedBy: "Trần Thị Điều phối",
    driver: {
      name: "Phạm Đức Hiếu",
      phone: "0903 555 888",
    },
    notes: "Yêu cầu chuẩn bị sẵn vị trí lưu trữ.",
    batteries: ["BAT-8012", "BAT-8044", "BAT-8075"],
  },
  {
    id: "REQ-2025-003",
    fromStation: "Station A",
    fromStationId: "station-a",
    toStation: "Station C",
    toStationId: "station-c",
    batteryType: "Lithium-Ion 60kWh",
    batteryCount: 10,
    priority: "low",
    status: "completed",
    createdAt: "2025-11-09T10:00:00Z",
    deadline: "2025-11-10T10:00:00Z",
    dispatchedBy: "Phòng điều phối",
    driver: {
      name: "Võ Nhật Quang",
      phone: "0977 222 333",
    },
    notes: "Hoàn thành trao đổi ngày 10/11.",
    batteries: ["BAT-6012", "BAT-6025", "BAT-6033"],
  },
];

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; chipClass: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
    chipClass: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  },
  "in-progress": {
    label: "Đang thực hiện",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    chipClass: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  completed: {
    label: "Đã hoàn tất",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    chipClass: "bg-green-50 text-green-600 border border-green-200",
  },
};

const priorityColor: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-gray-100 text-gray-600",
};

export default function ExchangeRequestsPage() {
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [detailRequest, setDetailRequest] = useState<any>(null);
  const [confirmRequest, setConfirmRequest] = useState<any>(null);

  useEffect(() => {
    const stationData = localStorage.getItem("selectedStation");
    if (stationData) {
      try {
        const station = JSON.parse(stationData);
        setSelectedStation(station);
      } catch (error) {
        console.error("Error parsing station data:", error);
      }
    }
  }, []);

  const requestsForStation = useMemo(() => {
    if (!selectedStation) return [];

    const matchesStation = (request: any) => {
      const byId =
        request.toStationId === selectedStation.id ||
        request.fromStationId === selectedStation.id;

      const byName =
        request.toStation?.toLowerCase() ===
          selectedStation.name?.toLowerCase() ||
        request.fromStation?.toLowerCase() ===
          selectedStation.name?.toLowerCase();

      return byId || byName;
    };

    const filtered = mockRequests.filter(matchesStation);

    // Nếu không có dữ liệu khớp (do mock), hiển thị toàn bộ để demo UI
    return filtered.length > 0 ? filtered : mockRequests;
  }, [selectedStation]);

  const summaryCards = useMemo(() => {
    const total = requestsForStation.length;
    const pending = requestsForStation.filter(
      (req) => req.status === "pending"
    ).length;
    const inProgress = requestsForStation.filter(
      (req) => req.status === "in-progress"
    ).length;
    const completed = requestsForStation.filter(
      (req) => req.status === "completed"
    ).length;

    return [
      {
        title: "Tổng yêu cầu",
        value: total,
        icon: GitCompare,
        color: "text-gray-600",
      },
      {
        title: "Chờ xác nhận",
        value: pending,
        icon: AlertCircle,
        color: "text-yellow-600",
      },
      {
        title: "Đang thực hiện",
        value: inProgress,
        icon: Clock,
        color: "text-blue-600",
      },
      {
        title: "Đã hoàn tất",
        value: completed,
        icon: Check,
        color: "text-green-600",
      },
    ];
  }, [requestsForStation]);

  if (!selectedStation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Vui lòng chọn trạm làm việc để xem yêu cầu đổi chéo pin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Điều phối đổi chéo pin
            </h1>
            <p className="text-gray-600">
              Trạm chịu trách nhiệm: {selectedStation?.name}
            </p>
          </div>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
            <GitCompare className="w-4 h-4 mr-1" />
            {requestsForStation.length} yêu cầu
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          Theo dõi các yêu cầu điều phối pin do admin giao cho trạm và xác nhận
          khi hoàn tất.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-gray-600">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Requests list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Danh sách yêu cầu
          </CardTitle>
          <CardDescription>
            Các yêu cầu điều phối pin dành cho trạm {selectedStation?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestsForStation.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              Không có yêu cầu nào cho trạm hiện tại
            </div>
          ) : (
            <div className="space-y-4">
              {requestsForStation.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 bg-card shadow-sm space-y-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase text-gray-500">
                        Mã yêu cầu
                      </p>
                      <p className="text-lg font-semibold">{request.id}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        className={statusConfig[request.status].chipClass}
                      >
                        {statusConfig[request.status].label}
                      </Badge>
                      <Badge className={priorityColor[request.priority]}>
                        Ưu tiên:{" "}
                        {request.priority === "high"
                          ? "Cao"
                          : request.priority === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                      </Badge>
                      <Badge variant="outline">
                        <Battery className="w-3 h-3 mr-1" />
                        {request.batteryCount} pin
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-gray-500">
                        Điều phối từ
                      </p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {request.fromStation}
                      </p>
                      <p className="text-xs text-gray-500">
                        Loại pin: {request.batteryType}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-gray-500">
                        Giao đến
                      </p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {request.toStation}
                      </p>
                      <p className="text-xs text-gray-500">
                        Giao hạn:{" "}
                        {new Date(request.deadline).toLocaleString("vi-VN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                      {request.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailRequest(request)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      size="sm"
                      disabled={request.status !== "pending"}
                      onClick={() => setConfirmRequest(request)}
                    >
                      Xác nhận
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!detailRequest} onOpenChange={() => setDetailRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu</DialogTitle>
            <DialogDescription>
              Xem thông tin đầy đủ của yêu cầu đổi chéo pin
            </DialogDescription>
          </DialogHeader>
          {detailRequest && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase text-gray-500">Mã yêu cầu</p>
                <p className="text-lg font-semibold">{detailRequest.id}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">
                    Điều phối từ
                  </p>
                  <p className="font-medium">{detailRequest.fromStation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">Giao đến</p>
                  <p className="font-medium">{detailRequest.toStation}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">Loại pin</p>
                  <p className="font-medium">{detailRequest.batteryType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">
                    Số lượng pin
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    {detailRequest.batteryCount} pin
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">
                    Người điều phối
                  </p>
                  <p className="font-medium">{detailRequest.dispatchedBy}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">
                    Tài xế được phân công
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-400" />
                    {detailRequest.driver.name} - {detailRequest.driver.phone}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">Tạo lúc</p>
                  <p className="font-medium">
                    {new Date(detailRequest.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">Hạn xử lý</p>
                  <p className="font-medium">
                    {new Date(detailRequest.deadline).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              {detailRequest.batteries && detailRequest.batteries.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">
                    Danh sách pin dự kiến
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {detailRequest.batteries.map((battery: string) => (
                      <Badge key={battery} variant="secondary">
                        {battery}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {detailRequest.notes && (
                <div className="space-y-1">
                  <p className="text-xs uppercase text-gray-500">Ghi chú</p>
                  <p className="text-sm text-gray-700">{detailRequest.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailRequest(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog
        open={!!confirmRequest}
        onOpenChange={() => setConfirmRequest(null)}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Xác nhận đã hoàn tất</DialogTitle>
            <DialogDescription>
              Vui lòng xác nhận khi trạm đã nhận đủ số pin được điều phối.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn trạm{" "}
              <span className="font-semibold">{selectedStation?.name}</span> đã
              hoàn tất yêu cầu{" "}
              <span className="font-semibold">{confirmRequest?.id}</span> chưa?
            </p>
            <p className="text-sm text-gray-500">
              Sau khi xác nhận, yêu cầu sẽ được đánh dấu là hoàn thành và báo
              cáo về hệ thống admin.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmRequest(null)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                // UI only: simply close dialog
                setConfirmRequest(null);
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

