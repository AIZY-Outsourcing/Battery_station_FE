"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Save, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  SubscriptionPackageSchema,
  CreateSubscriptionPackageRequest,
} from "@/schemas/subscription-package.schema";
import {
  useGetSubscriptionPackage,
  useUpdateSubscriptionPackage,
} from "@/hooks/admin/useSubscriptionPackages";

export default function EditSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const { data: subscriptionData, isLoading } =
    useGetSubscriptionPackage(subscriptionId);
  const updateSubscription = useUpdateSubscriptionPackage();

  const form = useForm<CreateSubscriptionPackageRequest>({
    resolver: zodResolver(SubscriptionPackageSchema),
    defaultValues: {
      name: "",
      price: "",
      quota_swaps: 0,
      duration_days: 0,
      description: "",
    },
  });

  // Reset form when subscription loaded
  useEffect(() => {
    if (subscriptionData?.data) {
      const subscription = subscriptionData.data;
      form.reset({
        name: subscription.name,
        price: subscription.price,
        quota_swaps: subscription.quota_swaps,
        duration_days: subscription.duration_days,
        description: subscription.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionData]);

  const onSubmit = async (data: CreateSubscriptionPackageRequest) => {
    try {
      await updateSubscription.mutateAsync({ id: subscriptionId, data });
      toast.success("Cập nhật gói thuê thành công");
      router.push(`/admin/users/subscriptions/${subscriptionId}`);
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscriptionData?.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi</CardTitle>
            <CardDescription>Không tìm thấy gói thuê pin</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/users/subscriptions">Quay lại danh sách</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/users/subscriptions/${subscriptionId}`}>
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa gói thuê
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin gói thuê pin
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Thông tin chi tiết về gói thuê pin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên gói *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Gói Unlimited" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá (VNĐ) *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="500.000"
                              {...field}
                              onChange={(e) => {
                                // Chỉ giữ lại số
                                const value = e.target.value.replace(/\D/g, "");
                                // Format với dấu chấm phân cách hàng nghìn
                                const formatted = value.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  "."
                                );
                                field.onChange(value); // Lưu giá trị số thô
                                e.target.value = formatted; // Hiển thị giá trị đã format
                              }}
                              value={
                                field.value
                                  ? field.value.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      "."
                                    )
                                  : ""
                              }
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              VNĐ
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời hạn (ngày) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Ví dụ: 30 ngày = 1 tháng
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="quota_swaps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượt đổi pin *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Số lượt đổi pin được phép trong kỳ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
                <CardDescription>
                  Thông tin chi tiết về gói thuê
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả gói *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả ngắn gọn về gói thuê"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Lưu ý</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Việc thay đổi giá hoặc tính năng của gói sẽ không ảnh
                        hưởng đến các người dùng đang sử dụng gói này cho đến
                        khi họ gia hạn.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
              <CardDescription>
                Xem trước thông tin gói trước khi lưu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Tên gói:</span>
                  <span className="text-sm">
                    {form.watch("name") || "Chưa nhập"}
                  </span>
                </div>
                <div className="flex justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Giá:</span>
                  <span className="text-sm font-bold text-primary">
                    {form.watch("price")
                      ? parseFloat(form.watch("price") || "0").toLocaleString(
                          "vi-VN"
                        )
                      : 0}{" "}
                    VNĐ
                  </span>
                </div>
                <div className="flex justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Thời hạn:</span>
                  <span className="text-sm">
                    {form.watch("duration_days")} ngày
                  </span>
                </div>
                <div className="flex justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Số lượt đổi:</span>
                  <span className="text-sm">
                    {form.watch("quota_swaps")} lượt
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/admin/users/subscriptions/${subscriptionId}`}>
                Hủy
              </Link>
            </Button>
            <Button type="submit" disabled={updateSubscription.isPending}>
              {updateSubscription.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
