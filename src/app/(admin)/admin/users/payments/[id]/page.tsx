"use client";

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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Car,
} from "lucide-react";
import Link from "next/link";
import { useGetPaymentTransaction } from "@/hooks/admin/usePaymentTransactions";
import Image from "next/image";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  success: "bg-green-100 text-green-800 border-green-300",
  failed: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
};

const statusLabels = {
  pending: "Chờ xử lý",
  success: "Thành công",
  failed: "Thất bại",
  cancelled: "Đã hủy",
};

const statusIcons = {
  pending: Clock,
  success: CheckCircle2,
  failed: XCircle,
  cancelled: RefreshCw,
};

export default function PaymentTransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useGetPaymentTransaction(id);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Lỗi
            </CardTitle>
            <CardDescription>
              Không thể tải thông tin giao dịch thanh toán
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Quay lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const transaction = data.data;
  const StatusIcon = statusIcons[transaction.status];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Chi tiết giao dịch
          </h1>
          <p className="text-muted-foreground">
            Thông tin chi tiết về giao dịch thanh toán
          </p>
        </div>
        <Badge
          variant="outline"
          className={`${statusColors[transaction.status]} text-base px-4 py-2`}
        >
          <StatusIcon className="mr-2 h-4 w-4" />
          {statusLabels[transaction.status]}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Transaction Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông tin giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Mã giao dịch
              </label>
              <p className="text-lg font-mono font-semibold">
                {transaction.code}
              </p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Hệ thống
              </label>
              <p className="text-sm font-mono">{transaction.id}</p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Số tiền
              </label>
              <p className="text-2xl font-bold text-green-600">
                {parseFloat(transaction.amount).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nội dung
              </label>
              <p className="text-base mt-1">
                {transaction.content || "Không có nội dung"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người dùng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transaction.user ? (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ID Người dùng
                  </label>
                  <p className="text-sm font-mono">{transaction.user.id}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Họ và tên
                  </label>
                  <p className="text-lg font-semibold">
                    {transaction.user.name}
                  </p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-base">{transaction.user.email}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Số điện thoại
                  </label>
                  <p className="text-base">
                    {transaction.user.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <Separator />

                <Link href={`/admin/users/customers/${transaction.user_id}`}>
                  <Button variant="outline" className="w-full">
                    Xem hồ sơ người dùng
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Không có thông tin người dùng
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transaction.order ? (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ID Đơn hàng
                  </label>
                  <p className="text-sm font-mono">{transaction.order.id}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Loại đơn
                  </label>
                  <Badge variant="outline" className="mt-1">
                    {transaction.order.type === "package"
                      ? "Gói thuê"
                      : "Đơn lẻ"}
                  </Badge>
                </div>

                <Separator />

                {transaction.order.package && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Gói thuê
                      </label>
                      <p className="text-lg font-semibold">
                        {transaction.order.package.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.order.package.description}
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Giá gói
                        </label>
                        <p className="text-base font-semibold">
                          {parseFloat(
                            transaction.order.package.price
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Lượt đổi
                        </label>
                        <p className="text-base font-semibold">
                          {transaction.order.package.quota_swaps} lượt
                        </p>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Số lượng
                  </label>
                  <p className="text-base font-semibold">
                    {transaction.order.quantity}
                  </p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tổng tiền
                  </label>
                  <p className="text-xl font-bold">
                    {parseFloat(transaction.order.total_amount).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VNĐ
                  </p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Trạng thái đơn
                  </label>
                  <Badge variant="outline" className="mt-1">
                    {transaction.order.status}
                  </Badge>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Không có thông tin đơn hàng
              </p>
            )}
          </CardContent>
        </Card>

        {/* Timeline Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thời gian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Ngày tạo
              </label>
              <p className="text-base">
                {new Date(transaction.created_at).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Cập nhật lần cuối
              </label>
              <p className="text-base">
                {new Date(transaction.updated_at).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>

            {transaction.created_by && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Người tạo
                  </label>
                  <p className="text-sm font-mono">{transaction.created_by}</p>
                </div>
              </>
            )}

            {transaction.updated_by && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Người cập nhật
                  </label>
                  <p className="text-sm font-mono">{transaction.updated_by}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        {transaction.user?.vehicles && transaction.user.vehicles.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Phương tiện của người dùng
              </CardTitle>
              <CardDescription>
                Danh sách phương tiện đã đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {transaction.user.vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{vehicle.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {vehicle.manufacturer_year}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="font-mono font-semibold text-base">
                        {vehicle.plate_number}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Số VIN
                          </label>
                          <p className="font-mono text-xs">{vehicle.vin}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Mẫu xe
                          </label>
                          <p className="font-medium">
                            {vehicle.vehicle_model.name}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Loại pin
                        </label>
                        <p className="font-semibold text-sm">
                          {vehicle.battery_type.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.battery_type.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
