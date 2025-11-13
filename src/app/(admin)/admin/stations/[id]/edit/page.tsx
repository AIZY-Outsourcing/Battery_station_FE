"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { UpdateStationRequest, StationSchema } from "@/schemas/station.schema";
import {
  useGetStationDetails,
  useUpdateStation,
} from "@/hooks/admin/useStations";
import { useGetStaffs } from "@/hooks/admin/useStaffs";
import { toast } from "sonner";

export default function EditStationPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id as string;

  const {
    data: stationResponse,
    isLoading: isLoadingStation,
    error,
  } = useGetStationDetails(stationId);
  const station = stationResponse?.data;

  const updateStationMutation = useUpdateStation(stationId);
  const { data: staffsResponse, isLoading: isLoadingStaffs } = useGetStaffs();
  const staffs = staffsResponse?.data || [];

  const form = useForm<UpdateStationRequest>({
    resolver: zodResolver(StationSchema),
    defaultValues: {
      name: "",
      image_url: null,
      address: "",
      city: "",
      lat: "",
      lng: "",
      staff_id: null,
      status: "active",
    },
  });

  // Reset form when station loaded
  useEffect(() => {
    if (station) {
      form.reset({
        name: station.name || "",
        image_url: station.image_url || null,
        address: station.address || "",
        city: station.city || "",
        lat: station.lat || "",
        lng: station.lng || "",
        staff_id: station.staff_id || null,
        status: station.status || "active",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station]);

  const onSubmit = async (data: UpdateStationRequest) => {
    try {
      await updateStationMutation.mutateAsync(data);
      toast.success("Cập nhật trạm thành công");
      router.push(`/admin/stations/${stationId}`);
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  if (isLoadingStation) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải thông tin trạm...</span>
        </div>
      </main>
    );
  }

  if (error || !station) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-center text-muted-foreground">
          Không thể tải trạm
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/stations/${stationId}`}>
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa trạm
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin trạm đổi pin
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            // delete logic (no API implemented here)
            if (confirm("Bạn có chắc chắn muốn xóa trạm này?")) {
              toast("Xóa trạm - cần API");
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa trạm
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Thông tin chi tiết về trạm đổi pin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên trạm *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: Trạm Quận 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL hình ảnh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Hoạt động</SelectItem>
                            <SelectItem value="inactive">Tạm dừng</SelectItem>
                            <SelectItem value="maintenance">Bảo trì</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="staff_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhân viên phụ trách</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "none" ? null : value)
                          }
                          defaultValue={field.value || "none"}
                          disabled={isLoadingStaffs}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              Không gán nhân viên
                            </SelectItem>
                            {staffs.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name} - {s.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Địa chỉ và tọa độ</CardTitle>
                <CardDescription>
                  Thông tin địa chỉ và tọa độ của trạm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ *</FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, tên đường" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành phố *</FormLabel>
                      <FormControl>
                        <Input placeholder="TP. Hồ Chí Minh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vĩ độ (Latitude) *</FormLabel>
                        <FormControl>
                          <Input placeholder="10.8231" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kinh độ (Longitude) *</FormLabel>
                        <FormControl>
                          <Input placeholder="106.6297" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Tip: Bạn có thể lấy tọa độ từ Google Maps bằng cách click
                    chuột phải vào vị trí và chọn &ldquo;Copy coordinates&rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mô tả</CardTitle>
              <CardDescription>
                Thêm thông tin mô tả cho trạm (tùy chọn)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú / URL hình ảnh</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả hoặc URL hình ảnh"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href={`/admin/stations/${stationId}`}>Hủy</Link>
            </Button>
            <Button type="submit" disabled={updateStationMutation.isLoading}>
              {updateStationMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
