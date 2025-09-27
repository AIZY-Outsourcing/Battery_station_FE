"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Battery,
  Users,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const demandPrediction = [
  { month: "T1", current: 1200, predicted: 1350, confidence: 85 },
  { month: "T2", current: 1400, predicted: 1580, confidence: 88 },
  { month: "T3", current: 1600, predicted: 1820, confidence: 82 },
  { month: "T4", current: 1450, predicted: 1650, confidence: 90 },
  { month: "T5", current: 1750, predicted: 2100, confidence: 87 },
  { month: "T6", current: 1900, predicted: 2300, confidence: 85 },
];

const stationRecommendations = [
  {
    stationId: "ST001",
    stationName: "Trạm Quận 1",
    currentCapacity: 52,
    currentUsage: 87,
    predictedUsage: 95,
    recommendedAction: "add_batteries",
    recommendedAmount: 15,
    priority: "high",
    reason: "Dự báo sẽ quá tải trong 2 tuần tới",
    confidence: 92,
    impact: "Giảm thời gian chờ từ 3.2 phút xuống 1.8 phút",
  },
  {
    stationId: "ST002",
    stationName: "Trạm Cầu Giấy",
    currentCapacity: 48,
    currentUsage: 72,
    predictedUsage: 68,
    recommendedAction: "redistribute",
    recommendedAmount: 8,
    priority: "medium",
    reason: "Có thể điều phối bớt pin sang trạm khác",
    confidence: 78,
    impact: "Tối ưu hóa tồn kho và giảm chi phí bảo trì",
  },
  {
    stationId: "ST004",
    stationName: "Trạm Bình Thạnh",
    currentCapacity: 45,
    currentUsage: 95,
    predictedUsage: 105,
    recommendedAction: "upgrade_infrastructure",
    recommendedAmount: 25,
    priority: "critical",
    reason: "Cần nâng cấp hạ tầng để đáp ứng nhu cầu tăng cao",
    confidence: 95,
    impact: "Tăng công suất 55%, giảm tình trạng quá tải",
  },
  {
    stationId: "ST003",
    stationName: "Trạm Đà Nẵng",
    currentCapacity: 60,
    currentUsage: 68,
    predictedUsage: 72,
    recommendedAction: "maintain",
    recommendedAmount: 0,
    priority: "low",
    reason: "Hoạt động ổn định, không cần thay đổi",
    confidence: 89,
    impact: "Duy trì hiệu suất tốt hiện tại",
  },
];

const overloadPrediction = [
  {
    station: "Trạm Bình Thạnh",
    probability: 95,
    timeframe: "2 tuần",
    peakHours: "17:00-20:00",
    expectedWaitTime: "8-12 phút",
    severity: "critical",
  },
  {
    station: "Trạm Quận 1",
    probability: 78,
    timeframe: "3 tuần",
    peakHours: "18:00-19:00",
    expectedWaitTime: "5-8 phút",
    severity: "high",
  },
  {
    station: "Trạm Cầu Giấy",
    probability: 45,
    timeframe: "6 tuần",
    peakHours: "17:30-18:30",
    expectedWaitTime: "3-5 phút",
    severity: "medium",
  },
];

const aiInsights = [
  {
    type: "trend",
    title: "Xu hướng tăng trưởng",
    description: "Nhu cầu sử dụng dự báo tăng 23% trong 6 tháng tới",
    confidence: 88,
    impact: "high",
    recommendation: "Chuẩn bị kế hoạch mở rộng 2-3 trạm mới",
  },
  {
    type: "efficiency",
    title: "Tối ưu hóa tồn kho",
    description:
      "Có thể tiết kiệm 15% chi phí bằng cách điều phối pin thông minh",
    confidence: 82,
    impact: "medium",
    recommendation: "Áp dụng thuật toán điều phối tự động",
  },
  {
    type: "maintenance",
    title: "Dự báo bảo trì",
    description: "127 pin sẽ cần thay thế trong 3 tháng tới",
    confidence: 91,
    impact: "high",
    recommendation: "Lên kế hoạch mua sắm và thay thế pin",
  },
];

export default function AIPredictionPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Dự báo & Gợi ý
          </h1>
          <p className="text-muted-foreground">
            Phân tích thông minh và dự báo nhu cầu sử dụng để tối ưu hóa hệ
            thống
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Cập nhật dự báo
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo AI
          </Button>
        </div>
      </div>

      {/* AI Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Độ chính xác AI
            </CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">87.3%</div>
            <p className="text-xs text-muted-foreground">Dự báo 30 ngày qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cảnh báo quá tải
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-muted-foreground">Trạm có nguy cơ cao</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gợi ý tối ưu</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-xs text-muted-foreground">
              Hành động được đề xuất
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiết kiệm dự kiến
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">15%</div>
            <p className="text-xs text-muted-foreground">Chi phí vận hành</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Demand Prediction Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Dự báo nhu cầu sử dụng</CardTitle>
            <CardDescription>
              So sánh nhu cầu hiện tại và dự báo 6 tháng tới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: "400px" }}>
              <Line
                data={{
                  labels: demandPrediction.map((item) => item.month),
                  datasets: [
                    {
                      label: "Hiện tại",
                      data: demandPrediction.map((item) => item.current),
                      borderColor: "#5D7B6F",
                      backgroundColor: "#5D7B6F",
                      borderWidth: 3,
                      pointRadius: 4,
                      pointBackgroundColor: "#5D7B6F",
                      tension: 0.1,
                    },
                    {
                      label: "Dự báo",
                      data: demandPrediction.map((item) => item.predicted),
                      borderColor: "#A4C3A2",
                      backgroundColor: "#A4C3A2",
                      borderWidth: 3,
                      borderDash: [5, 5],
                      pointRadius: 4,
                      pointBackgroundColor: "#A4C3A2",
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: ${context.parsed.y} lượt`;
                        },
                      },
                    },
                  },
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

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết từ AI</CardTitle>
            <CardDescription>
              Các phân tích và xu hướng quan trọng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge
                    variant={
                      insight.impact === "high"
                        ? "destructive"
                        : insight.impact === "medium"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {insight.impact === "high"
                      ? "Cao"
                      : insight.impact === "medium"
                      ? "Trung bình"
                      : "Thấp"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Độ tin cậy: {insight.confidence}%
                  </span>
                  <Progress value={insight.confidence} className="w-16 h-2" />
                </div>
                <p className="text-xs font-medium mt-2 text-primary">
                  {insight.recommendation}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overload Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>Dự báo quá tải trạm</CardTitle>
            <CardDescription>Cảnh báo sớm về khả năng quá tải</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overloadPrediction.map((prediction, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{prediction.station}</h4>
                  <Badge
                    variant={
                      prediction.severity === "critical"
                        ? "destructive"
                        : prediction.severity === "high"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {prediction.severity === "critical"
                      ? "Khẩn cấp"
                      : prediction.severity === "high"
                      ? "Cao"
                      : "Trung bình"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Xác suất quá tải:</span>
                    <span className="font-medium">
                      {prediction.probability}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời gian dự báo:</span>
                    <span className="font-medium">{prediction.timeframe}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Giờ cao điểm:</span>
                    <span className="font-medium">{prediction.peakHours}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời gian chờ dự kiến:</span>
                    <span className="font-medium text-red-600">
                      {prediction.expectedWaitTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Station Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Gợi ý tối ưu hóa trạm</CardTitle>
          <CardDescription>
            Đề xuất cụ thể để cải thiện hiệu suất và đáp ứng nhu cầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stationRecommendations.map((rec, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{rec.stationName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Mã trạm: {rec.stationId}
                    </p>
                  </div>
                  <Badge
                    variant={
                      rec.priority === "critical"
                        ? "destructive"
                        : rec.priority === "high"
                        ? "secondary"
                        : rec.priority === "medium"
                        ? "outline"
                        : "default"
                    }
                  >
                    {rec.priority === "critical"
                      ? "Khẩn cấp"
                      : rec.priority === "high"
                      ? "Cao"
                      : rec.priority === "medium"
                      ? "Trung bình"
                      : "Thấp"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Battery className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{rec.currentCapacity}</p>
                    <p className="text-xs text-muted-foreground">
                      Công suất hiện tại
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-secondary" />
                    <p className="text-sm font-medium">{rec.currentUsage}%</p>
                    <p className="text-xs text-muted-foreground">
                      Sử dụng hiện tại
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1 text-accent" />
                    <p className="text-sm font-medium">{rec.predictedUsage}%</p>
                    <p className="text-xs text-muted-foreground">
                      Dự báo sử dụng
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <BrainCircuit className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">{rec.confidence}%</p>
                    <p className="text-xs text-muted-foreground">Độ tin cậy</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Hành động đề xuất:</span>
                    <Badge variant="outline">
                      {rec.recommendedAction === "add_batteries"
                        ? `Thêm ${rec.recommendedAmount} pin`
                        : rec.recommendedAction === "redistribute"
                        ? `Điều phối ${rec.recommendedAmount} pin`
                        : rec.recommendedAction === "upgrade_infrastructure"
                        ? `Nâng cấp +${rec.recommendedAmount} pin`
                        : "Duy trì hiện tại"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Lý do: </span>
                    <span className="text-muted-foreground">{rec.reason}</span>
                  </div>
                  <div>
                    <span className="font-medium">Tác động dự kiến: </span>
                    <span className="text-green-600">{rec.impact}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm">Áp dụng gợi ý</Button>
                  <Button size="sm" variant="outline">
                    Xem chi tiết
                  </Button>
                  <Button size="sm" variant="ghost">
                    Bỏ qua
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu suất mô hình AI</CardTitle>
          <CardDescription>
            Đánh giá độ chính xác và hiệu quả của các dự báo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg text-center">
              <h4 className="font-medium mb-2">Dự báo nhu cầu</h4>
              <div className="text-3xl font-bold text-primary mb-2">89.2%</div>
              <p className="text-sm text-muted-foreground">
                Độ chính xác trung bình
              </p>
              <div className="flex items-center justify-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +2.3% so với tháng trước
                </span>
              </div>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <h4 className="font-medium mb-2">Dự báo quá tải</h4>
              <div className="text-3xl font-bold text-secondary mb-2">
                92.7%
              </div>
              <p className="text-sm text-muted-foreground">
                Tỷ lệ cảnh báo đúng
              </p>
              <div className="flex items-center justify-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +1.8% so với tháng trước
                </span>
              </div>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <h4 className="font-medium mb-2">Tối ưu hóa</h4>
              <div className="text-3xl font-bold text-accent mb-2">85.4%</div>
              <p className="text-sm text-muted-foreground">Hiệu quả gợi ý</p>
              <div className="flex items-center justify-center mt-2">
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">
                  -0.5% so với tháng trước
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
