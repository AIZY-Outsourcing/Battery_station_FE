import api from "@/lib/api";
import {
  SubscriptionPackagesParams,
  SubscriptionPackagesListResponse,
  CreateSubscriptionPackageRequest,
  UpdateSubscriptionPackageRequest,
} from "@/types/admin/subscription-package.type";

export const getSubscriptionPackages = async (
  params: SubscriptionPackagesParams
): Promise<SubscriptionPackagesListResponse> => {
  const res = await api.get("/subscription-packages", { params });
  return res.data;
};

export const getSubscriptionPackageById = async (id: string) => {
  const res = await api.get(`/subscription-packages/${id}`);
  return res.data;
};

export const createSubscriptionPackage = async (
  data: CreateSubscriptionPackageRequest
) => {
  const res = await api.post("/subscription-packages", data);
  return res.data;
};

export const updateSubscriptionPackage = async (
  id: string,
  data: UpdateSubscriptionPackageRequest
) => {
  const res = await api.put(`/subscription-packages/${id}`, data);
  return res.data;
};

export const deleteSubscriptionPackage = async (id: string) => {
  const res = await api.delete(`/subscription-packages/${id}`);
  return res.data;
};
