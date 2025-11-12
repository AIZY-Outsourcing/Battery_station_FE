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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Car,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useGetUserById } from "@/hooks/admin/useUsers";

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: response, isLoading, error } = useGetUserById(params.id);

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </main>
    );
  }

  if (error || !response?.data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-96">
          <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </main>
    );
  }

  const customerData = response.data;

  const getVerifiedBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Đã xác thực
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Chưa xác thực
      </Badge>
    );
  };

  const get2FABadge = (is2FAEnabled: boolean) => {
    return is2FAEnabled ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800">
        2FA Bật
      </Badge>
    ) : (
      <Badge variant="outline">2FA Tắt</Badge>
    );
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết khách hàng
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và phương tiện của khách hàng
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Thông tin cơ bản */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Họ và tên
                </label>
                <p className="text-lg font-semibold">{customerData.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Xác thực tài khoản
                </label>
                <div>{getVerifiedBadge(customerData.is_verified)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p>{customerData.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </label>
                <p>{customerData.phone}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Xác thực hai yếu tố (2FA)
                </label>
                <div>{get2FABadge(customerData.is_2fa_enabled)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ngày tham gia
                </label>
                <p>
                  {new Date(customerData.created_at).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Thống kê phương tiện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tổng phương tiện
                </label>
                <p className="text-2xl font-bold text-primary">
                  {customerData.vehicles?.length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Danh sách phương tiện */}
      {customerData.vehicles && customerData.vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Danh sách phương tiện
            </CardTitle>
            <CardDescription>
              Các phương tiện đã đăng ký của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên xe</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Loại pin</TableHead>
                  <TableHead>Năm sản xuất</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerData.vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.plate_number}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {vehicle.vin}
                    </TableCell>
                    <TableCell>
                      {vehicle.vehicle_model?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {vehicle.battery_type?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.manufacturer_year}</TableCell>
                    <TableCell>
                      {new Date(vehicle.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Thông tin pin chi tiết của từng xe */}
      {customerData.vehicles && customerData.vehicles.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customerData.vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {vehicle.name}
                </CardTitle>
                <CardDescription>{vehicle.plate_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Model xe
                  </label>
                  <p className="text-sm font-medium">
                    {vehicle.vehicle_model?.name || "Chưa cập nhật"}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Loại pin
                  </label>
                  <p className="text-sm font-medium">
                    {vehicle.battery_type?.name || "Chưa cập nhật"}
                  </p>
                  {vehicle.battery_type?.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {vehicle.battery_type.description}
                    </p>
                  )}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      VIN
                    </label>
                    <p className="text-xs font-mono">{vehicle.vin}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Năm SX
                    </label>
                    <p className="text-sm">{vehicle.manufacturer_year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
