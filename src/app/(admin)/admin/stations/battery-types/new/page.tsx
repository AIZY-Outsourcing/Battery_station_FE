"use client";

import { useRouter } from "next/navigation";
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
import { Battery, ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCreateBatteryType } from "@/hooks/admin/useBatteryTypes";
import { CreateBatteryTypeRequest } from "@/schemas/battery-types.schema";
import { toast } from "sonner";
import useBatteryTypesStore from "@/stores/battery-types.store";

export default function NewBatteryTypePage() {
  const router = useRouter();
  const createMutation = useCreateBatteryType();

  const {
    formData,
    formErrors,
    isSubmitting,
    setFormData,
    setFormErrors,
    setSubmitting,
    clearForm,
  } = useBatteryTypesStore();

  // Clear form when component mounts
  useEffect(() => {
    clearForm();
  }, [clearForm]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Partial<CreateBatteryTypeRequest> = {};
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
      await createMutation.mutateAsync(formData as CreateBatteryTypeRequest);
      toast.success("Tạo loại pin mới thành công!");
      clearForm();
      router.push("/admin/stations/battery-types");
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo loại pin");
      console.error("Create error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateBatteryTypeRequest,
    value: string
  ) => {
    setFormData({ [field]: value });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/stations/battery-types">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Thêm loại pin mới
            </h1>
            <p className="text-muted-foreground">
              Tạo loại pin mới cho hệ thống
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
                Nhập thông tin cơ bản về loại pin
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
              disabled={isSubmitting || createMutation.isPending}
              className="flex-1 md:flex-none"
            >
              {isSubmitting || createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Tạo loại pin
                </>
              )}
            </Button>
            <Link href="/admin/stations/battery-types">
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
              Thông tin loại pin sẽ được hiển thị như sau
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
                  {new Date().toLocaleDateString("vi-VN")}
                </p>
                <p className="text-sm">
                  <strong>Trạng thái:</strong> Đang soạn thảo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
