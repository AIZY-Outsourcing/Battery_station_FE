"use client";

import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Battery,
  GitCompare,
  MapPin,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  RefreshCw,
} from "lucide-react";
import {
  useBatteryMovements,
  useConfirmSubRequest,
} from "@/hooks/staff/useBatteryMovements";
import {
  BatteryMovement,
  BatteryMovementStatus,
} from "@/types/staff/battery-movement.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function StaffExchangePage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<BatteryMovement | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Get current staff's station from localStorage
  const selectedStation = localStorage.getItem("selectedStation");
  const currentStationId = selectedStation
    ? JSON.parse(selectedStation).id
    : null;

  // Fetch all battery movements
  const { data: movementsData, isLoading, refetch } = useBatteryMovements({
    page: 1,
    limit: 100,
    sortBy: "created_at",
    sortOrder: "DESC",
  }, currentStationId);

  // Confirm sub-request mutation
  const confirmMutation = useConfirmSubRequest();

  // Filter movements based on current staff's station
  const mySubRequests = useMemo(() => {
    if (!movementsData?.data || !currentStationId) return [];

    return movementsData.data.filter((movement) => {
      // Only show sub-requests (has parent_request_id)
      if (!movement.parent_request_id) return false;

      // Only show requests related to staff's station
      const isSourceStation = movement.from_station_id === currentStationId;
      const isDestinationStation = movement.to_station_id === currentStationId;

      return isSourceStation || isDestinationStation;
    });
  }, [movementsData, currentStationId]);

  // Categorize sub-requests
  const pendingRequests = mySubRequests.filter(
    (req) => req.status === BatteryMovementStatus.PENDING
  );

  const approvedRequests = mySubRequests.filter(
    (req) => req.status === BatteryMovementStatus.APPROVED
  );

  const completedRequests = mySubRequests.filter(
    (req) =>
      req.parent_request?.status === BatteryMovementStatus.COMPLETED ||
      req.status === BatteryMovementStatus.COMPLETED
  );

  // Get status badge
  const getStatusBadge = (movement: BatteryMovement) => {
    const isSourceStation = movement.from_station_id === currentStationId;
    const isDestinationStation = movement.to_station_id === currentStationId;

    if (movement.status === BatteryMovementStatus.PENDING) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          Chờ xác nhận
        </Badge>
      );
    }

    if (movement.status === BatteryMovementStatus.APPROVED) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Đã xác nhận
        </Badge>
      );
    }

    if (
      movement.parent_request?.status === BatteryMovementStatus.COMPLETED ||
      movement.status === BatteryMovementStatus.COMPLETED
    ) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
          <Check className="w-3 h-3 mr-1" />
          Hoàn thành
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
        {movement.status}
      </Badge>
    );
  };

  // Get station role badge
  const getStationRoleBadge = (movement: BatteryMovement) => {
    const isSourceStation = movement.from_station_id === currentStationId;

    if (isSourceStation) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
          <Package className="w-3 h-3 mr-1" />
          Trạm gửi
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
        <MapPin className="w-3 h-3 mr-1" />
        Trạm nhận
      </Badge>
    );
  };

  // Handle confirm action
  const handleConfirm = async (subRequestId: string, station_id?: string) => {
    try {
      await confirmMutation.mutateAsync({ subRequestId, station_id });
      refetch();
    } catch (error) {
      console.error("Error confirming request:", error);
    }
  };

  // View detail
  const handleViewDetail = (movement: BatteryMovement) => {
    setSelectedRequest(movement);
    setDetailDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Di Chuyển Pin</h1>
          <p className="text-gray-600">
            Quản lý yêu cầu di chuyển pin giữa các trạm
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ xác nhận
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingRequests.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedRequests.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {completedRequests.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({mySubRequests.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Chờ xác nhận ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã xác nhận ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn thành ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* All Tab */}
        <TabsContent value="all" className="mt-6">
          {mySubRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Không có yêu cầu nào
                </h3>
                <p className="text-muted-foreground text-center">
                  Chưa có yêu cầu di chuyển pin nào cho trạm này.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {mySubRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            #{request.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          {getStationRoleBadge(request)}
                          {getStatusBadge(request)}
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {format(
                            new Date(request.created_at),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stations */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Trạm gửi
                        </div>
                        <div className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          {request.from_station.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {request.from_station.address}
                        </div>
                      </div>

                      <ArrowRightLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />

                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Trạm nhận
                        </div>
                        <div className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          {request.to_station.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {request.to_station.address}
                        </div>
                      </div>
                    </div>

                    {/* Batteries */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Số lượng pin thay đổi: {request.items.length}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        {request.items
                          .slice(0, 3)
                          .map((item) => item.battery.serial_number)
                          .join(", ")}
                        {request.items.length > 3 &&
                          ` +${request.items.length - 3} pin khác`}
                      </div>
                    </div>

                    {/* Reason */}
                    {request.reason && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Lý do</div>
                        <div className="text-sm">{request.reason}</div>
                      </div>
                    )}

                    {/* Parent Request Status */}
                    {request.parent_request && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Trạm gửi:</span>
                          {request.parent_request.source_confirmed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Trạm nhận:</span>
                          {request.parent_request.destination_confirmed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewDetail(request)}
                        variant="outline"
                        className="flex-1"
                      >
                        Xem chi tiết
                      </Button>
                      {request.status === BatteryMovementStatus.PENDING && (
                        <Button
                          onClick={() => handleConfirm(request.id, currentStationId!)}
                          disabled={confirmMutation.isPending}
                          className="flex-1"
                        >
                          {confirmMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang xác nhận...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Xác nhận
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Không có yêu cầu chờ xác nhận
                </h3>
                <p className="text-muted-foreground text-center">
                  Chưa có yêu cầu di chuyển pin nào cần xác nhận.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            #{request.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          {getStationRoleBadge(request)}
                          {getStatusBadge(request)}
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {format(
                            new Date(request.created_at),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stations */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Trạm gửi
                        </div>
                        <div className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          {request.from_station.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {request.from_station.address}
                        </div>
                      </div>

                      <ArrowRightLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />

                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Trạm nhận
                        </div>
                        <div className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          {request.to_station.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {request.to_station.address}
                        </div>
                      </div>
                    </div>

                    {/* Batteries */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Số lượng pin thay đổi: {request.items.length}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        {request.items
                          .slice(0, 3)
                          .map((item) => item.battery.serial_number)
                          .join(", ")}
                        {request.items.length > 3 &&
                          ` +${request.items.length - 3} pin khác`}
                      </div>
                    </div>

                    {/* Reason */}
                    {request.reason && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Lý do</div>
                        <div className="text-sm">{request.reason}</div>
                      </div>
                    )}

                    {/* Parent Request Status */}
                    {request.parent_request && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Trạm gửi:</span>
                          {request.parent_request.source_confirmed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Trạm nhận:</span>
                          {request.parent_request.destination_confirmed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewDetail(request)}
                        variant="outline"
                        className="flex-1"
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        onClick={() => handleConfirm(request.id, currentStationId!)}
                        disabled={confirmMutation.isPending}
                        className="flex-1"
                      >
                        {confirmMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xác nhận...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Xác nhận
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved" className="mt-6">
          {approvedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Không có yêu cầu đã xác nhận
                </h3>
                <p className="text-muted-foreground text-center">
                  Chưa có yêu cầu nào đã được xác nhận.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {approvedRequests.map((request) => (
                <Card key={request.id} className="border-green-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            #{request.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          {getStationRoleBadge(request)}
                          {getStatusBadge(request)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{request.from_station.name}</div>
                      </div>
                      <ArrowRightLeft className="w-5 h-5" />
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{request.to_station.name}</div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-900">
                          Đã xác nhận - Chờ Admin thực thi
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleViewDetail(request)}
                      variant="outline"
                      className="w-full"
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="mt-6">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Chưa có yêu cầu hoàn thành
                </h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedRequests.map((request) => (
                <Card key={request.id} className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            #{request.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          {getStationRoleBadge(request)}
                          {getStatusBadge(request)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleViewDetail(request)}
                      variant="outline"
                      className="w-full"
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu di chuyển pin</DialogTitle>
            <DialogDescription>
              Mã yêu cầu: #{selectedRequest?.id.slice(0, 8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedRequest)}
                {getStationRoleBadge(selectedRequest)}
              </div>

              <Separator />

              {/* Stations Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Trạm gửi
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">
                      {selectedRequest.from_station.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedRequest.from_station.address}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Trạm nhận
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">
                      {selectedRequest.to_station.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedRequest.to_station.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Batteries List */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  Danh sách pin ({selectedRequest.items.length})
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedRequest.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          {item.battery.serial_number}
                        </div>
                        <div className="text-sm text-gray-600">
                          SoH: {item.battery.soh}% | Trạng thái:{" "}
                          {item.battery.status}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {item.is_from_source ? "Từ nguồn" : "Từ đích"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              {selectedRequest.reason && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Lý do</div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {selectedRequest.reason}
                  </div>
                </div>
              )}

              {/* Confirmation Status */}
              {selectedRequest.parent_request && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Trạng thái xác nhận
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedRequest.parent_request.source_confirmed
                          ? "bg-green-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedRequest.parent_request.source_confirmed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm">Trạm gửi</span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        selectedRequest.parent_request.destination_confirmed
                          ? "bg-green-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedRequest.parent_request
                          .destination_confirmed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm">Trạm nhận</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Ngày tạo</div>
                  <div className="font-medium">
                    {format(
                      new Date(selectedRequest.created_at),
                      "dd/MM/yyyy HH:mm",
                      { locale: vi }
                    )}
                  </div>
                </div>
                {selectedRequest.parent_request?.completed_at && (
                  <div>
                    <div className="text-gray-500">Hoàn thành</div>
                    <div className="font-medium">
                      {format(
                        new Date(selectedRequest.parent_request.completed_at),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

