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
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const complaints = [
  {
    id: "CP001",
    userId: "USER123",
    userName: "Nguyễn Văn A",
    stationId: "ST001",
    stationName: "Trạm Quận 1",
    batteryId: "BT001",
    type: "battery_defect",
    title: "Pin không sạc được",
    description: "Pin vừa đổi nhưng không thể sạc được, đèn báo lỗi liên tục",
    status: "open",
    priority: "high",
    createdAt: "2024-01-15 14:30",
    updatedAt: "2024-01-15 14:30",
    assignedTo: null,
    resolution: null,
  },
  {
    id: "CP002",
    userId: "USER456",
    userName: "Trần Thị B",
    stationId: "ST002",
    stationName: "Trạm Cầu Giấy",
    batteryId: null,
    type: "station_issue",
    title: "Trạm không hoạt động",
    description: "Màn hình trạm bị đen, không thể thực hiện giao dịch",
    status: "in_progress",
    priority: "critical",
    createdAt: "2024-01-15 10:15",
    updatedAt: "2024-01-15 12:00",
    assignedTo: "Staff01",
    resolution: "Đã liên hệ kỹ thuật viên, đang kiểm tra hệ thống",
  },
  {
    id: "CP003",
    userId: "USER789",
    userName: "Lê Văn C",
    stationId: "ST003",
    stationName: "Trạm Đà Nẵng",
    batteryId: "BT003",
    type: "battery_defect",
    title: "Pin nhanh hết",
    description: "Pin mới đổi chỉ chạy được 20km thay vì 50km như bình thường",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-14 16:45",
    updatedAt: "2024-01-15 09:30",
    assignedTo: "Staff02",
    resolution: "Đã đổi pin mới cho khách hàng, pin cũ đưa vào bảo trì",
  },
];

export default function ComplaintsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý khiếu nại
          </h1>
          <p className="text-muted-foreground">
            Xử lý và theo dõi các khiếu nại từ khách hàng về pin và trạm
          </p>
        </div>
      </div>

      {/* Complaint Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng khiếu nại
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {complaints.length}
            </div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {complaints.filter((c) => c.status === "open").length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {complaints.filter((c) => c.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Đang giải quyết</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complaints.filter((c) => c.status === "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khiếu nại</CardTitle>
          <CardDescription>
            Theo dõi và xử lý tất cả các khiếu nại từ khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã khiếu nại, khách hàng..."
                className="pl-8"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="open">Chưa xử lý</SelectItem>
                <SelectItem value="in_progress">Đang xử lý</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="critical">Khẩn cấp</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KN</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Trạm</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Độ ưu tiên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người xử lý</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>{complaint.userName}</TableCell>
                  <TableCell>{complaint.stationName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {complaint.type === "battery_defect"
                        ? "Pin lỗi"
                        : "Trạm lỗi"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {complaint.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        complaint.priority === "critical"
                          ? "destructive"
                          : complaint.priority === "high"
                          ? "destructive"
                          : complaint.priority === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {complaint.priority === "critical"
                        ? "Khẩn cấp"
                        : complaint.priority === "high"
                        ? "Cao"
                        : complaint.priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        complaint.status === "open"
                          ? "destructive"
                          : complaint.status === "in_progress"
                          ? "secondary"
                          : complaint.status === "resolved"
                          ? "default"
                          : "outline"
                      }
                    >
                      {complaint.status === "open"
                        ? "Chưa xử lý"
                        : complaint.status === "in_progress"
                        ? "Đang xử lý"
                        : complaint.status === "resolved"
                        ? "Đã giải quyết"
                        : "Đã đóng"}
                    </Badge>
                  </TableCell>
                  <TableCell>{complaint.assignedTo || "Chưa gán"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {complaint.createdAt}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Chi tiết khiếu nại #{complaint.id}
                          </DialogTitle>
                          <DialogDescription>
                            Thông tin chi tiết và xử lý khiếu nại
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">
                                Khách hàng
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {complaint.userName}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Trạm
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {complaint.stationName}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Pin</label>
                              <p className="text-sm text-muted-foreground">
                                {complaint.batteryId || "Không có"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Độ ưu tiên
                              </label>
                              <Badge
                                variant={
                                  complaint.priority === "critical"
                                    ? "destructive"
                                    : complaint.priority === "high"
                                    ? "destructive"
                                    : complaint.priority === "medium"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {complaint.priority === "critical"
                                  ? "Khẩn cấp"
                                  : complaint.priority === "high"
                                  ? "Cao"
                                  : complaint.priority === "medium"
                                  ? "Trung bình"
                                  : "Thấp"}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Mô tả</label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {complaint.description}
                            </p>
                          </div>
                          {complaint.resolution && (
                            <div>
                              <label className="text-sm font-medium">
                                Giải pháp
                              </label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {complaint.resolution}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Select defaultValue={complaint.status}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Chưa xử lý</SelectItem>
                                <SelectItem value="in_progress">
                                  Đang xử lý
                                </SelectItem>
                                <SelectItem value="resolved">
                                  Đã giải quyết
                                </SelectItem>
                                <SelectItem value="closed">Đã đóng</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button>Cập nhật trạng thái</Button>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Ghi chú xử lý
                            </label>
                            <Textarea
                              placeholder="Nhập ghi chú về quá trình xử lý..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
