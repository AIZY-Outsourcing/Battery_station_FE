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
  Battery,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Zap,
  CheckCircle,
} from "lucide-react";

const batteries = [
  {
    id: "PIN-001",
    model: "LiFePO4-48V",
    capacity: "20Ah",
    status: "available",
    charge: 100,
    cycles: 245,
    location: "Kệ A-01",
    lastMaintenance: "2024-01-15",
  },
  {
    id: "PIN-002",
    model: "LiFePO4-48V",
    capacity: "20Ah",
    status: "charging",
    charge: 75,
    cycles: 189,
    location: "Trạm sạc 1",
    lastMaintenance: "2024-01-10",
  },
  {
    id: "PIN-003",
    model: "LiFePO4-48V",
    capacity: "20Ah",
    status: "maintenance",
    charge: 45,
    cycles: 892,
    location: "Khu bảo trì",
    lastMaintenance: "2024-01-05",
  },
  {
    id: "PIN-004",
    model: "LiFePO4-48V",
    capacity: "20Ah",
    status: "available",
    charge: 95,
    cycles: 156,
    location: "Kệ A-02",
    lastMaintenance: "2024-01-12",
  },
];

export default function StaffInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sẵn sàng
          </Badge>
        );
      case "charging":
        return (
          <Badge className="bg-blue-500">
            <Zap className="w-3 h-3 mr-1" />
            Đang sạc
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-orange-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Bảo trì
          </Badge>
        );
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getChargeColor = (charge: number) => {
    if (charge >= 80) return "text-green-600";
    if (charge >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredBatteries = batteries.filter((battery) => {
    const matchesSearch =
      battery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "all" || battery.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Kho Pin</h1>
          <p className="text-gray-600">
            Theo dõi và quản lý tình trạng pin tại trạm
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Pin Mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm pin..."
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
          <TabsTrigger value="all">Tất cả ({batteries.length})</TabsTrigger>
          <TabsTrigger value="available">
            Sẵn sàng ({batteries.filter((b) => b.status === "available").length}
            )
          </TabsTrigger>
          <TabsTrigger value="charging">
            Đang sạc ({batteries.filter((b) => b.status === "charging").length})
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Bảo trì (
            {batteries.filter((b) => b.status === "maintenance").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatteries.map((battery) => (
              <Card
                key={battery.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Battery className="w-5 h-5 mr-2 text-blue-600" />
                      {battery.id}
                    </CardTitle>
                    {getStatusBadge(battery.status)}
                  </div>
                  <CardDescription>
                    {battery.model} - {battery.capacity}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Mức sạc</p>
                      <p
                        className={`font-semibold ${getChargeColor(
                          battery.charge
                        )}`}
                      >
                        {battery.charge}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Chu kỳ</p>
                      <p className="font-semibold">{battery.cycles}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vị trí</p>
                      <p className="font-semibold">{battery.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bảo trì cuối</p>
                      <p className="font-semibold">{battery.lastMaintenance}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      Cập nhật
                    </Button>
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
