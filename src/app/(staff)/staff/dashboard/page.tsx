"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap, AlertTriangle, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useStationBatteries } from "@/hooks/staff/useStationBatteries";

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

  // Calculate battery counts from real data
  const allBatteries = batteriesData?.batteries || [];
  const availableCount = allBatteries.filter(battery => battery.status === "available").length;
  const chargingCount = allBatteries.filter(battery => battery.status === "charging").length;
  const maintenanceCount = allBatteries.filter(battery => battery.status === "maintenance").length;
  const damagedCount = allBatteries.filter(battery => battery.status === "damaged").length;
  const inUseCount = allBatteries.filter(battery => battery.status === "in-use").length;

  const stats = [
    {
      title: "Pin Khả Dụng",
      value: availableCount.toString(),
      changeType: "positive" as const,
      icon: Battery,
      color: "text-green-600",
    },
    {
      title: "Pin Đang Sạc",
      value: chargingCount.toString(),
      changeType: "positive" as const,
      icon: Zap,
      color: "text-blue-600",
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

  const recentActivities = [
    {
      id: 1,
      type: "swap",
      description: "Thay pin cho khách hàng #KH001",
      time: "2 phút trước",
      status: "completed",
    },
    {
      id: 2,
      type: "maintenance",
      description: "Kiểm tra pin #PIN-045",
      time: "15 phút trước",
      status: "in-progress",
    },
    {
      id: 3,
      type: "swap",
      description: "Thay pin cho khách hàng #KH002",
      time: "32 phút trước",
      status: "completed",
    },
    {
      id: 4,
      type: "alert",
      description: "Pin #PIN-023 cần bảo trì",
      time: "1 giờ trước",
      status: "pending",
    },
  ];

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Hoạt Động Gần Đây
          </CardTitle>
          <CardDescription>Các hoạt động mới nhất tại trạm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : activity.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    activity.status === "completed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : activity.status === "in-progress"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }
                >
                  {activity.status === "completed"
                    ? "Hoàn thành"
                    : activity.status === "in-progress"
                    ? "Đang xử lý"
                    : "Chờ xử lý"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
