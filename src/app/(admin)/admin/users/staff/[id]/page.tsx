"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useGetUserById } from "@/hooks/admin/useUsers";

export default function StaffDetailPage({
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

  const staffData = response.data;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Quản trị viên</Badge>;
      case "staff":
        return <Badge variant="default">Nhân viên</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

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
            <Link href="/admin/users/staff">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết nhân viên - {staffData.name}
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và quyền hạn của nhân viên
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/users/staff/${staffData.id}/edit`}>
            <Settings className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Link>
        </Button>
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
                <p className="text-lg font-semibold">{staffData.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Vai trò
                </label>
                <div>{getRoleBadge(staffData.role)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Xác thực tài khoản
                </label>
                <div>{getVerifiedBadge(staffData.is_verified)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Xác thực 2 yếu tố
                </label>
                <div>{get2FABadge(staffData.is_2fa_enabled)}</div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p>{staffData.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </label>
                <p>{staffData.phone}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ngày tạo tài khoản
                </label>
                <p>
                  {new Date(staffData.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Cập nhật lần cuối
                </label>
                <p>
                  {new Date(staffData.updated_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin hoạt động */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Trạng thái xác thực
                </label>
                <div>
                  {staffData.is_verified ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã xác thực
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Chưa xác thực
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Bảo mật 2FA
                </label>
                <div>
                  {staffData.is_2fa_enabled ? (
                    <Badge
                      variant="default"
                      className="bg-blue-100 text-blue-800"
                    >
                      Đã bật
                    </Badge>
                  ) : (
                    <Badge variant="outline">Chưa bật</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Thời gian hoạt động
                </label>
                <p className="text-lg font-semibold">
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(staffData.created_at).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  ngày
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quyền hạn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Thông tin quyền hạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Vai trò hệ thống</p>
                <p className="text-xs text-muted-foreground">
                  {staffData.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-sm">Trạng thái</p>
                <p className="text-xs text-muted-foreground">
                  {staffData.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Shield className="h-4 w-4 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Bảo mật</p>
                <p className="text-xs text-muted-foreground">
                  {staffData.is_2fa_enabled ? "2FA Bật" : "2FA Tắt"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
