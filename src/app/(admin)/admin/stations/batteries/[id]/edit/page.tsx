"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { useGetStations } from "@/hooks/admin/useStations";
import { useGetBatteryTypes } from "@/hooks/admin/useBatteryTypes";
import { toast } from "sonner";

interface EditBatteryPageProps {
  params: {
    id: string;
  };
}

export default function EditBatteryPage({ params }: EditBatteryPageProps) {
  const router = useRouter();
  const batteryId = params.id;

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
      capacity_kwh: 0,
      soh: 100,
      battery_type_id: "",
      station_id: "none",
      station_kiosk_slot: "",
    },
  });

  // Reset form when battery data loads
  useEffect(() => {
    if (battery) {
      form.reset({
        name: battery.name || "",
        serial_number: battery.serial_number || "",
        capacity_kwh:
          typeof battery.capacity_kwh === "string"
            ? parseFloat(battery.capacity_kwh) || 0
            : battery.capacity_kwh || 0,
        soh:
          typeof battery.soh === "string"
            ? parseFloat(battery.soh) || 100
            : battery.soh || 100,
        battery_type_id: battery.battery_type_id || "",
        station_id: battery.station_id || "none",
        station_kiosk_slot: battery.station_kiosk_slot || "",
      });
    }
  }, [battery, form]);

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
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          placeholder="VD: 75"
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
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          placeholder="VD: 85"
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
                        onValueChange={field.onChange}
                        value={field.value}
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
                        onValueChange={field.onChange}
                        value={field.value}
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
                      <FormLabel>Slot (tùy chọn)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: A1, B2, C3..." />
                      </FormControl>
                      <FormMessage />
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
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{battery.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <span className="font-medium">
                      {battery.status || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tạo:</span>
                    <span className="font-medium">
                      {battery.created_at
                        ? new Date(battery.created_at).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span className="font-medium">
                      {battery.updated_at
                        ? new Date(battery.updated_at).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SOH hiện tại:</span>
                    <span className="font-medium">
                      {typeof battery.soh === "string"
                        ? parseFloat(battery.soh) || 0
                        : battery.soh}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dung lượng:</span>
                    <span className="font-medium">
                      {typeof battery.capacity_kwh === "string"
                        ? parseFloat(battery.capacity_kwh) || 0
                        : battery.capacity_kwh}{" "}
                      kWh
                    </span>
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
