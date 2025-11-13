export interface AIInsight {
  title: string;
  content: string;
  reliability: number;
  recommendation: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
}

export interface StationOverloadForecast {
  station_id: string;
  station_name: string;
  overload_probability: number;
  forecast_time_weeks: number;
  peak_hours: string;
  estimated_wait_time: string;
  priority: 'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp';
}

export interface AIInsightsResponse {
  data: AIInsight[];
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface StationOverloadForecastsResponse {
  data: StationOverloadForecast[];
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface StationRecommendation {
  station_id: string;
  station_name: string;
  current_capacity: number;
  current_usage: number;
  predicted_usage: number;
  recommended_action: 'add_batteries' | 'redistribute' | 'upgrade_infrastructure' | 'maintain';
  recommended_amount: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  confidence: number;
  impact: string;
}

export interface DemandPrediction {
  month: string;
  current: number;
  predicted: number;
  confidence: number;
}

export interface ModelPerformance {
  demand_forecast_accuracy: number;
  overload_forecast_accuracy: number;
  optimization_efficiency: number;
  demand_forecast_trend: number;
  overload_forecast_trend: number;
  optimization_trend: number;
}

export interface AIOverviewStats {
  ai_accuracy: number;
  overload_warnings: number;
  optimization_suggestions: number;
  expected_savings: number;
}

