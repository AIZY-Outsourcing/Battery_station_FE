import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const subscriptions = [
  {
    id: "SUB001",
    name: "Gói Unlimited",
    type: "unlimited",
    price: 500000,
    duration: "1 tháng",
    swapLimit: null,
    description: "Đổi pin không giới hạn trong tháng",
    status: "active",
    activeUsers: 1247,
    totalRevenue: 623500000,
    cancellationRate: 5.2,
    createdDate: "2023-06-01",
  },
  {
    id: "SUB002",
    name: "Gói 10 lượt/tháng",
    type: "limited",
    price: 200000,
    duration: "1 tháng",
    swapLimit: 10,
    description: "10 lượt đổi pin trong tháng",
    status: "active",
    activeUsers: 892,
    totalRevenue: 178400000,
    cancellationRate: 8.1,
    createdDate: "2023-06-01",
  },
  {
    id: "SUB003",
    name: "Gói 3 tháng",
    type: "period",
    price: 1200000,
    duration: "3 tháng",
    swapLimit: null,
    description: "Đổi pin không giới hạn trong 3 tháng",
    status: "active",
    activeUsers: 567,
    totalRevenue: 680400000,
    cancellationRate: 3.8,
    createdDate: "2023-07-15",
  },
  {
    id: "SUB004",
    name: "Gói Sinh viên",
    type: "student",
    price: 150000,
    duration: "1 tháng",
    swapLimit: 8,
    description: "Gói ưu đãi cho sinh viên - 8 lượt/tháng",
    status: "inactive",
    activeUsers: 0,
    totalRevenue: 0,
    cancellationRate: 0,
    createdDate: "2023-09-01",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý gói thuê pin
          </h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các gói thuê pin, theo dõi hiệu suất và doanh thu
          </p>
        </div>
        <Link href="/admin/users/subscriptions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo gói mới
          </Button>
        </Link>
      </div>

      {/* Subscription Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng gói</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {subscriptions.length}
            </div>
            <p className="text-xs text-muted-foreground">Gói đang cung cấp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Người dùng hoạt động
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {subscriptions.reduce((sum, sub) => sum + sub.activeUsers, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Đang sử dụng gói</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu tháng
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(
                subscriptions.reduce((sum, sub) => sum + sub.totalRevenue, 0) /
                1000000
              ).toFixed(1)}
              M
            </div>
            <p className="text-xs text-muted-foreground">VNĐ từ gói thuê</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hủy TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(
                subscriptions
                  .filter((s) => s.status === "active")
                  .reduce((sum, sub) => sum + sub.cancellationRate, 0) /
                subscriptions.filter((s) => s.status === "active").length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Tỷ lệ khách hàng hủy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói thuê</CardTitle>
          <CardDescription>
            Quản lý các gói thuê pin và theo dõi hiệu suất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm theo tên gói..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại gói" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="unlimited">Không giới hạn</SelectItem>
                <SelectItem value="limited">Giới hạn lượt</SelectItem>
                <SelectItem value="period">Theo thời gian</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã gói</TableHead>
                <TableHead>Tên gói</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Giới hạn</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Tỷ lệ hủy</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.id}
                  </TableCell>
                  <TableCell>{subscription.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {subscription.type === "unlimited"
                        ? "Không giới hạn"
                        : subscription.type === "limited"
                        ? "Giới hạn lượt"
                        : subscription.type === "period"
                        ? "Theo thời gian"
                        : "Đặc biệt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {subscription.price.toLocaleString("vi-VN")} VNĐ
                  </TableCell>
                  <TableCell>{subscription.duration}</TableCell>
                  <TableCell>
                    {subscription.swapLimit
                      ? `${subscription.swapLimit} lượt`
                      : "Không giới hạn"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {subscription.activeUsers}
                  </TableCell>
                  <TableCell className="font-medium">
                    {(subscription.totalRevenue / 1000000).toFixed(1)}M VNĐ
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        subscription.cancellationRate > 10
                          ? "text-red-600"
                          : subscription.cancellationRate > 5
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {subscription.cancellationRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subscription.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {subscription.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Popular Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê gói phổ biến</CardTitle>
          <CardDescription>
            Phân tích hiệu suất của các gói thuê
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions
              .filter((s) => s.status === "active")
              .sort((a, b) => b.activeUsers - a.activeUsers)
              .map((subscription, index) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{subscription.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {subscription.activeUsers} người dùng
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(subscription.totalRevenue / 1000000).toFixed(1)}M VNĐ
                      doanh thu
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
