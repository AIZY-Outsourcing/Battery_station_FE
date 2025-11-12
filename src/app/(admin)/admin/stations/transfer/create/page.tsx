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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useGetStations } from "@/hooks/admin/useStations";
import {
  useGetStationBatteriesForMovement,
  useCreateBatteryMovement,
} from "@/hooks/admin/useBatteryMovements";
import { Station } from "@/types/admin/station.type";
import { Batteries } from "@/types/admin/batteries.type";
import { toast } from "sonner";

interface TransferFormData {
  fromStationId: string;
  toStationId: string;
  selectedBatteries: string[];
  selectedToBatteries: string[];
  reason: string;
}

export default function CreateTransferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TransferFormData>({
    fromStationId: "",
    toStationId: "",
    selectedBatteries: [],
    selectedToBatteries: [],
    reason: "",
  });

  // Fetch stations
  const { data: stationsData, isLoading: loadingStations } = useGetStations({
    limit: 100,
  });

  const stations = stationsData?.data?.data || [];

  // Fetch batteries from source station
  const {
    data: batteriesData,
    isLoading: loadingBatteries,
    refetch: refetchBatteries,
  } = useGetStationBatteriesForMovement(
    formData.fromStationId,
    { limit: 100 }
  );

  const availableBatteries =
    batteriesData?.data?.data?.filter(
      (b) => b.status === "available"
    ) || [];

  // Fetch batteries from destination station
  const {
    data: toBatteriesData,
    isLoading: loadingToBatteries,
    refetch: refetchToBatteries,
  } = useGetStationBatteriesForMovement(
    formData.toStationId,
    { limit: 100 }
  );

  const availableToBatteries =
    toBatteriesData?.data?.data?.filter(
      (b) => b.status === "available"
    ) || [];

  // Create mutation
  const createMutation = useCreateBatteryMovement();

  useEffect(() => {
    if (formData.fromStationId) {
      refetchBatteries();
    }
  }, [formData.fromStationId, refetchBatteries]);

  useEffect(() => {
    if (formData.toStationId) {
      refetchToBatteries();
    }
  }, [formData.toStationId, refetchToBatteries]);

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

  const handleToBatterySelection = (batteryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedToBatteries: checked
        ? [...prev.selectedToBatteries, batteryId]
        : prev.selectedToBatteries.filter((id) => id !== batteryId),
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

  const selectAllToBatteries = () => {
    setFormData((prev) => ({
      ...prev,
      selectedToBatteries: availableToBatteries.map((b) => b.id),
    }));
  };

  const clearToSelection = () => {
    setFormData((prev) => ({
      ...prev,
      selectedToBatteries: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.fromStationId || !formData.toStationId) {
      toast.error("Vui lòng chọn trạm nguồn và trạm đích");
      return;
    }

    if (formData.fromStationId === formData.toStationId) {
      toast.error("Trạm nguồn và trạm đích không thể giống nhau");
      return;
    }

    if (formData.selectedBatteries.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 pin để điều phối");
      return;
    }

    // Validate swap: if to_batteries is selected, count must match from_batteries
    if (
      formData.selectedToBatteries.length > 0 &&
      formData.selectedBatteries.length !== formData.selectedToBatteries.length
    ) {
      toast.error(
        `Số lượng pin đổi chéo phải bằng nhau. Pin từ nguồn: ${formData.selectedBatteries.length}, Pin từ đích: ${formData.selectedToBatteries.length}`
      );
      return;
    }

    if (!formData.reason.trim()) {
      toast.error("Vui lòng nhập lý do điều phối");
      return;
    }

    try {
      await createMutation.mutateAsync({
        from_station_id: formData.fromStationId,
        to_station_id: formData.toStationId,
        reason: formData.reason,
        from_batteries: formData.selectedBatteries,
        to_batteries: formData.selectedToBatteries.length > 0 ? formData.selectedToBatteries : undefined,
      });

      toast.success("Tạo yêu cầu điều phối pin thành công");

      router.push("/admin/stations/transfer");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi tạo yêu cầu điều phối"
      );
    }
  };

  const fromStation = stations.find((s) => s.id === formData.fromStationId);
  const toStation = stations.find((s) => s.id === formData.toStationId);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      available: { label: "Sẵn sàng", variant: "default" },
      charging: { label: "Đang sạc", variant: "secondary" },
      maintenance: { label: "Bảo trì", variant: "outline" },
      in_use: { label: "Đang sử dụng", variant: "destructive" },
      damaged: { label: "Hỏng", variant: "destructive" },
      reserved: { label: "Đã đặt", variant: "outline" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      variant: "outline",
    };

    return (
      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
    );
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
                  disabled={loadingStations}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm nguồn" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name} - {station.address}
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
                  onValueChange={(value) => {
                    handleInputChange("toStationId", value);
                    handleInputChange("selectedToBatteries", []); // Reset selection when changing station
                  }}
                  disabled={loadingStations}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm đích" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations
                      .filter((s) => s.id !== formData.fromStationId)
                      .map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name} - {station.address}
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
                      <span>Pin có thể chuyển từ nguồn:</span>
                      <span className="font-medium">
                        {availableBatteries.length} pin
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pin có thể đổi từ đích:</span>
                      <span className="font-medium">
                        {availableToBatteries.length} pin
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

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <div className="font-medium">Thông tin yêu cầu:</div>
                    <div>
                      • Pin từ trạm nguồn: {formData.selectedBatteries.length} pin
                    </div>
                    <div>
                      • Pin từ trạm đích (đổi chéo): {formData.selectedToBatteries.length} pin
                      {formData.selectedToBatteries.length > 0 &&
                        formData.selectedBatteries.length !==
                          formData.selectedToBatteries.length && (
                          <span className="text-red-600 font-semibold ml-2">
                            (Cảnh báo: Số lượng không khớp!)
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battery Selection from Source Station */}
        {formData.fromStationId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Chọn pin từ trạm nguồn ({fromStation?.name})
              </CardTitle>
              <CardDescription>
                Chọn các pin từ {fromStation?.name} để chuyển đến{" "}
                {toStation?.name || "trạm đích"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBatteries ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
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

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Chọn</TableHead>
                          <TableHead>Mã pin</TableHead>
                          <TableHead>Tên pin</TableHead>
                          <TableHead>SOH</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Loại pin</TableHead>
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
                              {battery.serial_number}
                            </TableCell>
                            <TableCell>{battery.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${parseFloat(battery.soh)}%` }}
                                  />
                                </div>
                                <span className="text-sm">{battery.soh}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(battery.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {battery.battery_type_id || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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

        {/* Battery Selection from Destination Station */}
        {formData.toStationId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Chọn pin từ trạm đích để đổi chéo ({toStation?.name})
              </CardTitle>
              <CardDescription>
                (Tùy chọn) Chọn các pin từ {toStation?.name} để đổi chéo với pin từ{" "}
                {fromStation?.name || "trạm nguồn"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingToBatteries ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Đang tải danh sách pin...
                </div>
              ) : availableToBatteries.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      Đã chọn {formData.selectedToBatteries.length} /{" "}
                      {availableToBatteries.length} pin
                    </div>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllToBatteries}
                      >
                        Chọn tất cả
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearToSelection}
                      >
                        Bỏ chọn
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Chọn</TableHead>
                          <TableHead>Mã pin</TableHead>
                          <TableHead>Tên pin</TableHead>
                          <TableHead>SOH</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Loại pin</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableToBatteries.map((battery) => (
                          <TableRow key={battery.id}>
                            <TableCell>
                              <Checkbox
                                checked={formData.selectedToBatteries.includes(
                                  battery.id
                                )}
                                onCheckedChange={(checked) =>
                                  handleToBatterySelection(
                                    battery.id,
                                    checked as boolean
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {battery.serial_number}
                            </TableCell>
                            <TableCell>{battery.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${parseFloat(battery.soh)}%` }}
                                  />
                                </div>
                                <span className="text-sm">{battery.soh}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(battery.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {battery.battery_type_id || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {formData.toStationId
                    ? "Không có pin khả dụng tại trạm đích"
                    : "Vui lòng chọn trạm đích"}
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
            disabled={
              createMutation.isPending ||
              formData.selectedBatteries.length === 0 ||
              !formData.reason.trim() ||
              (formData.selectedToBatteries.length > 0 &&
                formData.selectedBatteries.length !==
                  formData.selectedToBatteries.length)
            }
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Tạo yêu cầu điều phối
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}
