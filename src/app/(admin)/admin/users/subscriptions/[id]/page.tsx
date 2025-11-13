"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Trash2,
  Loader2,
  Package,
  Calendar,
  RefreshCw,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetSubscriptionPackage,
  useDeleteSubscriptionPackage,
} from "@/hooks/admin/useSubscriptionPackages";

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const { data: subscriptionData, isLoading } =
    useGetSubscriptionPackage(subscriptionId);
  const deleteSubscription = useDeleteSubscriptionPackage();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteSubscription = async () => {
    try {
      await deleteSubscription.mutateAsync(subscriptionId);
      toast.success("Xóa gói thuê thành công!");
      router.push("/admin/users/subscriptions");
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa gói thuê"
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString("vi-VN") + " VNĐ";
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải thông tin gói thuê...</span>
        </div>
      </main>
    );
  }

  if (!subscriptionData?.data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Lỗi</CardTitle>
              <CardDescription>Không tìm thấy gói thuê pin</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/users/subscriptions">
                  Quay lại danh sách
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const subscription = subscriptionData.data;
  const isDeleted = !!subscription.deleted_at;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users/subscriptions">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {subscription.name}
              </h1>
              {isDeleted && <Badge variant="destructive">Đã xóa</Badge>}
            </div>
            <p className="text-muted-foreground">{subscription.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isDeleted ? (
            <Button variant="outline" asChild>
              <Link href={`/admin/users/subscriptions/${subscription.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleted || deleteSubscription.isPending}
              onClick={() => setDeleteDialogOpen(true)}
              title={isDeleted ? "Không thể xóa gói đã bị xóa" : "Xóa gói"}
            >
              {deleteSubscription.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa gói thuê</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa gói &ldquo;{subscription.name}&rdquo; không?
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteSubscription.isPending}>
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSubscription}
                  disabled={deleteSubscription.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteSubscription.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xóa gói"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá gói</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(subscription.price)}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription.duration_days} ngày
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượt đổi</CardTitle>
            <RefreshCw className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {subscription.quota_swaps}
            </div>
            <p className="text-xs text-muted-foreground">
              lượt trong {subscription.duration_days} ngày
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời hạn</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {subscription.duration_days}
            </div>
            <p className="text-xs text-muted-foreground">
              ngày ({Math.round(subscription.duration_days / 30)} tháng)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá/ngày</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                (
                  parseFloat(subscription.price) / subscription.duration_days
                ).toFixed(0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Chi phí trung bình mỗi ngày
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin gói
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mã gói</p>
                  <p className="font-medium font-mono text-xs break-all">
                    {subscription.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge
                    variant={isDeleted ? "destructive" : "default"}
                    className="mt-1"
                  >
                    {isDeleted ? "Đã xóa" : "Hoạt động"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Giá</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(subscription.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời hạn</p>
                  <p className="font-medium">
                    {subscription.duration_days} ngày
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Số lượt đổi</p>
                  <p className="font-medium">{subscription.quota_swaps} lượt</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá/lượt</p>
                  <p className="font-medium">
                    {formatCurrency(
                      (
                        parseFloat(subscription.price) /
                        subscription.quota_swaps
                      ).toFixed(0)
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="mt-1 text-sm">{subscription.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium text-sm">
                    {formatDate(subscription.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật lần cuối
                  </p>
                  <p className="font-medium text-sm">
                    {formatDate(subscription.updated_at)}
                  </p>
                </div>
              </div>

              {subscription.created_by && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Người tạo</p>
                    <p className="font-medium font-mono text-xs">
                      {subscription.created_by}
                    </p>
                  </div>
                  {subscription.updated_by && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Người cập nhật
                      </p>
                      <p className="font-medium font-mono text-xs">
                        {subscription.updated_by}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isDeleted && subscription.deleted_at && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">
                      Gói đã bị xóa
                    </p>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Ngày xóa: {formatDate(subscription.deleted_at)}
                  </p>
                  <p className="text-sm text-red-700">
                    Gói này đã bị xóa và không thể chỉnh sửa.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
