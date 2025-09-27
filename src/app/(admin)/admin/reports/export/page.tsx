import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, FileSpreadsheet, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const exportHistory = [
  {
    id: "EXP001",
    reportName: "Báo cáo doanh thu tháng 12",
    type: "revenue",
    format: "PDF",
    dateRange: "01/12/2024 - 31/12/2024",
    createdBy: "Admin",
    createdAt: "2024-01-15 14:30",
    fileSize: "2.3 MB",
    status: "completed",
  },
  {
    id: "EXP002",
    reportName: "Thống kê sử dụng trạm Q1",
    type: "usage",
    format: "Excel",
    dateRange: "01/12/2024 - 31/12/2024",
    createdBy: "Admin",
    createdAt: "2024-01-14 16:45",
    fileSize: "1.8 MB",
    status: "completed",
  },
  {
    id: "EXP003",
    reportName: "Báo cáo khách hàng tháng 12",
    type: "customer",
    format: "PDF",
    dateRange: "01/12/2024 - 31/12/2024",
    createdBy: "Staff01",
    createdAt: "2024-01-13 09:15",
    fileSize: "3.1 MB",
    status: "completed",
  },
];

export default function ExportPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Xuất báo cáo</h1>
            <p className="text-muted-foreground">
              Tạo và xuất các báo cáo tùy chỉnh theo nhu cầu
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Export Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tạo báo cáo mới</CardTitle>
              <CardDescription>
                Cấu hình và xuất báo cáo theo yêu cầu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reportName">Tên báo cáo</Label>
                <Input id="reportName" placeholder="Nhập tên báo cáo..." />
              </div>

              <div>
                <Label htmlFor="reportType">Loại báo cáo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Báo cáo doanh thu</SelectItem>
                    <SelectItem value="usage">
                      Báo cáo tần suất sử dụng
                    </SelectItem>
                    <SelectItem value="customer">Báo cáo khách hàng</SelectItem>
                    <SelectItem value="station">Báo cáo trạm</SelectItem>
                    <SelectItem value="battery">Báo cáo pin</SelectItem>
                    <SelectItem value="staff">Báo cáo nhân viên</SelectItem>
                    <SelectItem value="complaint">Báo cáo khiếu nại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Khoảng thời gian</Label>
                <DatePickerWithRange />
              </div>

              <div>
                <Label htmlFor="format">Định dạng xuất</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn định dạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Bộ lọc dữ liệu</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allStations" />
                    <Label htmlFor="allStations">Tất cả trạm</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="activeOnly" />
                    <Label htmlFor="activeOnly">Chỉ dữ liệu hoạt động</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeCharts" />
                    <Label htmlFor="includeCharts">Bao gồm biểu đồ</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="stations">Chọn trạm cụ thể (tùy chọn)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạm</SelectItem>
                    <SelectItem value="ST001">Trạm Quận 1</SelectItem>
                    <SelectItem value="ST002">Trạm Cầu Giấy</SelectItem>
                    <SelectItem value="ST003">Trạm Đà Nẵng</SelectItem>
                    <SelectItem value="ST004">Trạm Bình Thạnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả mục đích sử dụng báo cáo..."
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất báo cáo
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Lưu mẫu
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Export Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Mẫu báo cáo nhanh</CardTitle>
              <CardDescription>
                Các mẫu báo cáo được sử dụng thường xuyên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Báo cáo doanh thu tháng</h4>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Tổng hợp doanh thu, số lượt đổi pin và phân tích theo trạm
                </p>
                <Button size="sm" className="w-full">
                  <Download className="mr-2 h-3 w-3" />
                  Xuất PDF
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Thống kê sử dụng tuần</h4>
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Phân tích tần suất sử dụng và giờ cao điểm 7 ngày qua
                </p>
                <Button size="sm" className="w-full" variant="secondary">
                  <Download className="mr-2 h-3 w-3" />
                  Xuất Excel
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Báo cáo hiệu suất trạm</h4>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Đánh giá hiệu suất, tỷ lệ sử dụng và tình trạng pin
                </p>
                <Button
                  size="sm"
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Xuất PDF
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Danh sách khách hàng</h4>
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Thông tin khách hàng, gói thuê và lịch sử giao dịch
                </p>
                <Button size="sm" className="w-full" variant="secondary">
                  <Download className="mr-2 h-3 w-3" />
                  Xuất Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử xuất báo cáo</CardTitle>
            <CardDescription>
              Theo dõi các báo cáo đã được tạo và tải xuống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã báo cáo</TableHead>
                  <TableHead>Tên báo cáo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Định dạng</TableHead>
                  <TableHead>Khoảng thời gian</TableHead>
                  <TableHead>Người tạo</TableHead>
                  <TableHead>Thời gian tạo</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportHistory.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.reportName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {report.type === "revenue"
                          ? "Doanh thu"
                          : report.type === "usage"
                          ? "Sử dụng"
                          : "Khách hàng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.format}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {report.dateRange}
                    </TableCell>
                    <TableCell>{report.createdBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {report.createdAt}
                    </TableCell>
                    <TableCell>{report.fileSize}</TableCell>
                    <TableCell>
                      <Badge variant="default">Hoàn thành</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
