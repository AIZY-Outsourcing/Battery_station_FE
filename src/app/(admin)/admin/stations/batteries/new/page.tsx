"use client";

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
import { useGetStations } from "@/hooks/admin/useStations";
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
      capacity_kwh: 0,
      soh: 100,
      battery_type_id: "",
      station_id: "none",
      station_kiosk_slot: "",
    },
  });

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
