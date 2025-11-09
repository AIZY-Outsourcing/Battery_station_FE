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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Loader2,
} from "lucide-react";
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
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useGetSubscriptionPackages,
  useDeleteSubscriptionPackage,
} from "@/hooks/admin/useSubscriptionPackages";
import useSubscriptionPackagesStore from "@/stores/subscription-packages.store";
import { toast } from "sonner";
import PaginationControls from "@/components/ui/pagination-controls";

export default function SubscriptionsPage() {
  const {
    queryParams,
    searchTerm,
    setSearchTerm,
    setPage,
    setLimit,
    setSorting,
  } = useSubscriptionPackagesStore();
  const { data, isLoading, error, refetch } =
    useGetSubscriptionPackages(queryParams);
  const deleteSubscriptionPackage = useDeleteSubscriptionPackage();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  // Update query params when search term changes
  useEffect(() => {
    useSubscriptionPackagesStore.setState((state) => ({
      queryParams: {
        ...state.queryParams,
        search: searchTerm || undefined,
        page: 1,
      },
    }));
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSubscriptionPackage.mutateAsync(deleteId);
      toast.success("Xóa gói thuê pin thành công");
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Xóa gói thuê pin thất bại"
      );
    }
  };

  const subscriptions = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi</CardTitle>
            <CardDescription>
              Không thể tải danh sách gói thuê pin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Thử lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý gói thuê pin
          </h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các gói thuê pin
          </p>
        </div>
        <Link href="/admin/users/subscriptions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo gói mới
          </Button>
        </Link>
      </div>

      {/* Subscription Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng gói</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : total}
            </div>
            <p className="text-xs text-muted-foreground">Gói đang cung cấp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Giá trung bình
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : subscriptions.length > 0 ? (
                `${(
                  subscriptions.reduce(
                    (sum, sub) => sum + parseFloat(sub.price),
                    0
                  ) / subscriptions.length
                ).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}`
              ) : (
                "0"
              )}
            </div>
            <p className="text-xs text-muted-foreground">VNĐ/gói</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt đổi TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : subscriptions.length > 0 ? (
                Math.round(
                  subscriptions.reduce((sum, sub) => sum + sub.quota_swaps, 0) /
                    subscriptions.length
                )
              ) : (
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Lượt/gói trung bình</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời hạn TB</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : subscriptions.length > 0 ? (
                Math.round(
                  subscriptions.reduce(
                    (sum, sub) => sum + sub.duration_days,
                    0
                  ) / subscriptions.length
                )
              ) : (
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Ngày/gói trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói thuê</CardTitle>
          <CardDescription>Quản lý các gói thuê pin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên gói..."
                className="pl-8"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy gói thuê pin nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã gói</TableHead>
                    <TableHead>Tên gói</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Lượt đổi</TableHead>
                    <TableHead>Thời hạn</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium font-mono text-xs">
                        {subscription.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {subscription.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {parseFloat(subscription.price).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {subscription.quota_swaps} lượt
                        </Badge>
                      </TableCell>
                      <TableCell>{subscription.duration_days} ngày</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {subscription.description}
                      </TableCell>
                      <TableCell>
                        {new Date(subscription.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/admin/users/subscriptions/${subscription.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/admin/users/subscriptions/${subscription.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => setDeleteId(subscription.id)}
                            disabled={deleteSubscriptionPackage.isPending}
                          >
                            {deleteSubscriptionPackage.isPending &&
                            deleteId === subscription.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <PaginationControls
                    meta={{
                      page: queryParams.page || 1,
                      limit: queryParams.limit || 10,
                      total: total,
                      totalPages: totalPages,
                    }}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Popular Packages */}
      {!isLoading && subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách gói thuê</CardTitle>
            <CardDescription>Các gói thuê pin hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.slice(0, 5).map((subscription, index) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{subscription.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {parseFloat(subscription.price).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.quota_swaps} lượt /{" "}
                      {subscription.duration_days} ngày
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa gói thuê pin này? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSubscriptionPackage.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteSubscriptionPackage.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteSubscriptionPackage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
