"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Search,
  Filter,
  Eye,
  RefreshCw,
  User,
  Clock,
  Loader2,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import {
  useStaffTransactions,
  useStaffStats,
} from "@/hooks/staff/useTransactions";
import { TransactionStatus } from "@/types/staff/transaction.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function StaffTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useStaffTransactions({
    page,
    limit,
    status: selectedTab === "all" ? undefined : selectedTab,
    search: searchTerm || undefined,
  });

  const { data: stats, isLoading: isLoadingStats } = useStaffStats();

  const getStatusBadge = (status: TransactionStatus) => {
    const statusConfig: Record<
      TransactionStatus,
      { label: string; className: string }
    > = {
      [TransactionStatus.COMPLETED]: {
        label: "Hoàn thành",
        className: "bg-green-500",
      },
      [TransactionStatus.REQUESTED]: {
        label: "Yêu cầu",
        className: "bg-blue-500",
      },
      [TransactionStatus.CONFIRMED]: {
        label: "Đã xác nhận",
        className: "bg-yellow-500",
      },
      [TransactionStatus.OPEN_EMPTY_SLOT]: {
        label: "Đang mở ngăn",
        className: "bg-yellow-500",
      },
      [TransactionStatus.OLD_BATTERY_IN]: {
        label: "Pin cũ đã vào",
        className: "bg-yellow-500",
      },
      [TransactionStatus.CLOSE_EMPTY_SLOT]: {
        label: "Đóng ngăn trống",
        className: "bg-yellow-500",
      },
      [TransactionStatus.OPEN_REQUIRE_SLOT]: {
        label: "Mở ngăn pin mới",
        className: "bg-yellow-500",
      },
      [TransactionStatus.NEW_BATTERY_OUT]: {
        label: "Pin mới đã ra",
        className: "bg-yellow-500",
      },
      [TransactionStatus.CLOSE_REQUIRE_SLOT]: {
        label: "Đóng ngăn pin",
        className: "bg-yellow-500",
      },
      [TransactionStatus.FAILED]: { label: "Thất bại", className: "bg-red-500" },
      [TransactionStatus.CANCELLED]: {
        label: "Đã hủy",
        className: "bg-gray-500",
      },
      [TransactionStatus.EXPIRED]: {
        label: "Hết hạn",
        className: "bg-orange-500",
      },
    };

    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleRefresh = () => {
    refetchTransactions();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setPage(1);
  };

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const transactions = transactionsData?.data || [];
  const meta = {
    total: transactionsData?.total || 0,
    page: transactionsData?.page || 1,
    limit: transactionsData?.limit || 10,
    totalPages: transactionsData?.totalPages || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản Lý Giao Dịch
          </h1>
          <p className="text-gray-600">
            Theo dõi các giao dịch thay pin tại trạm
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoadingTransactions}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${
              isLoadingTransactions ? "animate-spin" : ""
            }`}
          />
          Làm mới
        </Button>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tất cả</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Hoàn thành
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đang xử lý
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.inProgress}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thất bại</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.cancelled}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên user hoặc ID giao dịch..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({meta.total})</TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn thành ({stats?.completed || 0})
          </TabsTrigger>
          <TabsTrigger value="requested">
            Yêu cầu ({stats?.pending || 0})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Thất bại ({stats?.failed || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpDown className="w-5 h-5 mr-2" />
                Danh Sách Giao Dịch
              </CardTitle>
              <CardDescription>Tổng cộng {meta.total} giao dịch</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Không có giao dịch
                  </h3>
                  <p className="text-muted-foreground">
                    Chưa có giao dịch nào được ghi nhận.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="font-semibold text-lg">
                              #{transaction.id.slice(0, 8)}
                            </div>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 flex items-center justify-end">
                              <Clock className="w-3 h-3 mr-1" />
                              {format(
                                new Date(transaction.created_at),
                                "dd/MM/yyyy HH:mm",
                                { locale: vi }
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {transaction.swap_order?.user?.name || "N/A"}
                              </div>
                              <div className="text-gray-500">
                                {transaction.swap_order?.user?.email || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-500">
                              Pin cũ → Pin mới
                            </div>
                            <div className="font-medium">
                              {transaction.swap_order?.old_battery
                                ?.serial_number ||
                                transaction.swap_order?.old_battery_id?.slice(
                                  0,
                                  8
                                ) ||
                                "N/A"}{" "}
                              →{" "}
                              {transaction.swap_order?.new_battery
                                ?.serial_number ||
                                transaction.swap_order?.new_battery_id?.slice(
                                  0,
                                  8
                                ) ||
                                "N/A"}
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              Chi tiết
                            </Button>
                          </div>
                        </div>

                        {transaction.message && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-600">
                            <strong>Ghi chú:</strong> {transaction.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {meta.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Trang {meta.page} / {meta.totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1 || isLoadingTransactions}
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page + 1)}
                          disabled={
                            page === meta.totalPages || isLoadingTransactions
                          }
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
