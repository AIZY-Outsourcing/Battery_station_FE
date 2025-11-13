"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Battery,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { useDashboardOverview } from "@/hooks/admin/useDashboard";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function AdminDashboard() {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-muted-foreground">
            Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Tổng quan hệ thống
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số trạm</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.stationStats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.stationStats.changeFromLastMonth > 0 ? "+" : ""}
              {data.stationStats.changeFromLastMonth} trạm mới trong tháng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số pin</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.batteryStats.total.toLocaleString("vi-VN")}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.batteryStats.activePercentage.toFixed(0)}% đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Người dùng hoạt động
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.userStats.totalActiveUsers.toLocaleString("vi-VN")}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.userStats.changePercentage > 0 ? "+" : ""}
              {data.userStats.changePercentage.toFixed(1)}% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượt đổi pin hôm nay
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.swapStats.swapsToday}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.swapStats.changePercentage > 0 ? "+" : ""}
              {data.swapStats.changePercentage.toFixed(0)}% so với hôm qua
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Station Status */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Trạng thái trạm đổi pin</CardTitle>
            <CardDescription>
              Tình hình hoạt động của các trạm trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.stationStatus.map((station) => (
              <div
                key={station.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {station.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {station.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {station.availableBatteries}/{station.totalBatteries}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      pin khả dụng
                    </p>
                  </div>
                  <Badge
                    variant={
                      station.status === "normal"
                        ? "default"
                        : station.status === "warning"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {station.status === "normal"
                      ? "Bình thường"
                      : station.status === "warning"
                      ? "Thấp"
                      : "Cần bổ sung"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các sự kiện quan trọng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentActivities.map((activity) => {
              const IconComponent =
                activity.severity === "success"
                  ? CheckCircle
                  : activity.severity === "warning"
                  ? AlertTriangle
                  : activity.type === "user_registration"
                  ? Users
                  : Clock;

              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <IconComponent
                    className={`h-4 w-4 mt-0.5 ${
                      activity.severity === "success"
                        ? "text-green-500"
                        : activity.severity === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Tình trạng hệ thống</CardTitle>
          <CardDescription>
            Hiệu suất và sức khỏe tổng thể của hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tỷ lệ pin khả dụng</span>
                <span className="text-sm text-muted-foreground">
                  {data.systemHealth.batteryAvailabilityRate.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={data.systemHealth.batteryAvailabilityRate}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hiệu suất trạm</span>
                <span className="text-sm text-muted-foreground">
                  {data.systemHealth.stationEfficiency.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={data.systemHealth.stationEfficiency}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Độ hài lòng khách hàng
                </span>
                <span className="text-sm text-muted-foreground">
                  {data.systemHealth.customerSatisfaction.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={data.systemHealth.customerSatisfaction}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
