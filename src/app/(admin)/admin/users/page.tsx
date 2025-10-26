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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Plus,
  Eye,
  Settings,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";

const customers = [
  {
    id: "USR001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    subscriptionType: "premium",
    status: "active",
    joinedAt: "2024-01-15",
    totalTransactions: 45,
  },
  {
    id: "USR002",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    subscriptionType: "basic",
    status: "active",
    joinedAt: "2024-02-20",
    totalTransactions: 23,
  },
  {
    id: "USR003",
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    subscriptionType: "premium",
    status: "suspended",
    joinedAt: "2024-03-10",
    totalTransactions: 12,
  },
];

const staff = [
  {
    id: "STF001",
    name: "Admin Nguyễn",
    email: "admin@enerzy.com",
    phone: "0987654321",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-01",
    lastLogin: "2024-10-26 09:30",
  },
  {
    id: "STF002",
    name: "Nhân viên Trần",
    email: "staff1@enerzy.com",
    phone: "0976543210",
    role: "staff",
    status: "active",
    joinedAt: "2024-02-15",
    lastLogin: "2024-10-25 18:45",
  },
];

export default function UsersPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Hoạt động</Badge>;
      case "suspended":
        return <Badge variant="destructive">Bị khóa</Badge>;
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case "premium":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Premium
          </Badge>
        );
      case "basic":
        return <Badge variant="secondary">Basic</Badge>;
      default:
        return <Badge variant="outline">Không có</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "staff":
        return <Badge variant="default">Nhân viên</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng khách hàng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {customers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách hàng hoạt động
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách hàng Premium
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {customers.filter((c) => c.subscriptionType === "premium").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {staff.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="staff">Nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>
                  Quản lý thông tin khách hàng và gói dịch vụ. Khách hàng tự
                  đăng ký qua ứng dụng di động.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                    className="pl-8"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã KH</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Gói dịch vụ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Số giao dịch</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.id}
                      </TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        {getSubscriptionBadge(customer.subscriptionType)}
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.totalTransactions}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/admin/users/customers/${customer.id}`}
                            >
                              <Eye className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách nhân viên</CardTitle>
                <CardDescription>
                  Quản lý tài khoản nhân viên và quyền hạn
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/users/staff/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm nhân viên
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="pl-8"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đăng nhập cuối</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.id}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/users/staff/${member.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/users/staff/${member.id}/edit`}>
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
        </TabsContent>
      </Tabs>
    </main>
  );
}
