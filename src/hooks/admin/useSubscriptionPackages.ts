import {
  getSubscriptionPackages,
  getSubscriptionPackageById,
  createSubscriptionPackage,
  updateSubscriptionPackage,
  deleteSubscriptionPackage,
} from "@/services/admin/subscription-package.service";
import {
  SubscriptionPackagesListResponse,
  SubscriptionPackagesParams,
  SubscriptionPackageDetailResponse,
  CreateSubscriptionPackageRequest,
  UpdateSubscriptionPackageRequest,
} from "@/types/admin/subscription-package.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetSubscriptionPackages = (params: SubscriptionPackagesParams) => {
  return useQuery<SubscriptionPackagesListResponse>({
    queryKey: ["subscription-packages", params],
    queryFn: () => getSubscriptionPackages(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useGetSubscriptionPackage = (id: string) => {
  return useQuery<SubscriptionPackageDetailResponse>({
    queryKey: ["subscription-package", id],
    queryFn: () => getSubscriptionPackageById(id),
    enabled: !!id, // Only run query when id exists
  });
};

export const useCreateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SubscriptionPackageDetailResponse,
    unknown,
    CreateSubscriptionPackageRequest
  >({
    mutationFn: createSubscriptionPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });
};

export const useUpdateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SubscriptionPackageDetailResponse,
    unknown,
    { id: string; data: UpdateSubscriptionPackageRequest }
  >({
    mutationFn: ({ id, data }) => updateSubscriptionPackage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
      queryClient.invalidateQueries({
        queryKey: ["subscription-package", variables.id],
      });
    },
  });
};

export const useDeleteSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  return useMutation<SubscriptionPackageDetailResponse, unknown, string>({
    mutationFn: (id) => deleteSubscriptionPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-packages"] });
    },
  });
};
