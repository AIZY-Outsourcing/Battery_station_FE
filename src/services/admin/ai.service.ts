import api from "@/lib/api";
import {
  AIInsightsResponse,
  StationOverloadForecastsResponse,
  StationRecommendation,
  DemandPrediction,
  ModelPerformance,
  AIOverviewStats,
} from "@/types/admin/ai.type";

export const getAIInsights = async () => {
  const response = await api.get<AIInsightsResponse>("/ai/insights");
  return response.data;
};

export const getStationOverloadForecasts = async () => {
  const response = await api.get<StationOverloadForecastsResponse>(
    "/ai/station-overload-forecasts"
  );
  return response.data;
};

export const getStationRecommendations = async () => {
  const response = await api.get<{ data: StationRecommendation[] }>(
    "/ai/station-recommendations"
  );
  return response.data;
};

export const getDemandPrediction = async () => {
  const response = await api.get<{ data: DemandPrediction[] }>(
    "/ai/demand-prediction"
  );
  return response.data;
};

export const getModelPerformance = async () => {
  const response = await api.get<{ data: ModelPerformance }>(
    "/ai/model-performance"
  );
  return response.data;
};

export const getAIOverviewStats = async () => {
  const response = await api.get<{ data: AIOverviewStats }>(
    "/ai/overview-stats"
  );
  return response.data;
};

