import { useQuery } from "@tanstack/react-query";
import {
  getAIInsights,
  getStationOverloadForecasts,
  getStationRecommendations,
  getDemandPrediction,
  getModelPerformance,
  getAIOverviewStats,
} from "@/services/admin/ai.service";
import {
  AIInsightsResponse,
  StationOverloadForecastsResponse,
  StationRecommendation,
  DemandPrediction,
  ModelPerformance,
  AIOverviewStats,
} from "@/types/admin/ai.type";

export const useGetAIInsights = () => {
  return useQuery<AIInsightsResponse>({
    queryKey: ["ai-insights"],
    queryFn: () => getAIInsights(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useGetStationOverloadForecasts = () => {
  return useQuery<StationOverloadForecastsResponse>({
    queryKey: ["station-overload-forecasts"],
    queryFn: () => getStationOverloadForecasts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useGetStationRecommendations = () => {
  return useQuery<{ data: StationRecommendation[] }>({
    queryKey: ["station-recommendations"],
    queryFn: () => getStationRecommendations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useGetDemandPrediction = () => {
  return useQuery<{ data: DemandPrediction[] }>({
    queryKey: ["demand-prediction"],
    queryFn: () => getDemandPrediction(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useGetModelPerformance = () => {
  return useQuery<{ data: ModelPerformance }>({
    queryKey: ["model-performance"],
    queryFn: () => getModelPerformance(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useGetAIOverviewStats = () => {
  return useQuery<{ data: AIOverviewStats }>({
    queryKey: ["ai-overview-stats"],
    queryFn: () => getAIOverviewStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

