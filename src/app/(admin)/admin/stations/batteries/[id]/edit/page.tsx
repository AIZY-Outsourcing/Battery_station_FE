"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Battery, Save, Loader2 } from "lucide-react";
import {
  updateBatterySchema,
  type UpdateBatteryRequest,
} from "@/schemas/batteries.schema";
import { useGetBattery, useUpdateBattery } from "@/hooks/admin/useBatteries";
import {
  useGetStations,
  useGetStationEmptySlots,
} from "@/hooks/admin/useStations";
import { useGetBatteryTypes } from "@/hooks/admin/useBatteryTypes";
import { toast } from "sonner";

interface EditBatteryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBatteryPage({ params }: EditBatteryPageProps) {
  const router = useRouter();
  const { id: batteryId } = use(params);

  // Fetch battery data
  const { data: batteryResponse, isLoading: isBatteryLoading } =
    useGetBattery(batteryId);
  const battery = batteryResponse?.data;

  // Mutations
  const updateBatteryMutation = useUpdateBattery();

  // Fetch dropdown data
  const { data: stationsResponse } = useGetStations({ page: 1, limit: 1000 });
  const { data: batteryTypesResponse } = useGetBatteryTypes({
    page: 1,
    limit: 1000,
  });

  const stations = stationsResponse?.data?.data || [];
  const batteryTypes = batteryTypesResponse?.data?.data || [];

  const form = useForm<UpdateBatteryRequest>({
    resolver: zodResolver(updateBatterySchema),
    defaultValues: {
      name: "",
      serial_number: "",
      capacity_kwh: undefined,
      soh: undefined,
      battery_type_id: "",
      station_id: "none",
      station_kiosk_slot: undefined,
    },
  });

  // Watch for station_id changes to fetch empty slots
  const selectedStationId = form.watch("station_id");
  const shouldFetchSlots = selectedStationId && selectedStationId !== "none";

  // Fetch empty slots for selected station
  const { data: emptySlotsResponse, isLoading: isSlotsLoading } =
    useGetStationEmptySlots(shouldFetchSlots ? selectedStationId : "");

  const emptySlots = emptySlotsResponse?.data?.empty_slots || [];
  // Include current slot if it's occupied (for editing existing battery)
  const currentSlot =
    typeof battery?.station_kiosk_slot === "number"
      ? battery.station_kiosk_slot
      : typeof battery?.station_kiosk_slot === "string"
      ? parseInt(battery.station_kiosk_slot, 10) || undefined
      : undefined;
  const availableSlots =
    currentSlot && !emptySlots.includes(currentSlot)
      ? [...emptySlots, currentSlot].sort((a, b) => a - b)
      : emptySlots;

  // Reset form when battery data and dropdown data loads
  useEffect(() => {
    if (battery && stations.length > 0 && batteryTypes.length > 0) {
      const resetValues = {
        name: battery.name || "",
        serial_number: battery.serial_number || "",
        capacity_kwh:
          typeof battery.capacity_kwh === "string"
            ? parseFloat(battery.capacity_kwh) || undefined
            : battery.capacity_kwh || undefined,
        soh:
          typeof battery.soh === "string"
            ? parseFloat(battery.soh) || undefined
            : battery.soh || undefined,
        battery_type_id: battery.battery_type_id || "",
        station_id: battery.station_id || "none",
        station_kiosk_slot:
          typeof battery.station_kiosk_slot === "number"
            ? battery.station_kiosk_slot
            : typeof battery.station_kiosk_slot === "string"
            ? parseInt(battery.station_kiosk_slot, 10) || undefined
            : undefined,
      };

      form.reset(resetValues);
    }
  }, [battery, form, stations.length, batteryTypes.length]);

  // Clear slot when station changes (but preserve initial values)
  useEffect(() => {
    // Only clear slot if user actively changes station and form is dirty
    if (
      (selectedStationId === "none" || !shouldFetchSlots) &&
      form.formState.isDirty
    ) {
      const currentFormStationId = form.getValues("station_id");
      const originalStationId = battery?.station_id || "none";

      // Only clear if user changed from original station
      if (currentFormStationId !== originalStationId) {
        form.setValue("station_kiosk_slot", undefined);
      }
    }
  }, [selectedStationId, shouldFetchSlots, form, battery]);

  const onSubmit = async (data: UpdateBatteryRequest) => {
    try {
      // Transform 'none' to undefined for station_id
      const transformedData = {
        ...data,
        station_id: data.station_id === "none" ? undefined : data.station_id,
      };

      await updateBatteryMutation.mutateAsync({
        id: batteryId,
        data: transformedData,
      });
      toast.success("Pin đã được cập nhật thành công!");
      router.push(`/admin/stations/batteries/${batteryId}`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật pin");
      console.error("Error updating battery:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/stations/batteries/${batteryId}`);
  };

  if (isBatteryLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Không tìm thấy pin</h3>
            <p className="text-muted-foreground">
              Pin với ID {batteryId} không tồn tại.
            </p>
            <Button onClick={handleCancel} className="mt-4">
              Quay lại chi tiết pin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chỉnh sửa pin: {battery.name}
          </h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin pin trong hệ thống
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Battery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  Thông tin pin
                </CardTitle>
                <CardDescription>
                  Cập nhật thông tin cơ bản của pin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên pin *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: Pin LiFePO4 001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serial_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: BAT123456789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity_kwh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dung lượng (kWh) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.1"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="Nhập dung lượng pin (VD: 75, 100, 150)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SOH (%) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          placeholder="Nhập tình trạng pin (VD: 85, 90, 95, 100)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Assignment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin gán</CardTitle>
                <CardDescription>
                  Cập nhật thông tin gán pin vào trạm và slot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="battery_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại pin *</FormLabel>
                      <Select
                        key={`battery-type-${battery?.id}-${field.value}`}
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại pin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {batteryTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="station_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạm (tùy chọn)</FormLabel>
                      <Select
                        key={`station-${battery?.id}-${field.value}`}
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Không gán trạm</SelectItem>
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="station_kiosk_slot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slot trống (tùy chọn)</FormLabel>
                      <Select
                        key={`slot-${battery?.id}-${field.value}-${selectedStationId}`}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value, 10))
                        }
                        value={field.value?.toString() || ""}
                        disabled={!shouldFetchSlots || isSlotsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !shouldFetchSlots
                                  ? "Chọn trạm trước"
                                  : isSlotsLoading
                                  ? "Đang tải slots..."
                                  : availableSlots.length === 0
                                  ? "Không có slot trống"
                                  : "Chọn slot trống"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSlots.map((slotNumber: number) => (
                            <SelectItem
                              key={slotNumber}
                              value={slotNumber.toString()}
                            >
                              Slot {slotNumber}
                              {currentSlot === slotNumber && " (hiện tại)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {shouldFetchSlots && (
                        <div className="text-xs text-muted-foreground">
                          {isSlotsLoading ? (
                            <div className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Đang tải thông tin slots...
                            </div>
                          ) : availableSlots.length > 0 ? (
                            <p>
                              Có {emptySlots.length} slot trống:{" "}
                              {emptySlots.join(", ")}
                              {currentSlot &&
                                !emptySlots.includes(currentSlot) &&
                                ` + slot hiện tại (${currentSlot})`}
                            </p>
                          ) : (
                            <p className="text-amber-600">
                              ⚠️ Trạm này hiện tại không có slot trống
                            </p>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Battery Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hiện tại</CardTitle>
              <CardDescription>Tóm tắt thông tin pin</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Basic Information */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Thông tin cơ bản
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      ID Pin
                    </div>
                    <div className="font-mono text-sm font-medium break-all">
                      {battery.id}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Loại pin
                    </div>
                    <div className="font-medium text-sm">
                      {batteryTypes.find(
                        (type) => type.id === battery.battery_type_id
                      )?.name || "N/A"}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Trạng thái
                    </div>
                    <div className="font-medium text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          battery.status === "active"
                            ? "bg-green-100 text-green-800"
                            : battery.status === "in_use"
                            ? "bg-blue-100 text-blue-800"
                            : battery.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {battery.status === "active"
                          ? "Hoạt động"
                          : battery.status === "in_use"
                          ? "Đang sử dụng"
                          : battery.status === "maintenance"
                          ? "Bảo trì"
                          : battery.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Thông số kỹ thuật
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Dung lượng
                    </div>
                    <div className="font-bold text-lg text-primary">
                      {typeof battery.capacity_kwh === "string"
                        ? parseFloat(battery.capacity_kwh) || 0
                        : battery.capacity_kwh}{" "}
                      <span className="text-sm font-medium text-muted-foreground">
                        kWh
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      SOH (State of Health)
                    </div>
                    <div className="font-bold text-lg text-primary">
                      {typeof battery.soh === "string"
                        ? parseFloat(battery.soh) || 0
                        : battery.soh}
                      <span className="text-sm font-medium text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Assignment */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Thông tin vị trí
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Trạm hiện tại
                    </div>
                    <div className="font-medium text-sm">
                      {battery.station_id ? (
                        stations.find(
                          (station) => station.id === battery.station_id
                        )?.name || "N/A"
                      ) : (
                        <span className="text-muted-foreground italic">
                          Chưa gán trạm
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Slot hiện tại
                    </div>
                    <div className="font-medium text-sm">
                      {battery.station_kiosk_slot ? (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
                          Slot {battery.station_kiosk_slot}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Chưa gán slot
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Lịch sử
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Ngày tạo
                    </div>
                    <div className="font-medium text-sm">
                      {battery.created_at
                        ? new Date(battery.created_at).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Cập nhật lần cuối
                    </div>
                    <div className="font-medium text-sm">
                      {battery.updated_at
                        ? new Date(battery.updated_at).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={updateBatteryMutation.isPending}>
              {updateBatteryMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Cập nhật pin
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
