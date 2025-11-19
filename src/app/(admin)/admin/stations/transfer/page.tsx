"use client";

import { useState, useMemo } from "react";
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
  ArrowRight,
  Plus,
  Search,
  Truck,
  Clock,
  CheckCircle,
  Loader2,
  XCircle,
  Ban,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  useGetBatteryMovements,
  useAcceptBatteryMovement,
} from "@/hooks/admin/useBatteryMovements";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

export default function TransferPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useGetBatteryMovements({
    page,
    limit,
    sortBy: "created_at",
    sortOrder: "DESC",
  });

  const acceptMutation = useAcceptBatteryMovement();

  const movements = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  // Separate parent and sub-requests
  const parentRequests = useMemo(() => {
    return movements.filter((m: any) => !m.parent_request_id);
  }, [movements]);

  // Calculate stats (only parent requests)
  const stats = useMemo(() => {
    return {
      pending: parentRequests.filter((m: any) => m.status === "pending_confirmation").length,
      approved: parentRequests.filter((m: any) => m.status === "approved").length,
      completed: parentRequests.filter((m: any) => m.status === "completed").length,
      rejected: parentRequests.filter((m: any) => m.status === "rejected").length,
      cancelled: parentRequests.filter((m: any) => m.status === "cancelled").length,
    };
  }, [parentRequests]);

  // Filter movements based on search and status
  const filteredMovements = useMemo(() => {
    return parentRequests.filter((movement: any) => {
      const matchesSearch =
        !search ||
        movement.id.toLowerCase().includes(search.toLowerCase()) ||
        movement.from_station?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        movement.to_station?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || movement.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parentRequests, search, statusFilter]);

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAccept = async (movementId: string, movement: any) => {
    // Check if both staff confirmed
    if (!movement.source_confirmed || !movement.destination_confirmed) {
      toast.error("Cần có xác nhận từ cả 2 trạm trước khi thực thi!");
      return;
    }

    if (movement.status !== "approved") {
      toast.error("Chỉ có thể thực thi yêu cầu đã được phê duyệt!");
      return;
    }

    if (
      !confirm(
        "Bạn có chắc chắn muốn thực thi yêu cầu điều phối này? Pin sẽ được đổi giữa 2 trạm."
      )
    ) {
      return;
    }

    try {
      await acceptMutation.mutateAsync(movementId);
      toast.success("Thực thi yêu cầu điều phối thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi thực thi yêu cầu"
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xác nhận Staff
          </Badge>
        );
      case "pending_confirmation":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xác nhận
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Ban className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const getBatteryCount = (movement: any) => {
    return movement.items?.filter((item: any) => item.is_from_source)?.length || 0;
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Điều phối pin</h1>
            <p className="text-muted-foreground">
              Quản lý việc chuyển pin giữa các trạm để tối ưu hóa tồn kho
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/stations/transfer/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo yêu cầu điều phối
            </Link>
          </Button>
        </div>

        {/* Transfer Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng yêu cầu
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {total}
              </div>
              <p className="text-xs text-muted-foreground">Tất cả yêu cầu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <p className="text-xs text-muted-foreground">Cần xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground">Đã phê duyệt</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <p className="text-xs text-muted-foreground">Thành công</p>
            </CardContent>
          </Card>
        </div>

        {/* Transfer List */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử điều phối pin</CardTitle>
            <CardDescription>
              Theo dõi tất cả các yêu cầu điều phối pin giữa các trạm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã yêu cầu hoặc trạm..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending_confirmation">Chờ xác nhận</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Đang tải dữ liệu...
              </div>
            ) : error ? (
              <div className="py-8 text-center text-muted-foreground">
                Có lỗi xảy ra khi tải dữ liệu
              </div>
            ) : filteredMovements.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Không có yêu cầu điều phối nào
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Mã yêu cầu</TableHead>
                        <TableHead>Trạm nguồn</TableHead>
                        <TableHead></TableHead>
                        <TableHead>Trạm đích</TableHead>
                        <TableHead>Số lượng pin</TableHead>
                        <TableHead>Xác nhận</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thời gian tạo</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMovements.map((movement: any) => {
                        const isExpanded = expandedRows.has(movement.id);
                        const hasSubRequests = movement.sub_requests && movement.sub_requests.length > 0;

                        return (
                          <>
                            {/* Parent Request Row */}
                            <TableRow key={movement.id} className="bg-gray-50">
                              <TableCell>
                                {hasSubRequests && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleRow(movement.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                                    {movement.id.substring(0, 8)}...
                                  </span>
                                  {hasSubRequests && (
                                    <Badge variant="outline" className="text-xs">
                                      {movement.sub_requests.length} sub-requests
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {movement.from_station?.name || "N/A"}
                              </TableCell>
                              <TableCell>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </TableCell>
                              <TableCell className="font-medium">
                                {movement.to_station?.name || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getBatteryCount(movement)} pin
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {movement.source_confirmed ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-gray-300" />
                                    )}
                                    <span className="text-xs text-muted-foreground">Nguồn</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {movement.destination_confirmed ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-gray-300" />
                                    )}
                                    <span className="text-xs text-muted-foreground">Đích</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(movement.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(movement.created_at)}
                              </TableCell>
                              <TableCell>
                                {movement.status === "approved" && 
                                 movement.source_confirmed && 
                                 movement.destination_confirmed && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAccept(movement.id, movement)}
                                    disabled={acceptMutation.isPending}
                                  >
                                    {acceptMutation.isPending ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Thực thi
                                      </>
                                    )}
                                  </Button>
                                )}
                                {movement.status === "pending_confirmation" && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <span>Chờ staff xác nhận</span>
                                  </div>
                                )}
                                {movement.status === "completed" && (
                                  <span className="text-sm text-muted-foreground">
                                    Đã hoàn thành
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>

                            {/* Sub-Requests Rows (Collapsible) */}
                            {hasSubRequests && isExpanded && movement.sub_requests.map((subRequest: any) => (
                              <TableRow 
                                key={subRequest.id}
                                className="bg-blue-50/30 border-l-4 border-l-blue-200"
                              >
                                <TableCell></TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2 pl-4">
                                    <span className="text-xs text-muted-foreground">↳</span>
                                    <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                                      {subRequest.id.substring(0, 8)}...
                                    </span>
                                    <Badge variant="outline" className="text-xs bg-white">
                                      Sub-request
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {subRequest.from_station?.name || "N/A"}
                                </TableCell>
                                <TableCell>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {subRequest.to_station?.name || "N/A"}
                                </TableCell>
                                <TableCell>
                                  <span className="text-xs text-muted-foreground">
                                    {getBatteryCount(subRequest)} pin
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-xs text-muted-foreground">-</span>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(subRequest.status)}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {formatDate(subRequest.created_at)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    Không thể thực thi
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Trang {page} / {totalPages} ({total} yêu cầu)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
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
      </main>
    </div>
  );
}
