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
import { Battery, Zap, AlertTriangle, TrendingUp, Clock } from "lucide-react";

export default function StaffDashboard() {
  const [selectedStation, setSelectedStation] = useState<string>("");

  useEffect(() => {
    const station = localStorage.getItem("selectedStation");
    if (station) {
      setSelectedStation(station);
    }
  }, []);

  const stats = [
    {
      title: "Pin Khả Dụng",
      value: "42",
      change: "+5",
      changeType: "positive" as const,
      icon: Battery,
      color: "text-green-600",
    },
    {
      title: "Pin Đang Sạc",
      value: "18",
      change: "+2",
      changeType: "positive" as const,
      icon: Zap,
      color: "text-blue-600",
    },
    {
      title: "Pin Cần Bảo Trì",
      value: "3",
      change: "-1",
      changeType: "negative" as const,
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Giao Dịch Hôm Nay",
      value: "127",
      change: "+23",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-purple-600",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng Quan Trạm</h1>
          <p className="text-gray-600">
            Trạm làm việc: Trạm Quận {selectedStation || "1"}
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
                    : "text-red-600"
                }`}
              >
                {stat.change} từ hôm qua
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
