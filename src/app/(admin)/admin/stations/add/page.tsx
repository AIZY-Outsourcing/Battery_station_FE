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
import { Label } from "@/components/ui/label";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { CreateStationRequest, StationSchema } from "@/schemas/station.schema";
import { useCreateStation } from "@/hooks/admin/useStations";
import { useGetStaffs } from "@/hooks/admin/useStaffs";
import { toast } from "sonner";

export default function AddStationPage() {
  const router = useRouter();

  // React Query hooks
  const createStationMutation = useCreateStation();
  const { data: staffsResponse, isLoading: isLoadingStaffs } = useGetStaffs();

  const staffs = staffsResponse?.data || [];

  // React Hook Form setup
  const form = useForm<CreateStationRequest>({
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

  const onSubmit = async (data: CreateStationRequest) => {
    try {
      await createStationMutation.mutateAsync(data);
      toast.success("Tạo trạm thành công!");
      router.push("/admin/stations");
    } catch (error: any) {
      console.error("Error creating station:", error);
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo trạm"
      );
    }
  };

  const isLoading = createStationMutation.isPending;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/stations">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm trạm đổi pin mới
          </h1>
          <p className="text-muted-foreground">
            Tạo một trạm đổi pin mới trong hệ thống
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Thông tin cơ bản */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Thông tin chi tiết về trạm đổi pin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <FormDescription>
                        URL hình ảnh của trạm (tùy chọn)
                      </FormDescription>
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
                          {staffs.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name} - {staff.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Nhân viên sẽ chịu trách nhiệm quản lý trạm này
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Địa chỉ và vị trí */}
            <Card>
              <CardHeader>
                <CardTitle>Địa chỉ và vị trí</CardTitle>
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
                    chuột phải vào vị trí và chọn "Copy coordinates"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/stations">Hủy</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Tạo trạm
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
