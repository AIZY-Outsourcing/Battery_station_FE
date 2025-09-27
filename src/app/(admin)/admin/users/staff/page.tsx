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
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Lock,
  Unlock,
  UserCheck,
  Activity,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const staff = [
  {
    id: "STAFF001",
    name: "Nguyễn Văn D",
    email: "nguyenvand@company.com",
    phone: "0934567890",
    role: "supervisor",
    stations: ["Trạm Quận 1", "Trạm Bình Thạnh"],
    status: "active",
    joinDate: "2023-06-15",
    lastLogin: "2024-01-15 08:30",
    transactionsHandled: 1247,
    complaintsResolved: 23,
    performance: 95,
  },
  {
    id: "STAFF002",
    name: "Trần Thị E",
    email: "tranthie@company.com",
    phone: "0945678901",
    role: "staff",
    stations: ["Trạm Cầu Giấy"],
    status: "active",
    joinDate: "2023-08-20",
    lastLogin: "2024-01-15 09:15",
    transactionsHandled: 892,
    complaintsResolved: 15,
    performance: 88,
  },
  {
    id: "STAFF003",
    name: "Lê Văn F",
    email: "levanf@company.com",
    phone: "0956789012",
    role: "staff",
    stations: ["Trạm Đà Nẵng"],
    status: "inactive",
    joinDate: "2023-04-10",
    lastLogin: "2024-01-10 16:45",
    transactionsHandled: 567,
    complaintsResolved: 8,
    performance: 72,
  },
];

export default function StaffPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý nhân viên
          </h1>
          <p className="text-muted-foreground">
            Quản lý nhân viên trạm đổi pin và theo dõi hiệu suất làm việc
          </p>
        </div>
        <Link href="/admin/users/staff/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân viên
          </Button>
        </Link>
      </div>

      {/* Staff Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng nhân viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {staff.length}
            </div>
            <p className="text-xs text-muted-foreground">Trên toàn hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {staff.filter((s) => s.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Nhân viên hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supervisor</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {staff.filter((s) => s.role === "supervisor").length}
            </div>
            <p className="text-xs text-muted-foreground">Quản lý trạm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu suất TB</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round(
                staff.reduce((sum, s) => sum + s.performance, 0) / staff.length
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Điểm hiệu suất</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription>
            Quản lý thông tin và hiệu suất làm việc của nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                className="pl-8"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã NV</TableHead>
                <TableHead>Tên nhân viên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạm phụ trách</TableHead>
                <TableHead>GD xử lý</TableHead>
                <TableHead>KN giải quyết</TableHead>
                <TableHead>Hiệu suất</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.role === "supervisor" ? "default" : "secondary"
                      }
                    >
                      {member.role === "supervisor" ? "Supervisor" : "Staff"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {member.stations.map((station, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {station}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.transactionsHandled}
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.complaintsResolved}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-16 rounded-full ${
                          member.performance >= 90
                            ? "bg-green-500"
                            : member.performance >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${(member.performance / 100) * 64}px`,
                        }}
                      />
                      <span className="text-sm font-medium">
                        {member.performance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "active" ? "default" : "secondary"
                      }
                    >
                      {member.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Chi tiết nhân viên - {member.name}
                            </DialogTitle>
                            <DialogDescription>
                              Thông tin chi tiết và hiệu suất làm việc
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Mã nhân viên
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.id}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Tên nhân viên
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.name}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Email
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Số điện thoại
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.phone}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Vai trò
                                </Label>
                                <Badge
                                  variant={
                                    member.role === "supervisor"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {member.role === "supervisor"
                                    ? "Supervisor"
                                    : "Staff"}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Ngày vào làm
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.joinDate}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Lần đăng nhập cuối
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.lastLogin}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Hiệu suất
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {member.performance}%
                                </p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Trạm phụ trách
                              </Label>
                              <div className="flex gap-2 mt-1">
                                {member.stations.map((station, index) => (
                                  <Badge key={index} variant="outline">
                                    {station}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">
                                  Giao dịch đã xử lý
                                </Label>
                                <p className="text-2xl font-bold text-primary">
                                  {member.transactionsHandled}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">
                                  Khiếu nại đã giải quyết
                                </Label>
                                <p className="text-2xl font-bold text-primary">
                                  {member.complaintsResolved}
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={
                          member.status === "active"
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {member.status === "active" ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
