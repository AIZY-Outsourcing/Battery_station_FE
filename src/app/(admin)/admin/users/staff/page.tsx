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
  Users,
  Search,
  Eye,
  UserCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import PaginationControls from "@/components/ui/pagination-controls";
import { useGetUsers } from "@/hooks/admin/useUsers";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const {
    data: usersResponse,
    isLoading,
    error,
  } = useGetUsers({ sortBy: "created_at" });

  // Filter users with role "staff"
  const allStaffMembers = useMemo(() => {
    if (!usersResponse?.data) return [];

    // Convert object to array and filter by role
    const usersArray = Object.values(usersResponse.data);
    return usersArray
      .filter((user) => user.role === "staff")
      .filter((user) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone.toLowerCase().includes(search)
        );
      });
  }, [usersResponse, searchTerm]);

  // Paginate staff members
  const staffMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    return allStaffMembers.slice(startIndex, endIndex);
  }, [allStaffMembers, currentPage, pageLimit]);

  // Pagination meta data
  const paginationMeta = useMemo(
    () => ({
      page: currentPage,
      limit: pageLimit,
      total: allStaffMembers.length,
      totalPages: Math.ceil(allStaffMembers.length / pageLimit),
    }),
    [currentPage, pageLimit, allStaffMembers.length]
  );

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

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-96">
          <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

  const verifiedStaff = staffMembers.filter((s) => s.is_verified);
  const twoFAEnabledStaff = staffMembers.filter((s) => s.is_2fa_enabled);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý nhân viên
          </h1>
          <p className="text-muted-foreground">
            Quản lý nhân viên trạm đổi pin và theo dõi hiệu suất làm việc
          </p>
        </div>
      </div>

      {/* Staff Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng nhân viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {staffMembers.length}
            </div>
            <p className="text-xs text-muted-foreground">Trên toàn hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {verifiedStaff.length}
            </div>
            <p className="text-xs text-muted-foreground">Nhân viên xác thực</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bật 2FA</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {twoFAEnabledStaff.length}
            </div>
            <p className="text-xs text-muted-foreground">Bảo mật 2 lớp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa xác thực</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {staffMembers.length - verifiedStaff.length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xác thực</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>
            Quản lý thông tin và hiệu suất làm việc của nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <PaginationControls
              meta={paginationMeta}
              onPageChange={setCurrentPage}
              onLimitChange={(limit: number) => {
                setPageLimit(limit);
                setCurrentPage(1);
              }}
              disabled={isLoading}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên nhân viên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Xác thực</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    Không tìm thấy nhân viên nào
                  </TableCell>
                </TableRow>
              ) : (
                staffMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      {getVerifiedBadge(member.is_verified)}
                    </TableCell>
                    <TableCell>{get2FABadge(member.is_2fa_enabled)}</TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/users/staff/${member.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
