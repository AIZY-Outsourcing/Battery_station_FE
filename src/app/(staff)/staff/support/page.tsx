"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  Calendar,
  Hash,
  Mail,
  Phone,
  RotateCcw,
} from "lucide-react";
import { useSupportTickets } from "@/hooks/staff/useSupportTickets";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import type { SupportTicket } from "@/types/staff/support.type";

export default function StaffSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  
  // Dialog state for detail view
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailTicket, setDetailTicket] = useState<SupportTicket | null>(null);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // Get selected station from localStorage
  useEffect(() => {
    const stationData = localStorage.getItem("selectedStation");
    if (stationData) {
      try {
        const station = JSON.parse(stationData);
        setSelectedStation(station);
      } catch (error) {
        console.error("Error parsing station data:", error);
      }
    }
  }, []);

  // Listen for station changes
  useEffect(() => {
    const handleStationChange = (event: CustomEvent) => {
      setSelectedStation(event.detail);
    };

    window.addEventListener("stationChanged", handleStationChange as EventListener);
    return () => window.removeEventListener("stationChanged", handleStationChange as EventListener);
  }, []);

  // Fetch ALL tickets without pagination
  const { data, isLoading, error, refetch } = useSupportTickets({});

  // Convert to array if needed
  const allTickets = data?.tickets 
    ? (Array.isArray(data.tickets) 
        ? data.tickets 
        : Object.values(data.tickets) as SupportTicket[])
    : [];

  // Reset page when changing tab or search
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchTerm]);

  // Handle open detail dialog
  const handleOpenDetailDialog = (ticket: SupportTicket) => {
    setDetailTicket(ticket);
    setIsDetailDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Handle refresh data
  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    await refetch();
  };

  // Client-side filter: filter by staff_id and station_id
  const filteredTickets = allTickets.filter((ticket) => {
    // Filter by staff_id (user.id when role is staff)
    const matchesStaff = user?.role === "staff" ? ticket.staff_id === user.id : true;
    
    // Filter by station_id (selected station)
    const matchesStation = selectedStation?.id ? ticket.station_id === selectedStation.id : true;
    
    // Filter by search term
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status tab
    const matchesTab = selectedTab === "all" || ticket.status === selectedTab;
    
    return matchesStaff && matchesStation && matchesSearch && matchesTab;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải danh sách ticket...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Có lỗi xảy ra khi tải danh sách ticket</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - check if no tickets at all from API
  if (allTickets.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Không có ticket nào</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Mở
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-700"
          >
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã giải quyết
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hỗ Trợ Kỹ Thuật</h1>
          <p className="text-gray-600">
            Quản lý các yêu cầu hỗ trợ và sự cố tại trạm
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả ({filteredTickets.length})</TabsTrigger>
          <TabsTrigger value="open">
            Mở ({filteredTickets.filter((t) => t.status === "open").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang xử lý (
            {filteredTickets.filter((t) => t.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Đã giải quyết (
            {filteredTickets.filter((t) => t.status === "resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="space-y-4">
            {paginatedTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Không có ticket nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              paginatedTickets.map((ticket) => {
                const createdDate = formatDate(ticket.created_at);
                return (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleOpenDetailDialog(ticket)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <CardTitle className="text-lg">{ticket.title}</CardTitle>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-2">
                            {ticket.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-600">
                          {ticket.station && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{ticket.station.name}</span>
                            </div>
                          )}
                          {ticket.subject && (
                            <Badge variant="outline" className="text-xs">
                              {ticket.subject.name}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{createdDate}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetailDialog(ticket);
                          }}
                        >
                          <Info className="w-3 h-3 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Client-side Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages} ({filteredTickets.length} ticket)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage >= totalPages}
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Chi tiết Ticket
            </DialogTitle>
            <DialogDescription>
              {detailTicket && (
                <span>
                  ID: <strong className="font-mono text-xs">{detailTicket.id}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {detailTicket && (
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                  Thông tin cơ bản
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500">Tiêu đề</Label>
                    <p className="text-sm font-medium mt-1">{detailTicket.title}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Mô tả</Label>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                      {detailTicket.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Trạng thái</Label>
                      <div className="mt-1">{getStatusBadge(detailTicket.status)}</div>
                    </div>
                    {detailTicket.subject && (
                      <div>
                        <Label className="text-xs text-gray-500">Danh mục</Label>
                        <div className="mt-1">
                          <Badge variant="outline">{detailTicket.subject.name}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Station Information */}
              {detailTicket.station && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                    Thông tin trạm
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Tên trạm
                      </Label>
                      <p className="text-sm font-medium mt-1">{detailTicket.station.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Thành phố</Label>
                      <p className="text-sm font-medium mt-1">{detailTicket.station.city || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-gray-500">Địa chỉ</Label>
                      <p className="text-sm font-medium mt-1">{detailTicket.station.address || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        ID Trạm
                      </Label>
                      <p className="text-sm font-mono text-xs mt-1 break-all">{detailTicket.station_id}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Staff Information */}
              {detailTicket.staff && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                    Thông tin nhân viên
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Tên
                      </Label>
                      <p className="text-sm font-medium mt-1">{detailTicket.staff.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </Label>
                      <p className="text-sm font-medium mt-1">{detailTicket.staff.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Số điện thoại
                      </Label>
                      <p className="text-sm font-medium mt-1">{detailTicket.staff.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        ID Nhân viên
                      </Label>
                      <p className="text-sm font-mono text-xs mt-1 break-all">{detailTicket.staff_id}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Images */}
              {detailTicket.support_images && detailTicket.support_images.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                    Hình ảnh đính kèm ({detailTicket.support_images.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {detailTicket.support_images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.image_url}
                          alt="Support image"
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                  Thông tin thời gian
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Ngày tạo
                    </Label>
                    <p className="text-sm mt-1">{formatDate(detailTicket.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Ngày cập nhật
                    </Label>
                    <p className="text-sm mt-1">{formatDate(detailTicket.updated_at)}</p>
                  </div>
                  {detailTicket.deleted_at && (
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ngày xóa
                      </Label>
                      <p className="text-sm mt-1 text-red-600">{formatDate(detailTicket.deleted_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* System IDs */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                  Thông tin hệ thống
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      ID Ticket
                    </Label>
                    <p className="text-sm font-mono text-xs mt-1 break-all">{detailTicket.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      ID Danh mục
                    </Label>
                    <p className="text-sm font-mono text-xs mt-1 break-all">{detailTicket.subject_id}</p>
                  </div>
                  {detailTicket.created_by && (
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Người tạo
                      </Label>
                      <p className="text-sm font-mono text-xs mt-1 break-all">{detailTicket.created_by}</p>
                    </div>
                  )}
                  {detailTicket.updated_by && (
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Người cập nhật
                      </Label>
                      <p className="text-sm font-mono text-xs mt-1 break-all">{detailTicket.updated_by}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDetailDialogOpen(false);
                setDetailTicket(null);
              }}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
