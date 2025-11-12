"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Battery,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Search,
} from "lucide-react";
import SearchAndFilter from "@/components/ui/search-and-filter";
import PaginationControls from "@/components/ui/pagination-controls";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useGetBatteryTypes,
  useDeleteBatteryType,
} from "@/hooks/admin/useBatteryTypes";
import { toast } from "sonner";
import { BatteryTypesQueryParams } from "@/types/admin/battery-types.type";
import useBatteryTypesStore from "@/stores/battery-types.store";

export default function BatteryTypesPage() {
  const {
    queryParams,
    searchTerm,
    setSearchTerm,
    setPage,
    setLimit,
    setSorting,
    resetFilters,
    setError,
    error: storeError,
  } = useBatteryTypesStore();

  const {
    data: batteryTypesData,
    isLoading,
    error,
    refetch,
  } = useGetBatteryTypes(queryParams);
  const deleteMutation = useDeleteBatteryType();

  // Extract battery types array from new response format
  const batteryTypesArray = batteryTypesData?.data?.data || [];
  const totalCount = batteryTypesData?.data?.total || 0;
  const currentPage = batteryTypesData?.data?.page || 1;
  const totalPages = batteryTypesData?.data?.totalPages || 1;

  // Client-side filtering
  const filteredTypes = searchTerm
    ? batteryTypesArray.filter(
        (bt) =>
          bt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bt.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : batteryTypesArray;

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Đã xóa loại pin "${name}" thành công`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa loại pin");
      console.error("Delete error:", error);
    }
  };

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-medium text-red-600">Có lỗi xảy ra</p>
              <p className="text-sm text-muted-foreground">
                Không thể tải danh sách loại pin
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý loại pin
          </h1>
          <p className="text-muted-foreground">
            Quản lý các loại pin sử dụng trong hệ thống
          </p>
        </div>
        <Link href="/admin/stations/battery-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm loại pin mới
          </Button>
        </Link>
      </div>

      {/* Battery Types Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng loại pin</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kết quả tìm kiếm
            </CardTitle>
            <Search className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredTypes.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {searchTerm ? `Phù hợp với "${searchTerm}"` : "Tất cả loại pin"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mới nhất</CardTitle>
            <Battery className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {batteryTypesArray.length > 0 && batteryTypesArray[0]?.created_at
                ? new Date(batteryTypesArray[0].created_at).toLocaleDateString(
                    "vi-VN"
                  )
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Loại pin được thêm gần nhất
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Battery Types List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách loại pin</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết về các loại pin trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            limit={queryParams.limit || 10}
            onLimitChange={setLimit}
            onRefresh={() => refetch()}
            isLoading={isLoading}
            searchPlaceholder="Tìm kiếm theo tên hoặc mô tả loại pin..."
          />

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên loại pin</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((batteryType) => (
                  <TableRow key={batteryType.id}>
                    <TableCell className="font-medium">
                      {batteryType.name}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{batteryType.description}</p>
                    </TableCell>
                    <TableCell>
                      {batteryType.created_at
                        ? new Date(batteryType.created_at).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/stations/battery-types/${batteryType.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/stations/battery-types/${batteryType.id}/edit`}
                        >
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa loại pin "
                                {batteryType.name}"? Hành động này không thể
                                hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(batteryType.id, batteryType.name)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteMutation.isPending
                                  ? "Đang xóa..."
                                  : "Xóa"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredTypes.length === 0 && !isLoading && (
            <div className="text-center p-8">
              <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Không có loại pin nào</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? "Không tìm thấy loại pin phù hợp với từ khóa tìm kiếm"
                  : "Hãy thêm loại pin đầu tiên vào hệ thống"}
              </p>
              <Link href="/admin/stations/battery-types/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm loại pin mới
                </Button>
              </Link>
            </div>
          )}

          <PaginationControls
            meta={batteryTypesData?.data}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />

          {/* Display info for filtered results */}
          {filteredTypes.length > 0 && !batteryTypesData?.data?.totalPages && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {filteredTypes.length} trong tổng số {totalCount} loại
                pin
                {searchTerm && ` (lọc theo "${searchTerm}")`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
