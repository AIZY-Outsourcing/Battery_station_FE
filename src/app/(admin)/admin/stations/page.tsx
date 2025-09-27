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
import { Battery, MapPin, Search, Plus, Eye, Settings } from "lucide-react";
import Link from "next/link";

const stations = [
  {
    id: "ST001",
    name: "Trạm Quận 1",
    location: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    totalBatteries: 52,
    available: 45,
    charging: 5,
    maintenance: 2,
    status: "normal",
  },
  {
    id: "ST002",
    name: "Trạm Cầu Giấy",
    location: "456 Cầu Giấy, Hà Nội",
    totalBatteries: 48,
    available: 12,
    charging: 30,
    maintenance: 6,
    status: "low",
  },
  {
    id: "ST003",
    name: "Trạm Đà Nẵng",
    location: "789 Hải Châu, Đà Nẵng",
    totalBatteries: 60,
    available: 55,
    charging: 3,
    maintenance: 2,
    status: "normal",
  },
  {
    id: "ST004",
    name: "Trạm Bình Thạnh",
    location: "321 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    totalBatteries: 45,
    available: 8,
    charging: 32,
    maintenance: 5,
    status: "critical",
  },
];

export default function StationsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý trạm đổi pin
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả các trạm đổi pin trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link href="/stations/add">
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
              {stations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng pin khả dụng
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stations.reduce((sum, station) => sum + station.available, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang sạc</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stations.reduce((sum, station) => sum + station.charging, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bảo trì</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stations.reduce((sum, station) => sum + station.maintenance, 0)}
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
                placeholder="Tìm kiếm theo tên trạm hoặc địa chỉ..."
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã trạm</TableHead>
                <TableHead>Tên trạm</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Tổng pin</TableHead>
                <TableHead>Khả dụng</TableHead>
                <TableHead>Đang sạc</TableHead>
                <TableHead>Bảo trì</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.id}</TableCell>
                  <TableCell>{station.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {station.location}
                  </TableCell>
                  <TableCell>{station.totalBatteries}</TableCell>
                  <TableCell>
                    <span className="font-medium text-primary">
                      {station.available}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-secondary">
                      {station.charging}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-destructive">
                      {station.maintenance}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        station.status === "normal"
                          ? "default"
                          : station.status === "low"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {station.status === "normal"
                        ? "Bình thường"
                        : station.status === "low"
                        ? "Pin thấp"
                        : "Cần bổ sung"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/stations/${station.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/stations/${station.id}/edit`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
