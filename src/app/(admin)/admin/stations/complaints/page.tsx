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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetSupportTickets,
  useUpdateSupportTicket,
} from "@/hooks/admin/useSupportTickets";
import { useGetUsers } from "@/hooks/admin/useUsers";
import { useState, useMemo } from "react";
import PaginationControls from "@/components/ui/pagination-controls";
import { SupportTicket } from "@/types/admin/support-ticket.type";
import { toast } from "sonner";

export default function ComplaintsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Fetch support tickets
  const {
    data: ticketsResponse,
    isLoading,
    error,
  } = useGetSupportTickets({
    page,
    limit,
  });

  // Get users (staff) for assignment
  const { data: usersData } = useGetUsers({
    sortBy: "created_at",
  });

  // Update support ticket mutation
  const updateTicketMutation = useUpdateSupportTicket(selectedTicket?.id || "");

  // Extract tickets array from response
  const tickets = useMemo(() => {
    if (!ticketsResponse?.data?.data) {
      return [];
    }
    return ticketsResponse.data.data;
  }, [ticketsResponse]) as SupportTicket[];

  // Filter staff members from users
  const staffMembers = useMemo(() => {
    if (!usersData?.data) return [];
    const usersArray = Object.values(usersData.data);
    return usersArray.filter((user) => user.role === "staff");
  }, [usersData]);

  // Extract pagination metadata
  const paginationMeta = ticketsResponse?.data
    ? {
        page: ticketsResponse.data.page || page,
        limit: ticketsResponse.data.limit || limit,
        total: ticketsResponse.data.total || 0,
        totalPages: ticketsResponse.data.totalPages || 1,
      }
    : undefined;

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
      };
    }

    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  }, [tickets]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status display
  const getStatusDisplay = (status: string) => {
    if (!status) {
      return { text: "Không xác định", variant: "outline" as const };
    }

    switch (status.toLowerCase()) {
      case "open":
        return { text: "Chưa xử lý", variant: "destructive" as const };
      case "in_progress":
        return { text: "Đang xử lý", variant: "secondary" as const };
      case "resolved":
        return { text: "Đã giải quyết", variant: "default" as const };
      case "closed":
        return { text: "Đã đóng", variant: "outline" as const };
      default:
        return { text: status, variant: "outline" as const };
    }
  };

  // Handle staff assignment
  const handleAssignStaff = async () => {
    if (!selectedTicket || !selectedStaffId) {
      toast.error("Vui lòng chọn nhân viên để phân công");
      return;
    }

    try {
      await updateTicketMutation.mutateAsync({
        staff_id: selectedStaffId,
        status: selectedStatus || selectedTicket.status,
      });
      toast.success("Phân công nhân viên thành công!");
      setSelectedStaffId("");
      setSelectedStatus("");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi phân công nhân viên");
      console.error("Assignment error:", error);
    }
  };

  // Handle dialog open
  const handleDialogOpen = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setSelectedStaffId(ticket.staff_id || "");
    setSelectedStatus(ticket.status || "");
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý khiếu nại
          </h1>
          <p className="text-muted-foreground">
            Xử lý và theo dõi các khiếu nại từ khách hàng về pin và trạm
          </p>
        </div>
      </div>

      {/* Complaint Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng khiếu nại
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.total
              )}
            </div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.open
              )}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.inProgress
              )}
            </div>
            <p className="text-xs text-muted-foreground">Đang giải quyết</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.resolved
              )}
            </div>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khiếu nại</CardTitle>
          <CardDescription>
            Theo dõi và xử lý tất cả các khiếu nại từ khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã ticket</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Trạm</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Đang tải dữ liệu...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-red-500"
                  >
                    Có lỗi xảy ra khi tải dữ liệu
                  </TableCell>
                </TableRow>
              ) : !Array.isArray(tickets) || tickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Chưa có khiếu nại nào
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => {
                  if (!ticket || !ticket.id) return null;

                  const statusDisplay = getStatusDisplay(ticket.status);

                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">
                        {ticket.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ticket.title || "N/A"}
                      </TableCell>
                      <TableCell>{ticket.station?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {ticket.subject?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.staff?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={statusDisplay.variant}>
                          {statusDisplay.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.created_at
                          ? formatDate(ticket.created_at)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDialogOpen(ticket)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Chi tiết khiếu nại #{ticket.id.slice(0, 8)}
                              </DialogTitle>
                              <DialogDescription>
                                Thông tin chi tiết và xử lý khiếu nại
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Tiêu đề
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {ticket.title || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Chủ đề
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {ticket.subject?.name || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Trạm
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {ticket.station?.name || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Nhân viên xử lý
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {ticket.staff?.name || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Trạng thái
                                  </label>
                                  <div className="mt-1">
                                    <Badge variant={statusDisplay.variant}>
                                      {statusDisplay.text}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Thời gian tạo
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {ticket.created_at
                                      ? formatDate(ticket.created_at)
                                      : "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Mô tả
                                </label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {ticket.description || "N/A"}
                                </p>
                              </div>
                              {ticket.support_images &&
                                ticket.support_images.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium">
                                      Hình ảnh đính kèm
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                      {ticket.support_images.map((image) => (
                                        <img
                                          key={image.id}
                                          src={image.image_url}
                                          alt="Support"
                                          className="w-full h-24 object-cover rounded"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              {/* Staff Assignment Section */}
                              <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-3">
                                  Phân công xử lý
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                      Chọn nhân viên
                                    </label>
                                    <Select
                                      value={selectedStaffId}
                                      onValueChange={setSelectedStaffId}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn nhân viên xử lý" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {staffMembers.map((staff) => (
                                          <SelectItem
                                            key={staff.id}
                                            value={staff.id}
                                          >
                                            {staff.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                      Trạng thái
                                    </label>
                                    <Select
                                      value={selectedStatus}
                                      onValueChange={setSelectedStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="open">
                                          Chưa xử lý
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                          Đang xử lý
                                        </SelectItem>
                                        <SelectItem value="resolved">
                                          Đã giải quyết
                                        </SelectItem>
                                        <SelectItem value="closed">
                                          Đã đóng
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <Button
                                  onClick={handleAssignStaff}
                                  disabled={
                                    updateTicketMutation.isPending ||
                                    !selectedStaffId
                                  }
                                  className="w-full"
                                >
                                  {updateTicketMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Phân công nhân viên
                                </Button>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Ghi chú xử lý
                                </label>
                                <Textarea
                                  placeholder="Nhập ghi chú về quá trình xử lý..."
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <PaginationControls
            meta={paginationMeta}
            onPageChange={setPage}
            onLimitChange={setLimit}
            disabled={isLoading}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </main>
  );
}
