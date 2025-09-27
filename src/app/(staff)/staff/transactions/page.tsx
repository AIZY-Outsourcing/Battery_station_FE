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
} from "lucide-react";

const transactions = [
  {
    id: "TXN-001",
    customerId: "KH-001",
    customerName: "Nguyễn Văn A",
    type: "swap",
    batteryOut: "PIN-045",
    batteryIn: "PIN-023",
    timestamp: "2024-01-20 14:30:25",
    status: "completed",
    amount: 15000,
  },
  {
    id: "TXN-002",
    customerId: "KH-002",
    customerName: "Trần Thị B",
    type: "swap",
    batteryOut: "PIN-067",
    batteryIn: "PIN-089",
    timestamp: "2024-01-20 14:15:10",
    status: "completed",
    amount: 15000,
  },
  {
    id: "TXN-003",
    customerId: "KH-003",
    customerName: "Lê Văn C",
    type: "swap",
    batteryOut: "PIN-012",
    batteryIn: "PIN-034",
    timestamp: "2024-01-20 13:45:33",
    status: "processing",
    amount: 15000,
  },
  {
    id: "TXN-004",
    customerId: "KH-004",
    customerName: "Phạm Thị D",
    type: "swap",
    batteryOut: "PIN-078",
    batteryIn: "PIN-056",
    timestamp: "2024-01-20 13:20:15",
    status: "failed",
    amount: 15000,
  },
];

export default function StaffTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Đang xử lý</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      selectedTab === "all" || transaction.status === selectedTab;
    return matchesSearch && matchesTab;
  });

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
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm giao dịch..."
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
          <TabsTrigger value="all">Tất cả ({transactions.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn thành (
            {transactions.filter((t) => t.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Đang xử lý (
            {transactions.filter((t) => t.status === "processing").length})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Thất bại ({transactions.filter((t) => t.status === "failed").length}
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpDown className="w-5 h-5 mr-2" />
                Danh Sách Giao Dịch
              </CardTitle>
              <CardDescription>
                Tổng cộng {filteredTransactions.length} giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="font-semibold text-lg">
                          {transaction.id}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {transaction.amount.toLocaleString("vi-VN")} VNĐ
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {transaction.timestamp}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {transaction.customerName}
                          </div>
                          <div className="text-gray-500">
                            {transaction.customerId}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500">Pin cũ → Pin mới</div>
                        <div className="font-medium">
                          {transaction.batteryOut} → {transaction.batteryIn}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
