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
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useGetPaymentTransactions } from "@/hooks/admin/usePaymentTransactions";
import usePaymentTransactionsStore from "@/stores/payment-transactions.store";
import PaginationControls from "@/components/ui/pagination-controls";
import Link from "next/link";

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

export default function PaymentTransactionsPage() {
  const {
    queryParams,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    setPage,
    setLimit,
    resetFilters,
  } = usePaymentTransactionsStore();

  const { data, isLoading, error, refetch } =
    useGetPaymentTransactions(queryParams);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  const transactions = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  // Calculate stats
  const successTransactions = transactions.filter(
    (t) => t.status === "success"
  );
  const totalRevenue = successTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );
  const averageTransaction =
    successTransactions.length > 0
      ? totalRevenue / successTransactions.length
      : 0;

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi</CardTitle>
            <CardDescription>
              Không thể tải danh sách giao dịch thanh toán
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
            Quản lý giao dịch thanh toán
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các giao dịch thanh toán của người dùng
          </p>
        </div>
        <Button variant="outline" onClick={resetFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Đặt lại bộ lọc
        </Button>
      </div>

      {/* Transaction Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giao dịch
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : total}
            </div>
            <p className="text-xs text-muted-foreground">Tổng số giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${totalRevenue.toLocaleString("vi-VN")}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">VNĐ (Hoàn thành)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TB/Giao dịch</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${averageTransaction.toLocaleString("vi-VN", {
                  maximumFractionDigits: 0,
                })}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">VNĐ trung bình</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành công</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                successTransactions.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {total > 0
                ? `${((successTransactions.length / total) * 100).toFixed(1)}%`
                : "0%"}{" "}
              tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>
            Quản lý và theo dõi các giao dịch thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Header with Search and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                <Input
                  placeholder="Tìm kiếm theo mã GD, email, tên..."
                  className="pl-10 h-10 bg-background border-border focus:border-primary transition-colors"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Đặt lại
              </Button>
            </div>
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>
                Hiển thị{" "}
                <span className="font-medium text-foreground">
                  {transactions.length}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium text-foreground">{total}</span>{" "}
                giao dịch
              </span>
            </div>

            {/* Pagination at top */}
            {!isLoading && totalPages > 1 && (
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
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy giao dịch nào
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã GD</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Gói mua</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const StatusIcon = statusIcons[transaction.status];
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium font-mono text-xs">
                            {transaction.code}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {transaction.user?.name || "N/A"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {transaction.user?.email || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.order?.package?.name || "Đơn lẻ"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {parseFloat(transaction.amount).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VNĐ
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${statusColors[transaction.status]}`}
                            >
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {statusLabels[transaction.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/admin/users/payments/${transaction.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {!isLoading && transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>
              5 giao dịch mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => {
                const StatusIcon = statusIcons[transaction.status];
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          statusColors[transaction.status]
                        }`}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.user?.name || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.order?.package?.name || "Đơn lẻ"} •{" "}
                          {transaction.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {parseFloat(transaction.amount).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </p>
                      <Badge
                        variant="outline"
                        className={`${statusColors[transaction.status]}`}
                      >
                        {statusLabels[transaction.status]}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
