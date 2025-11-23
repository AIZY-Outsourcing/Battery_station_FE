"use client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRevenueReport } from "@/hooks/admin/useRevenueReport";

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

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateStr: string): string => {
  return format(new Date(dateStr), "dd/MM/yyyy");
};

export default function RevenuePage() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of year
    to: new Date(), // Today
  });

  // Build API params from date range
  const apiParams = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    
    return {
      date_from: format(dateRange.from, "yyyy-MM-dd"),
      date_to: format(dateRange.to, "yyyy-MM-dd"),
    };
  }, [dateRange]);

  // Fetch revenue report data
  const { data, isLoading, error } = useRevenueReport(apiParams);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải báo cáo doanh thu...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground">
                {error?.message || "Không thể tải báo cáo doanh thu"}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
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
            <DatePickerWithRange 
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Doanh thu từ {formatDate(data.date_from)} - {formatDate(data.date_to)}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(data.total_revenue)}
              </div>
              <p className={`text-xs ${data.revenue_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.revenue_growth_percentage >= 0 ? (
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="inline h-3 w-3 mr-1 rotate-180" />
                )}
                {Math.abs(data.revenue_growth_percentage).toFixed(1)}% so với kỳ trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Số lượt mua lẻ
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {data.total_single_purchase_swaps.toLocaleString()}
              </div>
              <p className={`text-xs ${data.single_purchase_swaps_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.single_purchase_swaps_growth_percentage >= 0 ? '↑' : '↓'} 
                {Math.abs(data.single_purchase_swaps_growth_percentage).toFixed(1)}% so với kỳ trước
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
              <div className="text-2xl font-bold text-accent">
                {formatCurrency(data.subscription_revenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((data.subscription_revenue / data.total_revenue) * 100).toFixed(1)}% tổng doanh thu
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
              <div className="text-2xl font-bold text-primary">
                {data.total_batteries_swapped.toLocaleString()}
              </div>
              <p className={`text-xs ${data.batteries_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.batteries_growth_percentage >= 0 ? '↑' : '↓'} 
                {Math.abs(data.batteries_growth_percentage).toFixed(1)}% so với kỳ trước
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
                    labels: data.monthly_revenue.map((item) => `T${item.month}`),
                    datasets: [
                      {
                        label: "Doanh thu (triệu VNĐ)",
                        data: data.monthly_revenue.map((item) => item.revenue / 1000000),
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
              <CardTitle>
                Doanh thu từ {formatDate(data.date_from)} đến {formatDate(data.date_to)}
              </CardTitle>
              <CardDescription>Xu hướng doanh thu hàng ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Line
                  data={{
                    labels: data.daily_revenue.map((item) => format(new Date(item.date), "dd/MM")),
                    datasets: [
                      {
                        label: "Doanh thu (VNĐ)",
                        data: data.daily_revenue.map((item) => item.revenue),
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
              <CardTitle>
                Số lượt đổi theo trạm từ {formatDate(data.date_from)} đến {formatDate(data.date_to)}
              </CardTitle>
              <CardDescription>
                Phân bổ số lượt đổi pin của các trạm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Pie
                  data={{
                    labels: data.station_revenue.map((item) => item.station_name),
                    datasets: [
                      {
                        data: data.station_revenue.map((item) => item.swap_count),
                        backgroundColor: [
                          "#5D7B6F",
                          "#A4C3A2",
                          "#B0D4B8",
                          "#D7F9FA",
                          "#EAE7D6",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const station = data.station_revenue[context.dataIndex];
                            return `${station.station_name}: ${station.swap_count} lượt (${station.percentage.toFixed(1)}%)`;
                          },
                        },
                      },
                    },
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
