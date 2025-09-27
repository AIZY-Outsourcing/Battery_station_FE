"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Activity,
  Clock,
  TrendingUp,
  Download,
  Zap,
  MapPin,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);
import { Badge } from "@/components/ui/badge";

const hourlyUsageData = [
  { hour: "00", swaps: 12 },
  { hour: "01", swaps: 8 },
  { hour: "02", swaps: 5 },
  { hour: "03", swaps: 3 },
  { hour: "04", swaps: 7 },
  { hour: "05", swaps: 15 },
  { hour: "06", swaps: 45 },
  { hour: "07", swaps: 89 },
  { hour: "08", swaps: 156 },
  { hour: "09", swaps: 134 },
  { hour: "10", swaps: 98 },
  { hour: "11", swaps: 87 },
  { hour: "12", swaps: 145 },
  { hour: "13", swaps: 123 },
  { hour: "14", swaps: 98 },
  { hour: "15", swaps: 87 },
  { hour: "16", swaps: 112 },
  { hour: "17", swaps: 167 },
  { hour: "18", swaps: 189 },
  { hour: "19", swaps: 145 },
  { hour: "20", swaps: 98 },
  { hour: "21", swaps: 67 },
  { hour: "22", swaps: 45 },
  { hour: "23", swaps: 23 },
];

const weeklyUsageData = [
  { day: "Thứ 2", swaps: 1240, avgTime: 3.2 },
  { day: "Thứ 3", swaps: 1180, avgTime: 2.8 },
  { day: "Thứ 4", swaps: 1320, avgTime: 3.1 },
  { day: "Thứ 5", swaps: 1450, avgTime: 3.5 },
  { day: "Thứ 6", swaps: 1680, avgTime: 4.2 },
  { day: "Thứ 7", swaps: 1890, avgTime: 4.8 },
  { day: "Chủ nhật", swaps: 1560, avgTime: 4.1 },
];

const stationUsageData = [
  {
    station: "Trạm Quận 1",
    location: "TP.HCM",
    totalSwaps: 2450,
    peakHour: "18:00-19:00",
    avgWaitTime: 2.3,
    utilizationRate: 87,
    status: "high",
  },
  {
    station: "Trạm Cầu Giấy",
    location: "Hà Nội",
    totalSwaps: 1980,
    peakHour: "17:30-18:30",
    avgWaitTime: 1.8,
    utilizationRate: 72,
    status: "normal",
  },
  {
    station: "Trạm Đà Nẵng",
    location: "Đà Nẵng",
    totalSwaps: 1650,
    peakHour: "19:00-20:00",
    avgWaitTime: 1.5,
    utilizationRate: 68,
    status: "normal",
  },
  {
    station: "Trạm Bình Thạnh",
    location: "TP.HCM",
    totalSwaps: 2890,
    peakHour: "18:30-19:30",
    avgWaitTime: 3.8,
    utilizationRate: 95,
    status: "critical",
  },
];

export default function UsagePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Báo cáo tần suất sử dụng
            </h1>
            <p className="text-muted-foreground">
              Phân tích tần suất đổi pin và giờ cao điểm của các trạm
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạm</SelectItem>
                <SelectItem value="hcm">TP.HCM</SelectItem>
                <SelectItem value="hanoi">Hà Nội</SelectItem>
                <SelectItem value="danang">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lượt đổi hôm nay
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2,847</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15.2% so với hôm qua
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Giờ cao điểm
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                18:00-19:00
              </div>
              <p className="text-xs text-muted-foreground">189 lượt đổi pin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Thời gian chờ TB
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">2.6 phút</div>
              <p className="text-xs text-muted-foreground">
                -0.3 phút so với tuần trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tỷ lệ sử dụng TB
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">80.5%</div>
              <p className="text-xs text-muted-foreground">Công suất trạm</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Hourly Usage Pattern */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Tần suất đổi pin theo giờ</CardTitle>
              <CardDescription>
                Phân tích mẫu sử dụng trong ngày để xác định giờ cao điểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "400px" }}>
                <Line
                  data={{
                    labels: hourlyUsageData.map((item) => `${item.hour}:00`),
                    datasets: [
                      {
                        label: "Số lượt đổi pin",
                        data: hourlyUsageData.map((item) => item.swaps),
                        borderColor: "#5D7B6F",
                        backgroundColor: "rgba(93, 123, 111, 0.3)",
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Usage Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tần suất theo ngày trong tuần</CardTitle>
              <CardDescription>So sánh mức độ sử dụng các ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Bar
                  data={{
                    labels: weeklyUsageData.map((item) => item.day),
                    datasets: [
                      {
                        label: "Số lượt đổi pin",
                        data: weeklyUsageData.map((item) => item.swaps),
                        backgroundColor: "#A4C3A2",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Average Wait Time */}
          <Card>
            <CardHeader>
              <CardTitle>Thời gian chờ trung bình</CardTitle>
              <CardDescription>
                Thời gian chờ theo ngày trong tuần
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Line
                  data={{
                    labels: weeklyUsageData.map((item) => item.day),
                    datasets: [
                      {
                        label: "Thời gian chờ (phút)",
                        data: weeklyUsageData.map((item) => item.avgTime),
                        borderColor: "#B0D4B8",
                        backgroundColor: "#B0D4B8",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Usage Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>So sánh tần suất sử dụng giữa các trạm</CardTitle>
            <CardDescription>
              Phân tích hiệu suất và mức độ sử dụng của từng trạm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stationUsageData.map((station, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{station.station}</p>
                      <p className="text-sm text-muted-foreground">
                        {station.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {station.totalSwaps}
                      </p>
                      <p className="text-xs text-muted-foreground">Tổng lượt</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{station.peakHour}</p>
                      <p className="text-xs text-muted-foreground">
                        Giờ cao điểm
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {station.avgWaitTime} phút
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Thời gian chờ
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {station.utilizationRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tỷ lệ sử dụng
                      </p>
                    </div>
                    <Badge
                      variant={
                        station.status === "critical"
                          ? "destructive"
                          : station.status === "high"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {station.status === "critical"
                        ? "Quá tải"
                        : station.status === "high"
                        ? "Cao"
                        : "Bình thường"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Phân tích giờ cao điểm chi tiết</CardTitle>
            <CardDescription>
              Thông tin chi tiết về các khung giờ có lượng giao dịch cao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Sáng sớm (6:00-9:00)</h4>
                  <Badge variant="secondary">Cao</Badge>
                </div>
                <p className="text-2xl font-bold text-primary">290 lượt</p>
                <p className="text-sm text-muted-foreground">
                  Chủ yếu là người đi làm
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Trưa (12:00-14:00)</h4>
                  <Badge variant="default">Trung bình</Badge>
                </div>
                <p className="text-2xl font-bold text-secondary">268 lượt</p>
                <p className="text-sm text-muted-foreground">Giờ nghỉ trưa</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Chiều tối (17:00-20:00)</h4>
                  <Badge variant="destructive">Rất cao</Badge>
                </div>
                <p className="text-2xl font-bold text-accent">501 lượt</p>
                <p className="text-sm text-muted-foreground">
                  Cao điểm nhất trong ngày
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
