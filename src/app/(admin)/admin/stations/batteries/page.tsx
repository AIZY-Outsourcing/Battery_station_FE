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
import { Progress } from "@/components/ui/progress";
import {
  Battery,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Loader2,
  Edit,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetBatteries } from "@/hooks/admin/useBatteries";
import useBatteriesStore from "@/stores/batteries.store";
import { useMemo, useEffect } from "react";
import { Batteries } from "@/types/admin/batteries.type";
import { useGetStations } from "@/hooks/admin/useStations";
import { useGetBatteryTypes } from "@/hooks/admin/useBatteryTypes";
import PaginationControls from "@/components/ui/pagination-controls";
import SearchAndFilter from "@/components/ui/search-and-filter";
import { useQueryClient } from "@tanstack/react-query";

export default function BatteriesPage() {
  const queryClient = useQueryClient();

  const {
    queryParams,
    searchTerm,
    setSearchTerm,
    setQueryParams,
    setPage,
    setLimit,
    setSorting,
  } = useBatteriesStore();

  // Fetch batteries data
  const {
    data: batteriesResponse,
    isLoading,
    error,
  } = useGetBatteries(queryParams);

  // Fetch stations and battery types for lookup
  const { data: stationsResponse, isLoading: isLoadingStations } =
    useGetStations({ page: 1, limit: 1000 }); // Get all stations
  const { data: batteryTypesResponse, isLoading: isLoadingBatteryTypes } =
    useGetBatteryTypes({ page: 1, limit: 1000 }); // Get all battery types

  // Extract batteries array from response with correct nested structure
  const batteries = useMemo(() => {
    if (!batteriesResponse?.data?.data) {
      return [];
    }

    return batteriesResponse.data.data;
  }, [batteriesResponse]) as Batteries[];

  // Create lookup maps for stations and battery types
  const stationsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (stationsResponse?.data?.data) {
      stationsResponse.data.data.forEach((station) => {
        map.set(station.id, station.name);
      });
    }
    return map;
  }, [stationsResponse]);

  const batteryTypesMap = useMemo(() => {
    const map = new Map<string, string>();
    if (batteryTypesResponse?.data?.data) {
      batteryTypesResponse.data.data.forEach((type) => {
        map.set(type.id, type.name);
      });
    }
    return map;
  }, [batteryTypesResponse]);

  // Helper functions to get names
  const getStationName = (stationId: string | null) => {
    if (!stationId) return "Chưa gán";
    if (isLoadingStations) return "Đang tải...";
    return stationsMap.get(stationId) || stationId;
  };

  const getBatteryTypeName = (batteryTypeId: string) => {
    if (isLoadingBatteryTypes) return "Đang tải...";
    return batteryTypesMap.get(batteryTypeId) || batteryTypeId;
  };

  // Extract pagination metadata
  const paginationMeta = batteriesResponse?.data?.meta
    ? {
        page: batteriesResponse.data.meta.page || queryParams.page || 1,
        limit: batteriesResponse.data.meta.limit || queryParams.limit || 10,
        total: batteriesResponse.data.meta.total || 0,
        totalPages: batteriesResponse.data.meta.totalPages || 1,
      }
    : undefined;

  // Refresh function
  const handleRefresh = () => {
    // Invalidate and refetch all related queries
    queryClient.invalidateQueries({ queryKey: ["batteries"] });
    queryClient.invalidateQueries({ queryKey: ["stations"] });
    queryClient.invalidateQueries({ queryKey: ["battery-types"] });
  };

  // Update search in query params with debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams({ search: searchTerm || undefined, page: 1 });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, setQueryParams]);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (!Array.isArray(batteries) || batteries.length === 0) {
      return {
        averageSoh: 0,
        goodBatteries: 0,
        fairBatteries: 0,
        poorBatteries: 0,
        totalBatteries: 0,
      };
    }

    const totalSoh = batteries.reduce((sum, battery) => {
      const soh = parseFloat(battery.soh) || 0;
      return sum + soh;
    }, 0);

    const averageSoh = totalSoh / batteries.length;
    const goodBatteries = batteries.filter(
      (b) => parseFloat(b.soh) > 80
    ).length;
    const fairBatteries = batteries.filter((b) => {
      const soh = parseFloat(b.soh);
      return soh >= 50 && soh <= 80;
    }).length;
    const poorBatteries = batteries.filter(
      (b) => parseFloat(b.soh) < 50
    ).length;

    return {
      averageSoh: Math.round(averageSoh * 10) / 10,
      goodBatteries,
      fairBatteries,
      poorBatteries,
      totalBatteries: batteries.length,
    };
  }, [batteries]);

  // Format status for display
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return { text: "Khả dụng", variant: "default" as const };
      case "charging":
        return { text: "Đang sạc", variant: "secondary" as const };
      case "maintenance":
        return { text: "Bảo trì", variant: "destructive" as const };
      case "in_use":
        return { text: "Đang sử dụng", variant: "secondary" as const };
      case "reserved":
        return { text: "Đã đặt trước", variant: "outline" as const };
      default:
        return { text: status, variant: "outline" as const };
    }
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Theo dõi pin & SoH
          </h1>
          <p className="text-muted-foreground">
            Giám sát trạng thái sức khỏe và lịch sử sử dụng của từng pin
          </p>
        </div>
        <Link href="/admin/stations/batteries/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm pin mới
          </Button>
        </Link>
      </div>

      {/* Battery Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SoH trung bình
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${stats.averageSoh}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Dựa trên {stats.totalBatteries} pin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pin tốt (&gt;80%)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.goodBatteries
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBatteries > 0
                ? `${Math.round(
                    (stats.goodBatteries / stats.totalBatteries) * 100
                  )}% tổng số pin`
                : "Chưa có dữ liệu"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pin cần chú ý (50-80%)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.fairBatteries
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBatteries > 0
                ? `${Math.round(
                    (stats.fairBatteries / stats.totalBatteries) * 100
                  )}% tổng số pin`
                : "Chưa có dữ liệu"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pin cần thay (&lt;50%)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.poorBatteries
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBatteries > 0
                ? `${Math.round(
                    (stats.poorBatteries / stats.totalBatteries) * 100
                  )}% tổng số pin`
                : "Chưa có dữ liệu"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Battery List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách pin chi tiết</CardTitle>
          <CardDescription>
            Theo dõi từng pin với thông tin SoH, chu kỳ sử dụng và trạng thái
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm theo tên pin, serial hoặc ID..."
            limit={queryParams.limit || 10}
            onLimitChange={setLimit}
            onRefresh={handleRefresh}
            isLoading={isLoading || isLoadingStations || isLoadingBatteryTypes}
            className="mb-4"
          />

          {/* Additional Filters */}
          <div className="flex items-center space-x-2 mb-4">
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  setQueryParams({ status: undefined });
                } else {
                  setQueryParams({ status: value });
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="available">Khả dụng</SelectItem>
                <SelectItem value="charging">Đang sạc</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="in_use">Đang sử dụng</SelectItem>
                <SelectItem value="reserved">Đã đặt trước</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  // Reset sorting to default
                  setSorting("created_at", "desc");
                } else if (value === "good") {
                  setSorting("soh", "desc");
                } else if (value === "fair") {
                  setSorting("soh", "asc");
                } else if (value === "poor") {
                  setSorting("soh", "asc");
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo SoH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mặc định</SelectItem>
                <SelectItem value="good">SoH cao nhất</SelectItem>
                <SelectItem value="poor">SoH thấp nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên pin</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Dung lượng</TableHead>
                <TableHead>SoH</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Loại pin</TableHead>
                <TableHead>Trạm/Slot</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isLoadingStations || isLoadingBatteryTypes ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Đang tải dữ liệu...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-red-500"
                  >
                    Có lỗi xảy ra khi tải dữ liệu. Đang sử dụng dữ liệu mẫu.
                  </TableCell>
                </TableRow>
              ) : !Array.isArray(batteries) ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-red-500"
                  >
                    Lỗi: Dữ liệu không đúng định dạng. Type: {typeof batteries}
                    <br />
                    <code className="text-xs">{JSON.stringify(batteries)}</code>
                  </TableCell>
                </TableRow>
              ) : batteries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm
                      ? "Không tìm thấy pin nào phù hợp"
                      : "Chưa có pin nào"}
                  </TableCell>
                </TableRow>
              ) : (
                batteries.map((battery: Batteries) => {
                  const sohValue = parseFloat(battery.soh) || 0;
                  const statusDisplay = getStatusDisplay(battery.status);

                  return (
                    <TableRow key={battery.id}>
                      <TableCell className="font-medium">
                        {battery.name}
                      </TableCell>
                      <TableCell>{battery.serial_number}</TableCell>
                      <TableCell>{battery.capacity_kwh} kWh</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={sohValue} className="w-16 h-2" />
                          <span
                            className={`text-sm font-medium ${
                              sohValue > 80
                                ? "text-green-600"
                                : sohValue > 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {sohValue}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusDisplay.variant}>
                          {statusDisplay.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getBatteryTypeName(battery.battery_type_id)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {battery.station_id
                          ? `${getStationName(battery.station_id)}${
                              battery.station_kiosk_slot
                                ? ` / Slot ${battery.station_kiosk_slot}`
                                : ""
                            }`
                          : "Chưa gán"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/admin/stations/batteries/${battery.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/admin/stations/batteries/${battery.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <PaginationControls
            meta={paginationMeta}
            onPageChange={setPage}
            onLimitChange={setLimit}
            disabled={isLoading || isLoadingStations || isLoadingBatteryTypes}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </main>
  );
}
