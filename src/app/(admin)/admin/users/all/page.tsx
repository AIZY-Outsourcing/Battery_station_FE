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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  UserCheck,
  CheckCircle,
  XCircle,
  Shield,
  UserCog,
  RefreshCw,
  Download,
  Filter,
  Trash2,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {
  useGetUsers,
  useUpdateUserRole,
  useDeleteUser,
} from "@/hooks/admin/useUsers";
import { useMemo, useState } from "react";
import { User } from "@/types/admin/users.type";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function AllUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [twoFAFilter, setTwoFAFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  // Get current user to prevent self-modification
  const { user: currentUser } = useAuthStore();

  // Fetch users with a large limit to get as many as possible
  const {
    data: usersResponse,
    isLoading: isLoadingAll,
    error,
    refetch: fetchAllUsers,
  } = useGetUsers({
    page: 1,
    limit: 1000, // Large limit to get most users
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Update user role mutation
  const updateUserRoleMutation = useUpdateUserRole();

  // Delete user mutation
  const deleteUserMutation = useDeleteUser();

  // Extract users from response - handle both array and object structure
  const allUsers = useMemo(() => {
    if (!usersResponse?.data) return [];

    // Handle if data is an array (direct user array)
    if (Array.isArray(usersResponse.data)) {
      return usersResponse.data;
    }

    // Handle if data has nested data property
    if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
      return usersResponse.data.data;
    }

    // Handle if data is an object with user IDs as keys
    if (
      typeof usersResponse.data === "object" &&
      !Array.isArray(usersResponse.data)
    ) {
      return Object.values(usersResponse.data).filter(
        (item): item is User =>
          typeof item === "object" && item !== null && "id" in item
      );
    }

    return [];
  }, [usersResponse]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user: User) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Role filter
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      // Verification filter
      if (verificationFilter !== "all") {
        if (verificationFilter === "verified" && !user.is_verified)
          return false;
        if (verificationFilter === "unverified" && user.is_verified)
          return false;
      }

      // 2FA filter
      if (twoFAFilter !== "all") {
        if (twoFAFilter === "enabled" && !user.is_2fa_enabled) return false;
        if (twoFAFilter === "disabled" && user.is_2fa_enabled) return false;
      }

      return true;
    });
  }, [allUsers, searchTerm, roleFilter, verificationFilter, twoFAFilter]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageLimit]);

  // Statistics
  const stats = useMemo(() => {
    const total = allUsers.length;
    const customers = allUsers.filter((u: User) => u.role === "user").length;
    const staff = allUsers.filter((u: User) => u.role === "staff").length;
    const admins = allUsers.filter((u: User) => u.role === "admin").length;
    const verified = allUsers.filter((u: User) => u.is_verified).length;
    const twoFAEnabled = allUsers.filter((u: User) => u.is_2fa_enabled).length;
    const withVehicles = allUsers.filter(
      (u: User) => u.vehicles && u.vehicles.length > 0
    ).length;

    return {
      total,
      customers,
      staff,
      admins,
      verified,
      twoFAEnabled,
      withVehicles,
    };
  }, [allUsers]);

  // Pagination metadata
  const paginationMeta = useMemo(
    () => ({
      page: currentPage,
      limit: pageLimit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / pageLimit),
    }),
    [currentPage, pageLimit, filteredUsers.length]
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="destructive">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "staff":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            <UserCog className="h-3 w-3 mr-1" />
            Staff
          </Badge>
        );
      case "user":
        return (
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            Customer
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getVerifiedBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  const get2FABadge = (is2FAEnabled: boolean) => {
    return is2FAEnabled ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800">
        2FA On
      </Badge>
    ) : (
      <Badge variant="outline">2FA Off</Badge>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Verified",
      "2FA",
      "Vehicles",
      "Created At",
    ];
    const csvData = filteredUsers.map((user: User) => [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.is_verified ? "Yes" : "No",
      user.is_2fa_enabled ? "Yes" : "No",
      user.vehicles?.length || 0,
      new Date(user.created_at).toLocaleDateString("vi-VN"),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field: any) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `all_users_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setVerificationFilter("all");
    setTwoFAFilter("all");
    setCurrentPage(1);
  };

  // Handle role update
  const handleRoleUpdate = async (
    userId: string,
    newRole: "user" | "staff" | "admin"
  ) => {
    // Find user to get their name for better toast message
    const user = allUsers.find((u) => u.id === userId);
    const userName = user?.name || "Người dùng";

    const roleNames = {
      user: "Khách hàng",
      staff: "Nhân viên",
      admin: "Quản trị viên",
    };

    try {
      await updateUserRoleMutation.mutateAsync({
        userId,
        role: newRole,
      });

      // Show success toast with specific details
      toast.success(`Đã cập nhật vai trò thành công!`, {
        description: `${userName} đã được chuyển thành ${roleNames[newRole]}`,
        duration: 3000,
      });
    } catch (error) {
      // Show error toast with user-friendly message
      toast.error("Không thể cập nhật vai trò", {
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi cập nhật vai trò người dùng",
        duration: 4000,
      });
      console.error("Role update error:", error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);

      toast.success("Đã xóa người dùng thành công!", {
        description: `${userName} đã được xóa khỏi hệ thống`,
        duration: 3000,
      });
    } catch (error) {
      toast.error("Không thể xóa người dùng", {
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xóa người dùng",
        duration: 4000,
      });
      console.error("Delete user error:", error);
    }
  };

  if (isLoadingAll) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p className="text-muted-foreground">
              Đang tải tất cả người dùng...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-96 flex-col gap-4">
          <p className="text-destructive">
            Có lỗi xảy ra khi tải dữ liệu người dùng
          </p>
          <Button onClick={() => fetchAllUsers()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tất cả người dùng
          </h1>
          <p className="text-muted-foreground">
            Xem tổng quan tất cả người dùng trong hệ thống - Khách hàng, Nhân
            viên và Quản trị viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchAllUsers()}
            variant="outline"
            disabled={isLoadingAll}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoadingAll ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Comprehensive Stats */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.customers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.staff}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản trị</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.admins}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.verified}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bật 2FA</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.twoFAEnabled}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có xe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {stats.withVehicles}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tất cả người dùng</CardTitle>
          <CardDescription>
            Hiển thị {filteredUsers.length} trong tổng số {stats.total} người
            dùng
            {(roleFilter !== "all" ||
              verificationFilter !== "all" ||
              twoFAFilter !== "all" ||
              searchTerm) && (
              <Button
                variant="link"
                onClick={clearFilters}
                className="p-0 h-auto ml-2"
              >
                Xóa bộ lọc
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Bộ lọc:</span>
              </div>

              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="user">Khách hàng</SelectItem>
                  <SelectItem value="staff">Nhân viên</SelectItem>
                  <SelectItem value="admin">Quản trị</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={verificationFilter}
                onValueChange={(value) => {
                  setVerificationFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Xác thực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="verified">Đã xác thực</SelectItem>
                  <SelectItem value="unverified">Chưa xác thực</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={twoFAFilter}
                onValueChange={(value) => {
                  setTwoFAFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="2FA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả 2FA</SelectItem>
                  <SelectItem value="enabled">Đã bật</SelectItem>
                  <SelectItem value="disabled">Chưa bật</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={pageLimit.toString()}
                onValueChange={(value) => {
                  setPageLimit(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Số lượng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / trang</SelectItem>
                  <SelectItem value="10">10 / trang</SelectItem>
                  <SelectItem value="20">20 / trang</SelectItem>
                  <SelectItem value="50">50 / trang</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                title="Xóa bộ lọc"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Cập nhật vai trò</TableHead>
                <TableHead>Xác thực</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Số xe</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground py-8"
                  >
                    Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {currentUser && currentUser.id === user.id ? (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Không thể thay đổi
                        </Badge>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(
                            newRole: "user" | "staff" | "admin"
                          ) => handleRoleUpdate(user.id, newRole)}
                          disabled={updateUserRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Khách hàng</SelectItem>
                            <SelectItem value="staff">Nhân viên</SelectItem>
                            <SelectItem value="admin">Quản trị</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>{getVerifiedBadge(user.is_verified)}</TableCell>
                    <TableCell>{get2FABadge(user.is_2fa_enabled)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.vehicles?.length || 0} xe
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Delete button with confirmation dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={
                                (currentUser && currentUser.id === user.id) ||
                                deleteUserMutation.isPending
                              }
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {deleteUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Xác nhận xóa người dùng
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa người dùng &ldquo;
                                {user.name}&rdquo; không? Hành động này sẽ soft
                                delete và có thể được khôi phục.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteUser(user.id, user.name)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Xóa người dùng
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination - Simple style like stations page */}
          {paginationMeta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Trang {currentPage} / {paginationMeta.totalPages} (
                {filteredUsers.length} người dùng)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= paginationMeta.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
