"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  createBatterySchema,
  type CreateBatteryRequest,
} from "@/schemas/batteries.schema";
import { useCreateBattery } from "@/hooks/admin/useBatteries";
import {
  useGetStations,
  useGetStationEmptySlots,
} from "@/hooks/admin/useStations";
import { useGetBatteryTypes } from "@/hooks/admin/useBatteryTypes";
import { toast } from "sonner";

export default function NewBatteryPage() {
  const router = useRouter();
  const createBatteryMutation = useCreateBattery();

  // Fetch dropdown data
  const { data: stationsResponse } = useGetStations({ page: 1, limit: 1000 });
  const { data: batteryTypesResponse } = useGetBatteryTypes({
    page: 1,
    limit: 1000,
  });

  const stations = stationsResponse?.data?.data || [];
  const batteryTypes = batteryTypesResponse?.data?.data || [];

  const form = useForm<CreateBatteryRequest>({
    resolver: zodResolver(createBatterySchema),
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

  // Clear slot when station changes
  React.useEffect(() => {
    if (selectedStationId === "none" || !shouldFetchSlots) {
      form.setValue("station_kiosk_slot", undefined);
    }
  }, [selectedStationId, shouldFetchSlots, form]);

  const onSubmit = async (data: CreateBatteryRequest) => {
    try {
      // Transform 'none' to undefined for station_id
      const transformedData = {
        ...data,
        station_id: data.station_id === "none" ? undefined : data.station_id,
      };

      await createBatteryMutation.mutateAsync(transformedData);
      toast.success("Pin đã được tạo thành công!");
      router.push("/admin/stations/batteries");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo pin");
      console.error("Error creating battery:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/stations/batteries");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm pin mới</h1>
          <p className="text-muted-foreground">Tạo pin mới trong hệ thống</p>
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
                <CardDescription>Nhập thông tin cơ bản của pin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên pin *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nhập tên pin (VD: Pin LiFePO4 001, Pin Samsung 02)"
                        />
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
                        <Input
                          {...field}
                          placeholder="Nhập số serial (VD: BAT123456789, ENERZY001)"
                        />
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
                  Gán pin vào trạm và slot (tùy chọn)
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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
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
                                  : emptySlots.length === 0
                                  ? "Không có slot trống"
                                  : "Chọn slot trống"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {emptySlots.map((slotNumber: number) => (
                            <SelectItem
                              key={slotNumber}
                              value={slotNumber.toString()}
                            >
                              Slot {slotNumber}
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
                          ) : emptySlots.length > 0 ? (
                            <p>
                              Có {emptySlots.length} slot trống:{" "}
                              {emptySlots.join(", ")}
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={createBatteryMutation.isPending}>
              {createBatteryMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Tạo pin
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
