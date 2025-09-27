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
} from "lucide-react";

const tickets = [
  {
    id: "TK-001",
    title: "Pin không sạc được",
    description: "Pin PIN-045 không thể sạc, đèn báo đỏ liên tục",
    priority: "high",
    status: "open",
    createdBy: "Nguyễn Văn A",
    createdAt: "2024-01-20 09:30:00",
    category: "technical",
  },
  {
    id: "TK-002",
    title: "Khách hàng khiếu nại về chất lượng pin",
    description: "Khách hàng phản ánh pin mới thay chỉ dùng được 2 giờ",
    priority: "medium",
    status: "in-progress",
    createdBy: "Trần Thị B",
    createdAt: "2024-01-20 08:15:00",
    category: "customer",
  },
  {
    id: "TK-003",
    title: "Máy sạc trạm 3 bị lỗi",
    description: "Máy sạc số 3 không hoạt động, cần kiểm tra kỹ thuật",
    priority: "high",
    status: "resolved",
    createdBy: "Lê Văn C",
    createdAt: "2024-01-19 16:45:00",
    category: "equipment",
  },
  {
    id: "TK-004",
    title: "Yêu cầu bổ sung pin dự phòng",
    description: "Trạm thiếu pin dự phòng cho ca tối",
    priority: "low",
    status: "open",
    createdBy: "Phạm Thị D",
    createdAt: "2024-01-19 14:20:00",
    category: "inventory",
  },
];

export default function StaffSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">Cao</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Trung bình</Badge>;
      case "low":
        return <Badge className="bg-green-500">Thấp</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "all" || ticket.status === selectedTab;
    return matchesSearch && matchesTab;
  });

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
          <DialogContent className="sm:max-w-[425px]">
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
          <TabsTrigger value="all">Tất cả ({tickets.length})</TabsTrigger>
          <TabsTrigger value="open">
            Mở ({tickets.filter((t) => t.status === "open").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang xử lý (
            {tickets.filter((t) => t.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Đã giải quyết (
            {tickets.filter((t) => t.status === "resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                        {ticket.id}
                      </CardTitle>
                      {getPriorityBadge(ticket.priority)}
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
                        {ticket.createdBy}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {ticket.createdAt}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {ticket.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
