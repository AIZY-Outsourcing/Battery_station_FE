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
  ArrowRight,
  Plus,
  Search,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const transfers = [
  {
    id: "TF001",
    fromStation: "Trạm Quận 1",
    toStation: "Trạm Bình Thạnh",
    batteryCount: 20,
    batteryIds: ["BT001", "BT002", "BT003"],
    status: "completed",
    createdBy: "Admin",
    createdAt: "2024-01-15 09:00",
    completedAt: "2024-01-15 14:30",
    reason: "Bổ sung pin cho trạm thiếu hụt",
  },
  {
    id: "TF002",
    fromStation: "Trạm Đà Nẵng",
    toStation: "Trạm Cầu Giấy",
    batteryCount: 15,
    batteryIds: ["BT004", "BT005"],
    status: "in-transit",
    createdBy: "Admin",
    createdAt: "2024-01-15 10:30",
    completedAt: null,
    reason: "Cân bằng tồn kho",
  },
  {
    id: "TF003",
    fromStation: "Trạm Quận 1",
    toStation: "Trạm Đà Nẵng",
    batteryCount: 10,
    batteryIds: ["BT006", "BT007"],
    status: "pending",
    createdBy: "Staff01",
    createdAt: "2024-01-15 11:45",
    completedAt: null,
    reason: "Yêu cầu từ trạm",
  },
];

export default function TransferPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Điều phối pin</h1>
            <p className="text-muted-foreground">
              Quản lý việc chuyển pin giữa các trạm để tối ưu hóa tồn kho
            </p>
          </div>
          <Button asChild>
            <Link href="/stations/transfer/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo yêu cầu điều phối
            </Link>
          </Button>
        </div>

        {/* Transfer Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng yêu cầu
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {transfers.length}
              </div>
              <p className="text-xs text-muted-foreground">Trong tháng này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {transfers.filter((t) => t.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Cần xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đang vận chuyển
              </CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {transfers.filter((t) => t.status === "in-transit").length}
              </div>
              <p className="text-xs text-muted-foreground">Trên đường</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transfers.filter((t) => t.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Thành công</p>
            </CardContent>
          </Card>
        </div>

        {/* Transfer List */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử điều phối pin</CardTitle>
            <CardDescription>
              Theo dõi tất cả các yêu cầu điều phối pin giữa các trạm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã yêu cầu hoặc trạm..."
                  className="pl-8"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Đang chờ</SelectItem>
                  <SelectItem value="in-transit">Đang vận chuyển</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã yêu cầu</TableHead>
                  <TableHead>Trạm nguồn</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Trạm đích</TableHead>
                  <TableHead>Số lượng pin</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Người tạo</TableHead>
                  <TableHead>Thời gian tạo</TableHead>
                  <TableHead>Lý do</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.id}</TableCell>
                    <TableCell>{transfer.fromStation}</TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>{transfer.toStation}</TableCell>
                    <TableCell>{transfer.batteryCount} pin</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transfer.status === "completed"
                            ? "default"
                            : transfer.status === "in-transit"
                            ? "secondary"
                            : transfer.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {transfer.status === "completed"
                          ? "Hoàn thành"
                          : transfer.status === "in-transit"
                          ? "Đang vận chuyển"
                          : transfer.status === "pending"
                          ? "Đang chờ"
                          : "Lỗi"}
                      </Badge>
                    </TableCell>
                    <TableCell>{transfer.createdBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transfer.createdAt}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {transfer.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Transfer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tạo yêu cầu điều phối nhanh</CardTitle>
            <CardDescription>
              Tạo nhanh yêu cầu điều phối pin giữa các trạm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Trạm nguồn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ST001">Trạm Quận 1</SelectItem>
                  <SelectItem value="ST002">Trạm Cầu Giấy</SelectItem>
                  <SelectItem value="ST003">Trạm Đà Nẵng</SelectItem>
                  <SelectItem value="ST004">Trạm Bình Thạnh</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Trạm đích" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ST001">Trạm Quận 1</SelectItem>
                  <SelectItem value="ST002">Trạm Cầu Giấy</SelectItem>
                  <SelectItem value="ST003">Trạm Đà Nẵng</SelectItem>
                  <SelectItem value="ST004">Trạm Bình Thạnh</SelectItem>
                </SelectContent>
              </Select>

              <Input type="number" placeholder="Số lượng pin" min="1" />

              <Input placeholder="Lý do điều phối" />

              <Button className="w-full">Tạo yêu cầu</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
