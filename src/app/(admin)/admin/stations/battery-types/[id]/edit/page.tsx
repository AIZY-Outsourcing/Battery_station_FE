"use client";

import { useParams, useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Battery, ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  useGetBatteryTypeDetails,
  useUpdateBatteryType,
} from "@/hooks/admin/useBatteryTypes";
import { UpdateBatteryTypeRequest } from "@/schemas/battery-types.schema";
import { toast } from "sonner";
import useBatteryTypesStore from "@/stores/battery-types.store";

export default function EditBatteryTypePage() {
  const params = useParams();
  const router = useRouter();
  const batteryTypeId = params.id as string;

  const {
    data: batteryTypeData,
    isLoading,
    error,
  } = useGetBatteryTypeDetails(batteryTypeId);
  const updateMutation = useUpdateBatteryType(batteryTypeId);

  const {
    formData,
    formErrors,
    isSubmitting,
    setFormData,
    setFormErrors,
    setSubmitting,
    clearForm,
  } = useBatteryTypesStore();

  // Load data when component mounts or data changes
  useEffect(() => {
    if (batteryTypeData?.data) {
      const data = batteryTypeData.data;
      setFormData({
        name: data.name,
        description: data.description,
      });
    }
  }, [batteryTypeData, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Partial<UpdateBatteryTypeRequest> = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Tên loại pin là bắt buộc";
    }
    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }
    if (formData.name && formData.name.length < 3) {
      newErrors.name = "Tên loại pin phải có ít nhất 3 ký tự";
    }
    if (formData.description && formData.description.length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await updateMutation.mutateAsync(formData as UpdateBatteryTypeRequest);
      toast.success("Cập nhật loại pin thành công!");
      router.push(`/admin/stations/battery-types/${batteryTypeId}`);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật loại pin");
      console.error("Update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof UpdateBatteryTypeRequest,
    value: string
  ) => {
    setFormData({ [field]: value });
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              Đang tải thông tin loại pin...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !batteryTypeData?.data) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-medium text-red-600">Có lỗi xảy ra</p>
              <p className="text-sm text-muted-foreground">
                Không thể tải thông tin loại pin
              </p>
              <Link href="/admin/stations/battery-types">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/stations/battery-types/${batteryTypeId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa loại pin
            </h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin loại pin {batteryTypeData.data.name}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Battery className="h-5 w-5" />
                <span>Thông tin cơ bản</span>
              </CardTitle>
              <CardDescription>
                Chỉnh sửa thông tin cơ bản về loại pin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên loại pin *</label>
                <Input
                  placeholder="Ví dụ: LiFePO4-72V-20kWh"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tên định danh cho loại pin này
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả *</label>
                <Textarea
                  placeholder="Mô tả chi tiết về loại pin này..."
                  className={`min-h-[100px] ${
                    formErrors.description ? "border-red-500" : ""
                  }`}
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500">
                    {formErrors.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mô tả chi tiết về đặc điểm và công dụng của loại pin
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || updateMutation.isPending}
              className="flex-1 md:flex-none"
            >
              {isSubmitting || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Cập nhật loại pin
                </>
              )}
            </Button>
            <Link href={`/admin/stations/battery-types/${batteryTypeId}`}>
              <Button variant="outline" type="button">
                Hủy
              </Button>
            </Link>
          </div>
        </form>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Xem trước</CardTitle>
            <CardDescription>
              Thông tin loại pin sau khi cập nhật
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tên loại pin
                </label>
                <p className="text-lg font-semibold">
                  {formData.name || "Chưa nhập"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Mô tả
                </label>
                <p className="text-sm leading-relaxed">
                  {formData.description || "Chưa nhập"}
                </p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">
                  Thông tin hệ thống
                </p>
                <p className="text-sm">
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(batteryTypeData.data.created_at).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p className="text-sm">
                  <strong>Lần cập nhật cuối:</strong>{" "}
                  {new Date().toLocaleDateString("vi-VN")} (sau khi lưu)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
