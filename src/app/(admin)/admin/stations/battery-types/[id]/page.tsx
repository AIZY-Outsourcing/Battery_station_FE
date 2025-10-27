"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Battery,
  Edit,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  User,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  useGetBatteryTypeDetails,
  useDeleteBatteryType,
} from "@/hooks/admin/useBatteryTypes";
import { toast } from "sonner";

export default function BatteryTypeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batteryTypeId = params.id as string;

  const {
    data: batteryTypeData,
    isLoading,
    error,
  } = useGetBatteryTypeDetails(batteryTypeId);
  const deleteMutation = useDeleteBatteryType();

  const handleDelete = async () => {
    if (!batteryTypeData?.data) return;

    try {
      await deleteMutation.mutateAsync(batteryTypeId);
      toast.success(
        `Đã xóa loại pin "${batteryTypeData.data.name}" thành công`
      );
      router.push("/admin/stations/battery-types");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa loại pin");
      console.error("Delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              Đang tải thông tin loại pin...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !batteryTypeData?.data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-medium text-red-600">Có lỗi xảy ra</p>
              <p className="text-sm text-muted-foreground">
                Không thể tải thông tin loại pin
              </p>
              <Link href="/admin/stations/battery-types">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const batteryType = batteryTypeData.data;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/stations/battery-types">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết loại pin
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết về loại pin {batteryType.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/stations/battery-types/${batteryTypeId}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteMutation.isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa loại pin "{batteryType.name}"? Hành
                  động này không thể hoàn tác và có thể ảnh hưởng đến các pin
                  đang sử dụng loại này.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Battery Type Information */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Battery className="h-5 w-5" />
              <span>Thông tin cơ bản</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tên loại pin
              </label>
              <p className="text-lg font-semibold">{batteryType.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Mô tả</span>
              </label>
              <p className="text-sm leading-relaxed">
                {batteryType.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Thông tin hệ thống</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Ngày tạo
                </label>
                <p className="text-sm">
                  {new Date(batteryType.created_at).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Cập nhật lần cuối
                </label>
                <p className="text-sm">
                  {new Date(batteryType.updated_at).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Người tạo</span>
                </label>
                <p className="text-sm">
                  {batteryType.created_by || "Hệ thống"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Người cập nhật</span>
                </label>
                <p className="text-sm">
                  {batteryType.updated_by || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động</CardTitle>
          <CardDescription>
            Các thao tác có thể thực hiện với loại pin này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/stations/battery-types/${batteryTypeId}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin
              </Button>
            </Link>
            <Link href="/admin/stations/battery-types">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
