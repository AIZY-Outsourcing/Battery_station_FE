"use client";
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
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Battery,
  Users,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  useGetAIInsights,
  useGetStationOverloadForecasts,
  useGetStationRecommendations,
  useGetDemandPrediction,
  useGetModelPerformance,
  useGetAIOverviewStats,
} from "@/hooks/admin/useAI";

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

export default function AIPredictionPage() {
  const {
    data: insightsData,
    isLoading: insightsLoading,
    error: insightsError,
  } = useGetAIInsights();

  const {
    data: forecastsData,
    isLoading: forecastsLoading,
    error: forecastsError,
  } = useGetStationOverloadForecasts();

  const {
    data: recommendationsData,
    isLoading: recommendationsLoading,
    error: recommendationsError,
  } = useGetStationRecommendations();

  const {
    data: demandPredictionData,
    isLoading: demandPredictionLoading,
    error: demandPredictionError,
  } = useGetDemandPrediction();

  const {
    data: modelPerformanceData,
    isLoading: modelPerformanceLoading,
    error: modelPerformanceError,
  } = useGetModelPerformance();

  const {
    data: overviewStatsData,
    isLoading: overviewStatsLoading,
    error: overviewStatsError,
  } = useGetAIOverviewStats();

  // TransformInterceptor wraps response, so structure is: { data: {...}, statusCode, message, timestamp }
  // Convert data object to array if needed (API might return object with numeric keys)
  const convertToArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      // Convert object with numeric keys to array
      const values = Object.values(data);
      return Array.isArray(values[0]) ? values[0] : values;
    }
    return [];
  };

  const aiInsights = convertToArray(insightsData?.data);
  const overloadPrediction = convertToArray(forecastsData?.data);
  const stationRecommendations = convertToArray(recommendationsData?.data);
  const demandPrediction = convertToArray(demandPredictionData?.data);
  const modelPerformance = modelPerformanceData?.data;
  const overviewStats = overviewStatsData?.data;

  const getImpactVariant = (priority: string) => {
    switch (priority) {
      case "Cao":
        return "destructive";
      case "Trung bình":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityVariant = (priority: string) => {
    switch (priority) {
      case "Khẩn cấp":
        return "destructive";
      case "Cao":
        return "secondary";
      default:
        return "outline";
    }
  };
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Dự báo & Gợi ý</h1>
        <p className="text-muted-foreground">
          Phân tích thông minh và dự báo nhu cầu sử dụng để tối ưu hóa hệ thống
        </p>
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
            <div className="text-2xl font-bold text-primary">
              {overviewStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${overviewStats?.ai_accuracy || 87.3}%`
              )}
            </div>
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
            <div className="text-2xl font-bold text-red-600">
              {forecastsLoading || overviewStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : overviewStats?.overload_warnings !== undefined ? (
                overviewStats.overload_warnings
              ) : (
                overloadPrediction.filter(
                  (f) => f.priority === "Khẩn cấp" || f.priority === "Cao"
                ).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">Trạm có nguy cơ cao</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gợi ý tối ưu</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overviewStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                overviewStats?.optimization_suggestions || 0
              )}
            </div>
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
            <div className="text-2xl font-bold text-blue-600">
              {overviewStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${overviewStats?.expected_savings || 15}%`
              )}
            </div>
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
            {demandPredictionLoading ? (
              <div
                className="flex items-center justify-center"
                style={{ height: "400px" }}
              >
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : demandPredictionError ? (
              <div
                className="flex items-center justify-center"
                style={{ height: "400px" }}
              >
                <p className="text-sm text-muted-foreground">
                  Không thể tải dữ liệu dự báo
                </p>
              </div>
            ) : demandPrediction.length === 0 ? (
              <div
                className="flex items-center justify-center"
                style={{ height: "400px" }}
              >
                <p className="text-sm text-muted-foreground">
                  Không có dữ liệu dự báo
                </p>
              </div>
            ) : (
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
            )}
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
            {insightsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : insightsError ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Không thể kết nối đến server
                </p>
                <p className="text-xs text-muted-foreground">
                  {insightsError instanceof Error &&
                  insightsError.message.includes("CONNECTION_REFUSED")
                    ? "Vui lòng đảm bảo backend server đang chạy"
                    : "Có lỗi xảy ra khi tải dữ liệu"}
                </p>
              </div>
            ) : aiInsights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không có dữ liệu
              </div>
            ) : (
              aiInsights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant={getImpactVariant(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Độ tin cậy: {insight.reliability}%
                    </span>
                    <Progress
                      value={insight.reliability}
                      className="w-16 h-2"
                    />
                  </div>
                  <p className="text-xs font-medium mt-2 text-primary">
                    {insight.recommendation}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Overload Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>Dự báo quá tải trạm</CardTitle>
            <CardDescription>Cảnh báo sớm về khả năng quá tải</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {forecastsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : forecastsError ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Không thể kết nối đến server
                </p>
                <p className="text-xs text-muted-foreground">
                  {forecastsError instanceof Error &&
                  forecastsError.message.includes("CONNECTION_REFUSED")
                    ? "Vui lòng đảm bảo backend server đang chạy"
                    : "Có lỗi xảy ra khi tải dữ liệu"}
                </p>
              </div>
            ) : overloadPrediction.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không có dự báo quá tải nào
              </div>
            ) : (
              overloadPrediction.map((prediction, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{prediction.station_name}</h4>
                    <Badge variant={getSeverityVariant(prediction.priority)}>
                      {prediction.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Xác suất quá tải:</span>
                      <span className="font-medium">
                        {prediction.overload_probability}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thời gian dự báo:</span>
                      <span className="font-medium">
                        {prediction.forecast_time_weeks} tuần
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Giờ cao điểm:</span>
                      <span className="font-medium">
                        {prediction.peak_hours}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thời gian chờ dự kiến:</span>
                      <span className="font-medium text-red-600">
                        {prediction.estimated_wait_time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
          {recommendationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recommendationsError ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-medium text-destructive">
                Không thể kết nối đến server
              </p>
              <p className="text-xs text-muted-foreground">
                {recommendationsError instanceof Error &&
                recommendationsError.message.includes("CONNECTION_REFUSED")
                  ? "Vui lòng đảm bảo backend server đang chạy"
                  : "Có lỗi xảy ra khi tải dữ liệu"}
              </p>
            </div>
          ) : stationRecommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có gợi ý tối ưu hóa nào
            </div>
          ) : (
            <div className="space-y-4">
              {stationRecommendations.map((rec, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {rec.station_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mã trạm: {rec.station_id}
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
                      <p className="text-sm font-medium">
                        {rec.current_capacity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Công suất hiện tại
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Users className="h-5 w-5 mx-auto mb-1 text-secondary" />
                      <p className="text-sm font-medium">
                        {rec.current_usage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sử dụng hiện tại
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <TrendingUp className="h-5 w-5 mx-auto mb-1 text-accent" />
                      <p className="text-sm font-medium">
                        {rec.predicted_usage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dự báo sử dụng
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <BrainCircuit className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{rec.confidence}%</p>
                      <p className="text-xs text-muted-foreground">
                        Độ tin cậy
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Hành động đề xuất:</span>
                      <Badge variant="outline">
                        {rec.recommended_action === "add_batteries"
                          ? `Thêm ${rec.recommended_amount} pin`
                          : rec.recommended_action === "redistribute"
                          ? `Điều phối ${rec.recommended_amount} pin`
                          : rec.recommended_action === "upgrade_infrastructure"
                          ? `Nâng cấp +${rec.recommended_amount} pin`
                          : "Duy trì hiện tại"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Lý do: </span>
                      <span className="text-muted-foreground">
                        {rec.reason}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tác động dự kiến: </span>
                      <span className="text-green-600">{rec.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {modelPerformanceLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : modelPerformanceError ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-medium text-destructive">
                Không thể kết nối đến server
              </p>
              <p className="text-xs text-muted-foreground">
                {modelPerformanceError instanceof Error &&
                modelPerformanceError.message.includes("CONNECTION_REFUSED")
                  ? "Vui lòng đảm bảo backend server đang chạy"
                  : "Có lỗi xảy ra khi tải dữ liệu"}
              </p>
            </div>
          ) : !modelPerformance ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu hiệu suất
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-medium mb-2">Dự báo nhu cầu</h4>
                <div className="text-3xl font-bold text-primary mb-2">
                  {modelPerformance.demand_forecast_accuracy}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Độ chính xác trung bình
                </p>
                <div className="flex items-center justify-center mt-2">
                  {modelPerformance.demand_forecast_trend >= 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{modelPerformance.demand_forecast_trend}% so với tháng
                        trước
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">
                        {modelPerformance.demand_forecast_trend}% so với tháng
                        trước
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-medium mb-2">Dự báo quá tải</h4>
                <div className="text-3xl font-bold text-secondary mb-2">
                  {modelPerformance.overload_forecast_accuracy}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Tỷ lệ cảnh báo đúng
                </p>
                <div className="flex items-center justify-center mt-2">
                  {modelPerformance.overload_forecast_trend >= 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{modelPerformance.overload_forecast_trend}% so với
                        tháng trước
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">
                        {modelPerformance.overload_forecast_trend}% so với tháng
                        trước
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-medium mb-2">Tối ưu hóa</h4>
                <div className="text-3xl font-bold text-accent mb-2">
                  {modelPerformance.optimization_efficiency}%
                </div>
                <p className="text-sm text-muted-foreground">Hiệu quả gợi ý</p>
                <div className="flex items-center justify-center mt-2">
                  {modelPerformance.optimization_trend >= 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        +{modelPerformance.optimization_trend}% so với tháng
                        trước
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">
                        {modelPerformance.optimization_trend}% so với tháng
                        trước
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
