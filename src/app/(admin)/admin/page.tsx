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
} from "lucide-react";

export default function AdminDashboard() {
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
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground">
              +2 trạm mới trong tháng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số pin</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground">87% đang hoạt động</p>
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
            <div className="text-2xl font-bold text-primary">8,432</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
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
            <div className="text-2xl font-bold text-primary">342</div>
            <p className="text-xs text-muted-foreground">+8% so với hôm qua</p>
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
            {[
              {
                name: "Trạm Quận 1",
                location: "TP.HCM",
                batteries: 52,
                available: 45,
                status: "normal",
              },
              {
                name: "Trạm Cầu Giấy",
                location: "Hà Nội",
                batteries: 48,
                available: 12,
                status: "low",
              },
              {
                name: "Trạm Đà Nẵng",
                location: "Đà Nẵng",
                batteries: 60,
                available: 55,
                status: "normal",
              },
              {
                name: "Trạm Bình Thạnh",
                location: "TP.HCM",
                batteries: 45,
                available: 8,
                status: "critical",
              },
            ].map((station, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {station.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {station.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {station.available}/{station.batteries}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      pin khả dụng
                    </p>
                  </div>
                  <Badge
                    variant={
                      station.status === "normal"
                        ? "default"
                        : station.status === "low"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {station.status === "normal"
                      ? "Bình thường"
                      : station.status === "low"
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
            {[
              {
                type: "success",
                message: "Điều phối 20 pin từ Trạm Quận 1 đến Trạm Bình Thạnh",
                time: "5 phút trước",
                icon: CheckCircle,
              },
              {
                type: "warning",
                message: "Trạm Cầu Giấy báo cáo pin sắp hết",
                time: "15 phút trước",
                icon: AlertTriangle,
              },
              {
                type: "info",
                message: "Khách hàng mới đăng ký gói Unlimited",
                time: "1 giờ trước",
                icon: Users,
              },
              {
                type: "warning",
                message: "Pin ID #BT-1247 cần bảo trì",
                time: "2 giờ trước",
                icon: Clock,
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <activity.icon
                  className={`h-4 w-4 mt-0.5 ${
                    activity.type === "success"
                      ? "text-green-500"
                      : activity.type === "warning"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
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
                <span className="text-sm text-muted-foreground">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hiệu suất trạm</span>
                <span className="text-sm text-muted-foreground">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Độ hài lòng khách hàng
                </span>
                <span className="text-sm text-muted-foreground">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
