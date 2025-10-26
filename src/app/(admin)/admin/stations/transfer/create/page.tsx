"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Battery,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Station {
  id: string;
  name: string;
  location: string;
  availableBatteries: number;
  totalSlots: number;
}

interface Battery {
  id: string;
  batteryCode: string;
  level: number;
  status: "available" | "charging" | "maintenance";
  lastUpdated: string;
}

interface TransferFormData {
  fromStationId: string;
  toStationId: string;
  selectedBatteries: string[];
  reason: string;
  priority: "low" | "medium" | "high";
  scheduledTime: string;
  notes: string;
}

export default function CreateTransferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TransferFormData>({
    fromStationId: "",
    toStationId: "",
    selectedBatteries: [],
    reason: "",
    priority: "medium",
    scheduledTime: "",
    notes: "",
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [availableBatteries, setAvailableBatteries] = useState<Battery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBatteries, setLoadingBatteries] = useState(false);

  // Mock data for stations
  useEffect(() => {
    const mockStations: Station[] = [
      {
        id: "ST001",
        name: "Trạm Quận 1",
        location: "123 Nguyễn Huệ, Quận 1",
        availableBatteries: 45,
        totalSlots: 50,
      },
      {
        id: "ST002",
        name: "Trạm Cầu Giấy",
        location: "456 Cầu Giấy, Hà Nội",
        availableBatteries: 12,
        totalSlots: 48,
      },
      {
        id: "ST003",
        name: "Trạm Đà Nẵng",
        location: "789 Hải Châu, Đà Nẵng",
        availableBatteries: 55,
        totalSlots: 60,
      },
      {
        id: "ST004",
        name: "Trạm Bình Thạnh",
        location: "321 Xô Viết Nghệ Tĩnh",
        availableBatteries: 8,
        totalSlots: 45,
      },
    ];
    setStations(mockStations);
  }, []);

  // Load batteries when source station is selected
  useEffect(() => {
    if (formData.fromStationId) {
      setLoadingBatteries(true);

      // Simulate API call
      setTimeout(() => {
        const mockBatteries: Battery[] = Array.from({ length: 20 }, (_, i) => ({
          id: `BAT${String(i + 1).padStart(3, "0")}`,
          batteryCode: `BT-${formData.fromStationId}-${String(i + 1).padStart(
            3,
            "0"
          )}`,
          level: Math.floor(Math.random() * 100) + 1,
          status: i < 15 ? "available" : i < 18 ? "charging" : "maintenance",
          lastUpdated: new Date().toISOString(),
        }));

        setAvailableBatteries(
          mockBatteries.filter((b) => b.status === "available")
        );
        setLoadingBatteries(false);
      }, 500);
    } else {
      setAvailableBatteries([]);
    }
  }, [formData.fromStationId]);

  const handleInputChange = (field: keyof TransferFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBatterySelection = (batteryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedBatteries: checked
        ? [...prev.selectedBatteries, batteryId]
        : prev.selectedBatteries.filter((id) => id !== batteryId),
    }));
  };

  const selectAllBatteries = () => {
    setFormData((prev) => ({
      ...prev,
      selectedBatteries: availableBatteries.map((b) => b.id),
    }));
  };

  const clearSelection = () => {
    setFormData((prev) => ({
      ...prev,
      selectedBatteries: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.fromStationId || !formData.toStationId) {
        alert("Vui lòng chọn trạm nguồn và trạm đích");
        return;
      }

      if (formData.fromStationId === formData.toStationId) {
        alert("Trạm nguồn và trạm đích không thể giống nhau");
        return;
      }

      if (formData.selectedBatteries.length === 0) {
        alert("Vui lòng chọn ít nhất 1 pin để điều phối");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Creating transfer request:", formData);

      router.push("/admin/stations/transfer");
    } catch (error) {
      console.error("Error creating transfer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fromStation = stations.find((s) => s.id === formData.fromStationId);
  const toStation = stations.find((s) => s.id === formData.toStationId);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>;
      case "medium":
        return <Badge variant="secondary">Trung bình</Badge>;
      case "low":
        return <Badge variant="outline">Thấp</Badge>;
      default:
        return <Badge variant="outline">Trung bình</Badge>;
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/stations/transfer">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tạo yêu cầu điều phối pin
          </h1>
          <p className="text-muted-foreground">
            Tạo yêu cầu chuyển pin giữa các trạm để tối ưu hóa tồn kho
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Station Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Chọn trạm</CardTitle>
              <CardDescription>
                Chọn trạm nguồn và trạm đích cho việc điều phối pin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromStation">Trạm nguồn *</Label>
                <Select
                  value={formData.fromStationId}
                  onValueChange={(value) => {
                    handleInputChange("fromStationId", value);
                    handleInputChange("selectedBatteries", []); // Reset selection when changing station
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm nguồn" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name} ({station.availableBatteries} pin khả
                        dụng)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toStation">Trạm đích *</Label>
                <Select
                  value={formData.toStationId}
                  onValueChange={(value) =>
                    handleInputChange("toStationId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm đích" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations
                      .filter((s) => s.id !== formData.fromStationId)
                      .map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name} (
                          {station.totalSlots - station.availableBatteries} slot
                          trống)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {fromStation && toStation && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Từ:</span>
                      <span className="font-medium">{fromStation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đến:</span>
                      <span className="font-medium">{toStation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pin có thể chuyển:</span>
                      <span className="font-medium">
                        {fromStation.availableBatteries} pin
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slot trống tại đích:</span>
                      <span className="font-medium">
                        {toStation.totalSlots - toStation.availableBatteries}{" "}
                        slot
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết điều phối</CardTitle>
              <CardDescription>
                Thông tin chi tiết về yêu cầu điều phối
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Lý do điều phối *</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  placeholder="Ví dụ: Bổ sung pin cho trạm thiếu hụt"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Độ ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Thời gian dự kiến</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    handleInputChange("scheduledTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Ghi chú thêm về yêu cầu điều phối..."
                  rows={3}
                />
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">Thông tin yêu cầu:</div>
                    <div>
                      • Độ ưu tiên: {getPriorityBadge(formData.priority)}
                    </div>
                    <div>
                      • Số lượng pin đã chọn:{" "}
                      {formData.selectedBatteries.length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battery Selection */}
        {formData.fromStationId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Chọn pin cần điều phối
              </CardTitle>
              <CardDescription>
                Chọn các pin từ {fromStation?.name} để chuyển đến{" "}
                {toStation?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBatteries ? (
                <div className="py-8 text-center text-muted-foreground">
                  Đang tải danh sách pin...
                </div>
              ) : availableBatteries.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      Đã chọn {formData.selectedBatteries.length} /{" "}
                      {availableBatteries.length} pin
                    </div>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllBatteries}
                      >
                        Chọn tất cả
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearSelection}
                      >
                        Bỏ chọn
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Chọn</TableHead>
                        <TableHead>Mã pin</TableHead>
                        <TableHead>Mức pin</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Cập nhật lần cuối</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableBatteries.map((battery) => (
                        <TableRow key={battery.id}>
                          <TableCell>
                            <Checkbox
                              checked={formData.selectedBatteries.includes(
                                battery.id
                              )}
                              onCheckedChange={(checked) =>
                                handleBatterySelection(
                                  battery.id,
                                  checked as boolean
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {battery.batteryCode}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${battery.level}%` }}
                                />
                              </div>
                              <span className="text-sm">{battery.level}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              Sẵn sàng
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(battery.lastUpdated).toLocaleString(
                              "vi-VN"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {formData.fromStationId
                    ? "Không có pin khả dụng tại trạm này"
                    : "Vui lòng chọn trạm nguồn"}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/stations/transfer">Hủy</Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading || formData.selectedBatteries.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Đang tạo..." : "Tạo yêu cầu điều phối"}
          </Button>
        </div>
      </form>
    </main>
  );
}
