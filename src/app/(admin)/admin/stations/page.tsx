"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Battery,
  MapPin,
  Search,
  Plus,
  Eye,
  Settings,
  Loader2,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useGetStations } from "@/hooks/admin/useStations";
import { useStationsStore } from "@/stores/stations.store";

export default function StationsPage() {
  const {
    queryParams,
    searchTerm,
    setQueryParams,
    setSearchTerm,
    setPage,
    setLimit,
    setSorting,
    resetFilters,
  } = useStationsStore();

  const {
    data: stationsResponse,
    isLoading,
    error,
  } = useGetStations(queryParams);

  // Convert to array from the new response structure
  const allStations = stationsResponse?.data?.data
    ? stationsResponse.data.data.filter((station) => station && station.id)
    : [];

  // Filter stations based on search term
  const stations = allStations.filter((station) => {
    if (!station) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (station.name?.toLowerCase() || "").includes(searchLower) ||
      (station.address?.toLowerCase() || "").includes(searchLower) ||
      (station.city?.toLowerCase() || "").includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải dữ liệu trạm...</span>
        </div>
      </main>
    );
  }

  if (error) {
    console.error("API Error:", error);
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">
              Có lỗi xảy ra khi tải dữ liệu trạm
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý trạm đổi pin
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả các trạm đổi pin trong hệ thống
            {stationsResponse?.data && (
              <span className="ml-2">({stationsResponse.data.total} trạm)</span>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/stations/add">
            <Plus className="mr-2 h-4 w-4" />
            Thêm trạm mới
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số trạm</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stationsResponse?.data?.total || allStations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trạm hoạt động
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {
                allStations.filter((station) => station.status === "active")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có nhân viên</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {
                allStations.filter((station) => station.staff_id !== null)
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chưa có nhân viên
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {
                allStations.filter((station) => station.staff_id === null)
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách trạm</CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái của tất cả các trạm đổi pin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên trạm, địa chỉ, hoặc thành phố..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={queryParams.limit?.toString()}
              onValueChange={(value) => setLimit(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Số lượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / trang</SelectItem>
                <SelectItem value="10">10 / trang</SelectItem>
                <SelectItem value="20">20 / trang</SelectItem>
                <SelectItem value="50">50 / trang</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              title="Reset filters"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã trạm</TableHead>
                <TableHead>Tên trạm</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thành phố</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mb-2" />
                      <p>
                        {searchTerm
                          ? "Không tìm thấy trạm nào phù hợp với tìm kiếm"
                          : "Chưa có trạm nào trong hệ thống"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stations.map((station, index) => (
                  <TableRow key={station.id || `station-${index}`}>
                    <TableCell className="font-medium">
                      {station.id ? `${station.id.slice(0, 8)}...` : "N/A"}
                    </TableCell>
                    <TableCell>{station.name || "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {station.address || "N/A"}
                    </TableCell>
                    <TableCell>{station.city || "N/A"}</TableCell>
                    <TableCell>
                      {station.staff ? (
                        <div>
                          <p className="font-medium">{station.staff.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {station.staff.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Chưa gán</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          station.status === "active" ? "default" : "secondary"
                        }
                      >
                        {station.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          disabled={!station.id}
                        >
                          <Link
                            href={
                              station.id ? `/admin/stations/${station.id}` : "#"
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          disabled={!station.id}
                        >
                          <Link
                            href={
                              station.id
                                ? `/admin/stations/${station.id}/edit`
                                : "#"
                            }
                          >
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {stationsResponse?.data && stationsResponse.data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Trang {stationsResponse.data.page} /{" "}
                {stationsResponse.data.totalPages}({stationsResponse.data.total}{" "}
                trạm)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={stationsResponse.data.page <= 1}
                  onClick={() => setPage(queryParams.page! - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    stationsResponse.data.page >=
                    stationsResponse.data.totalPages
                  }
                  onClick={() => setPage(queryParams.page! + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
