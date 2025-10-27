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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSupportTickets } from "@/hooks/staff/useSupportTickets";
import type { SupportTicket } from "@/types/staff/support.type";

export default function StaffSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch ALL tickets without pagination
  const { data, isLoading, error } = useSupportTickets({});

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

  // Client-side filter
  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "all" || ticket.status === selectedTab;
    return matchesSearch && matchesTab;
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

  // Empty state
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Ticket Mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo Ticket Hỗ Trợ Mới</DialogTitle>
              <DialogDescription>
                Tạo yêu cầu hỗ trợ mới cho các vấn đề tại trạm
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" placeholder="Nhập tiêu đề vấn đề..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Kỹ thuật</SelectItem>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="equipment">Thiết bị</SelectItem>
                    <SelectItem value="inventory">Kho hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Độ ưu tiên</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết vấn đề..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Tạo Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <TabsTrigger value="all">Tất cả ({allTickets.length})</TabsTrigger>
          <TabsTrigger value="open">
            Mở ({allTickets.filter((t) => t.status === "open").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang xử lý (
            {allTickets.filter((t) => t.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Đã giải quyết (
            {allTickets.filter((t) => t.status === "resolved").length})
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
                const createdDate = new Date(ticket.created_at).toLocaleString('vi-VN');
                return (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-lg flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                            {ticket.id.slice(0, 8)}...
                          </CardTitle>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <Button variant="outline" size="sm">
                          Chi tiết
                        </Button>
                      </div>
                      <CardDescription className="text-base font-medium text-gray-900">
                        {ticket.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{ticket.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {ticket.staff.name}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {createdDate}
                          </div>
                        </div>
                        {ticket.subject && (
                          <Badge variant="outline" className="capitalize">
                            {ticket.subject.name}
                          </Badge>
                        )}
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
    </div>
  );
}
