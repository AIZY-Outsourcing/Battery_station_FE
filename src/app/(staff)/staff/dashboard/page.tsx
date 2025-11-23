"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap, AlertTriangle, TrendingUp, Clock, Loader2, Package, User, ArrowLeftRight, GitCompare } from "lucide-react";
import { useStationBatteries } from "@/hooks/staff/useStationBatteries";
import { useStaffTransactions } from "@/hooks/staff/useTransactions";
import { useBatteryMovements } from "@/hooks/staff/useBatteryMovements";
import { TransactionStatus } from "@/types/staff/transaction.type";
import { BatteryMovementStatus } from "@/types/staff/battery-movement.type";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function StaffDashboard() {
  const [selectedStation, setSelectedStation] = useState<any>(null);

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

  // Listen for station changes (when station is changed from sidebar)
  useEffect(() => {
    const handleStationChange = (event: CustomEvent) => {
      setSelectedStation(event.detail);
    };

    window.addEventListener("stationChanged", handleStationChange as EventListener);
    return () => window.removeEventListener("stationChanged", handleStationChange as EventListener);
  }, []);

  // Fetch batteries data for the selected station
  const { data: batteriesData, isLoading, error } = useStationBatteries(
    selectedStation?.id || "",
    {}
  );

  // Fetch recent transactions - fetch more to filter completed ones
  const { data: transactionsData, isLoading: isLoadingTransactions } = useStaffTransactions({
    page: 1,
    limit: 20, // Fetch more to ensure we have enough completed transactions
    station_id: selectedStation?.id,
  });

  // Fetch recent battery movements (exchange requests)
  const { data: movementsData, isLoading: isLoadingMovements } = useBatteryMovements(
    {
      page: 1,
      limit: 5,
      sortBy: "created_at",
      sortOrder: "DESC",
    },
    selectedStation?.id
  );

  // Calculate battery counts from real data
  const allBatteries = batteriesData?.batteries || [];
  const totalCount = allBatteries.length;
  const availableCount = allBatteries.filter(battery => battery.status === "available").length;
  const chargingCount = allBatteries.filter(battery => battery.status === "charging").length;
  const maintenanceCount = allBatteries.filter(battery => battery.status === "maintenance").length;
  const damagedCount = allBatteries.filter(battery => battery.status === "damaged").length;
  const inUseCount = allBatteries.filter(battery => battery.status === "in_use").length;
  const reservedCount = allBatteries.filter(battery => battery.status === "reserved").length;

  const statsRow1 = [
    {
      title: "Tổng số lượng pin",
      value: totalCount.toString(),
      changeType: "positive" as const,
      icon: Package,
      color: "text-gray-600",
    },
    {
      title: "Pin Khả Dụng",
      value: availableCount.toString(),
      changeType: "positive" as const,
      icon: Battery,
      color: "text-green-600",
    },
    {
      title: "Pin đang dùng",
      value: inUseCount.toString(),
      changeType: "positive" as const,
      icon: User,
      color: "text-purple-600",
    },
  ];

  const statsRow2 = [
    {
      title: "Pin Đang Sạc",
      value: chargingCount.toString(),
      changeType: "positive" as const,
      icon: Zap,
      color: "text-blue-600",
    },
    {
      title: "Pin Đặt trước",
      value: reservedCount.toString(),
      changeType: "positive" as const,
      icon: Battery,
      color: "text-yellow-600",
    },
    {
      title: "Pin Cần Bảo Trì",
      value: maintenanceCount.toString(),
      changeType: "positive" as const,
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Pin Hỏng",
      value: damagedCount.toString(),
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-red-600",
    },
  ];

  // Get recent completed transactions (limit to 5)
  const recentTransactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    // Filter only completed transactions and limit to 5
    return transactionsData.data
      .filter((transaction) => transaction.status === TransactionStatus.COMPLETED)
      .slice(0, 5);
  }, [transactionsData]);

  // Get recent exchange requests (limit to 5, only sub-requests)
  const recentExchangeRequests = useMemo(() => {
    if (!movementsData?.data || !selectedStation?.id) return [];
    
    return movementsData.data
      .filter((movement) => {
        // Only show sub-requests (has parent_request_id)
        if (!movement.parent_request_id) return false;
        
        // Only show requests related to staff's station
        const isSourceStation = movement.from_station_id === selectedStation.id;
        const isDestinationStation = movement.to_station_id === selectedStation.id;
        
        return isSourceStation || isDestinationStation;
      })
      .slice(0, 5);
  }, [movementsData, selectedStation]);

  // Helper function to get transaction status badge
  const getTransactionStatusBadge = (status: TransactionStatus) => {
    if (status === TransactionStatus.COMPLETED) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Hoàn thành
        </Badge>
      );
    }
    if (status === TransactionStatus.FAILED || status === TransactionStatus.CANCELLED) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {status === TransactionStatus.FAILED ? "Thất bại" : "Đã hủy"}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Đang xử lý
      </Badge>
    );
  };

  // Helper function to get exchange request status badge
  const getExchangeStatusBadge = (status: BatteryMovementStatus) => {
    if (status === BatteryMovementStatus.COMPLETED) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Hoàn thành
        </Badge>
      );
    }
    if (status === BatteryMovementStatus.APPROVED) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Đã xác nhận
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Chờ xác nhận
      </Badge>
    );
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "Không xác định";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu trạm...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Lỗi tải dữ liệu</p>
          <p className="text-sm text-gray-500">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng Quan Trạm</h1>
          <p className="text-gray-600">
            Trạm làm việc: {selectedStation?.name || "Chưa chọn trạm"}
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Đang hoạt động
        </Badge>
      </div>

      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsRow1.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsRow2.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities - Split into 2 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowLeftRight className="w-5 h-5 mr-2" />
              Giao Dịch Gần Đây
            </CardTitle>
            <CardDescription>Các giao dịch mới nhất tại trạm</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                Chưa có giao dịch nào
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          transaction.status === TransactionStatus.COMPLETED
                            ? "bg-green-500"
                            : transaction.status === TransactionStatus.FAILED ||
                              transaction.status === TransactionStatus.CANCELLED
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.swap_order?.user?.name
                            ? `Giao dịch với ${transaction.swap_order.user.name}`
                            : `Giao dịch #${transaction.id.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {getTransactionStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Exchange Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitCompare className="w-5 h-5 mr-2" />
              Yêu Cầu Đổi Chéo Pin Gần Đây
            </CardTitle>
            <CardDescription>Các yêu cầu trao đổi pin giữa các trạm</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMovements ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : recentExchangeRequests.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                Chưa có yêu cầu đổi chéo pin nào
              </div>
            ) : (
              <div className="space-y-3">
                {recentExchangeRequests.map((request) => {
                  const isSourceStation = request.from_station_id === selectedStation?.id;
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            request.status === BatteryMovementStatus.COMPLETED
                              ? "bg-green-500"
                              : request.status === BatteryMovementStatus.APPROVED
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {isSourceStation
                              ? `Gửi pin đến ${request.to_station?.name || "trạm khác"}`
                              : `Nhận pin từ ${request.from_station?.name || "trạm khác"}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(request.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {getExchangeStatusBadge(request.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
