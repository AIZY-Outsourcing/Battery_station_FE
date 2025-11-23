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
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const revenueData = [
  { month: "T1", revenue: 2400000, swaps: 1200, subscriptions: 1200000 },
  { month: "T2", revenue: 2800000, swaps: 1400, subscriptions: 1400000 },
  { month: "T3", revenue: 3200000, swaps: 1600, subscriptions: 1600000 },
  { month: "T4", revenue: 2900000, swaps: 1450, subscriptions: 1450000 },
  { month: "T5", revenue: 3500000, swaps: 1750, subscriptions: 1750000 },
  { month: "T6", revenue: 3800000, swaps: 1900, subscriptions: 1900000 },
  { month: "T7", revenue: 4200000, swaps: 2100, subscriptions: 2100000 },
  { month: "T8", revenue: 4500000, swaps: 2250, subscriptions: 2250000 },
  { month: "T9", revenue: 4100000, swaps: 2050, subscriptions: 2050000 },
  { month: "T10", revenue: 4800000, swaps: 2400, subscriptions: 2400000 },
  { month: "T11", revenue: 5200000, swaps: 2600, subscriptions: 2600000 },
  { month: "T12", revenue: 5500000, swaps: 2750, subscriptions: 2750000 },
];

const dailyRevenueData = [
  { day: "T2", revenue: 180000 },
  { day: "T3", revenue: 220000 },
  { day: "T4", revenue: 195000 },
  { day: "T5", revenue: 240000 },
  { day: "T6", revenue: 280000 },
  { day: "T7", revenue: 320000 },
  { day: "CN", revenue: 290000 },
];

const stationSwapData = [
  { name: "Trạm Quận 1", value: 520, color: "#5D7B6F" },
  { name: "Trạm Cầu Giấy", value: 420, color: "#A4C3A2" },
  { name: "Trạm Đà Nẵng", value: 380, color: "#B0D4B8" },
  { name: "Trạm Bình Thạnh", value: 310, color: "#D7F9FA" },
  { name: "Khác", value: 190, color: "#EAE7D6" },
];

export default function RevenuePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Báo cáo doanh thu
            </h1>
            <p className="text-muted-foreground">
              Theo dõi doanh thu và số lượt đổi pin theo thời gian
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doanh thu tháng này
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">5.5M VNĐ</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doanh thu từ đổi pin
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">2.75M VNĐ</div>
              <p className="text-xs text-muted-foreground">
                50% tổng doanh thu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doanh thu từ gói thuê
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">2.75M VNĐ</div>
              <p className="text-xs text-muted-foreground">
                50% tổng doanh thu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lượt đổi pin
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2,750</div>
              <p className="text-xs text-muted-foreground">
                +8.2% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Monthly Revenue Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>
                Biểu đồ doanh thu và số lượt đổi pin trong năm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "400px" }}>
                <Bar
                  data={{
                    labels: revenueData.map((item) => item.month),
                    datasets: [
                      {
                        label: "Doanh thu (triệu VNĐ)",
                        data: revenueData.map((item) => item.revenue / 1000000),
                        backgroundColor: "#5D7B6F",
                        yAxisID: "y",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Doanh thu (triệu VNĐ)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Daily Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu 7 ngày qua</CardTitle>
              <CardDescription>Xu hướng doanh thu hàng ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Line
                  data={{
                    labels: dailyRevenueData.map((item) => item.day),
                    datasets: [
                      {
                        label: "Doanh thu (VNĐ)",
                        data: dailyRevenueData.map((item) => item.revenue),
                        borderColor: "#5D7B6F",
                        backgroundColor: "#5D7B6F",
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

          {/* Revenue by Station */}
          <Card>
            <CardHeader>
              <CardTitle>Số lượt đổi theo trạm</CardTitle>
              <CardDescription>
                Phân bổ số lượt đổi pin của các trạm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Pie
                  data={{
                    labels: stationSwapData.map((item) => item.name),
                    datasets: [
                      {
                        data: stationSwapData.map((item) => item.value),
                        backgroundColor: stationSwapData.map(
                          (item) => item.color
                        ),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
