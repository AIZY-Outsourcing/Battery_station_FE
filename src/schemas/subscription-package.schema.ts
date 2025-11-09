import { z } from "zod";

export const SubscriptionPackageSchema = z.object({
  name: z.string().min(1, "Tên gói là bắt buộc"),
  price: z.string().min(1, "Giá là bắt buộc"),
  quota_swaps: z.number().min(1, "Số lượt đổi phải lớn hơn 0"),
  duration_days: z.number().min(1, "Thời hạn phải lớn hơn 0"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
});

export type CreateSubscriptionPackageRequest = z.infer<
  typeof SubscriptionPackageSchema
>;

export type UpdateSubscriptionPackageRequest = Partial<CreateSubscriptionPackageRequest>;
