import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Battery,
  Search,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const batteries = [
  {
    id: "BT001",
    stationId: "ST001",
    stationName: "Trạm Quận 1",
    model: "LiFePO4-72V",
    capacity: "20kWh",
    soh: 95,
    status: "available",
    lastUsed: "2024-01-15 14:30",
    cycleCount: 245,
    temperature: 25,
  },
  {
    id: "BT002",
    stationId: "ST001",
    stationName: "Trạm Quận 1",
    model: "LiFePO4-72V",
    capacity: "20kWh",
    soh: 78,
    status: "charging",
    lastUsed: "2024-01-15 16:45",
    cycleCount: 892,
    temperature: 32,
  },
  {
    id: "BT003",
    stationId: "ST002",
    stationName: "Trạm Cầu Giấy",
    model: "LiFePO4-60V",
    capacity: "15kWh",
    soh: 45,
    status: "maintenance",
    lastUsed: "2024-01-14 09:15",
    cycleCount: 1456,
    temperature: 28,
  },
  {
    id: "BT004",
    stationId: "ST003",
    stationName: "Trạm Đà Nẵng",
    model: "LiFePO4-72V",
    capacity: "20kWh",
    soh: 88,
    status: "available",
    lastUsed: "2024-01-15 11:20",
    cycleCount: 567,
    temperature: 24,
  },
];

export default function BatteriesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Theo dõi pin & SoH
          </h1>
          <p className="text-muted-foreground">
            Giám sát trạng thái sức khỏe và lịch sử sử dụng của từng pin
          </p>
        </div>
        <Link href="/admin/stations/batteries/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm pin mới
          </Button>
        </Link>
      </div>

      {/* Battery Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SoH trung bình
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">76.5%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -2.3% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pin tốt (&gt;80%)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">847</div>
            <p className="text-xs text-muted-foreground">68% tổng số pin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pin cần chú ý (50-80%)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">312</div>
            <p className="text-xs text-muted-foreground">25% tổng số pin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pin cần thay (&lt;50%)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">88</div>
            <p className="text-xs text-muted-foreground">7% tổng số pin</p>
          </CardContent>
        </Card>
      </div>

      {/* Battery List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách pin chi tiết</CardTitle>
          <CardDescription>
            Theo dõi từng pin với thông tin SoH, chu kỳ sử dụng và trạng thái
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã pin hoặc trạm..."
                className="pl-8"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="available">Khả dụng</SelectItem>
                <SelectItem value="charging">Đang sạc</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo SoH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="good">Tốt (&gt;80%)</SelectItem>
                <SelectItem value="fair">Trung bình (50-80%)</SelectItem>
                <SelectItem value="poor">Kém (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã pin</TableHead>
                <TableHead>Trạm</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Dung lượng</TableHead>
                <TableHead>SoH</TableHead>
                <TableHead>Chu kỳ</TableHead>
                <TableHead>Nhiệt độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lần cuối sử dụng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batteries.map((battery) => (
                <TableRow key={battery.id}>
                  <TableCell className="font-medium">{battery.id}</TableCell>
                  <TableCell>{battery.stationName}</TableCell>
                  <TableCell>{battery.model}</TableCell>
                  <TableCell>{battery.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={battery.soh} className="w-16 h-2" />
                      <span
                        className={`text-sm font-medium ${
                          battery.soh > 80
                            ? "text-green-600"
                            : battery.soh > 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {battery.soh}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{battery.cycleCount}</TableCell>
                  <TableCell>{battery.temperature}°C</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        battery.status === "available"
                          ? "default"
                          : battery.status === "charging"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {battery.status === "available"
                        ? "Khả dụng"
                        : battery.status === "charging"
                        ? "Đang sạc"
                        : "Bảo trì"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {battery.lastUsed}
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
