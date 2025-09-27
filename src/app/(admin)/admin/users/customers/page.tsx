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
  Lock,
  Unlock,
  CreditCard,
  Phone,
  Mail,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const customers = [
  {
    id: "USER001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    vehicleModel: "VinFast VF8",
    batteryType: "LiFePO4-72V",
    subscriptionType: "unlimited",
    subscriptionStatus: "active",
    registrationDate: "2024-01-10",
    lastSwap: "2024-01-15 14:30",
    totalSwaps: 45,
    accountStatus: "active",
    totalSpent: 2500000,
  },
  {
    id: "USER002",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    vehicleModel: "VinFast VF9",
    batteryType: "LiFePO4-72V",
    subscriptionType: "monthly_10",
    subscriptionStatus: "active",
    registrationDate: "2024-01-05",
    lastSwap: "2024-01-14 16:45",
    totalSwaps: 23,
    accountStatus: "active",
    totalSpent: 1200000,
  },
  {
    id: "USER003",
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    vehicleModel: "VinFast VF6",
    batteryType: "LiFePO4-60V",
    subscriptionType: "monthly_3",
    subscriptionStatus: "expired",
    registrationDate: "2023-12-20",
    lastSwap: "2024-01-12 09:15",
    totalSwaps: 67,
    accountStatus: "suspended",
    totalSpent: 3400000,
  },
];

const transactions = [
  {
    id: "TXN001",
    userId: "USER001",
    type: "swap",
    stationName: "Trạm Quận 1",
    amount: 50000,
    date: "2024-01-15 14:30",
    status: "completed",
  },
  {
    id: "TXN002",
    userId: "USER001",
    type: "subscription",
    description: "Gia hạn gói Unlimited",
    amount: 500000,
    date: "2024-01-10 10:00",
    status: "completed",
  },
];

export default function CustomersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý khách hàng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý thông tin khách hàng, gói thuê và lịch sử giao
            dịch
          </p>
        </div>
      </div>

      {/* Customer Stats */}
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
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.accountStatus === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Tài khoản hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gói đang hoạt động
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                customers.filter((c) => c.subscriptionStatus === "active")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Gói thuê đang sử dụng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu tháng
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">7.1M</div>
            <p className="text-xs text-muted-foreground">
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>
            Quản lý thông tin và trạng thái của tất cả khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, SĐT..."
                className="pl-8"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Gói thuê" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
                <SelectItem value="monthly_10">10 lượt/tháng</SelectItem>
                <SelectItem value="monthly_3">3 tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KH</TableHead>
                <TableHead>Tên khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Xe</TableHead>
                <TableHead>Gói thuê</TableHead>
                <TableHead>Trạng thái gói</TableHead>
                <TableHead>Lần đổi cuối</TableHead>
                <TableHead>Tổng lượt</TableHead>
                <TableHead>Trạng thái TK</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {customer.vehicleModel}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.batteryType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {customer.subscriptionType === "unlimited"
                        ? "Unlimited"
                        : customer.subscriptionType === "monthly_10"
                        ? "10 lượt/tháng"
                        : "3 tháng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.subscriptionStatus === "active"
                          ? "default"
                          : customer.subscriptionStatus === "expired"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {customer.subscriptionStatus === "active"
                        ? "Hoạt động"
                        : customer.subscriptionStatus === "expired"
                        ? "Hết hạn"
                        : "Tạm dừng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.lastSwap}
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.totalSwaps}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.accountStatus === "active"
                          ? "default"
                          : customer.accountStatus === "suspended"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {customer.accountStatus === "active"
                        ? "Hoạt động"
                        : customer.accountStatus === "suspended"
                        ? "Tạm khóa"
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
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Chi tiết khách hàng - {customer.name}
                            </DialogTitle>
                            <DialogDescription>
                              Thông tin chi tiết và lịch sử giao dịch
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="info" className="w-full">
                            <TabsList>
                              <TabsTrigger value="info">Thông tin</TabsTrigger>
                              <TabsTrigger value="transactions">
                                Lịch sử giao dịch
                              </TabsTrigger>
                              <TabsTrigger value="swaps">
                                Lịch sử đổi pin
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="info" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Mã khách hàng
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Tên khách hàng
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Email
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.email}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Số điện thoại
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.phone}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Xe
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.vehicleModel}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Loại pin
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.batteryType}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Ngày đăng ký
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.registrationDate}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Tổng chi tiêu
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.totalSpent.toLocaleString(
                                      "vi-VN"
                                    )}{" "}
                                    VNĐ
                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="transactions">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Mã GD</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead>Số tiền</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {transactions
                                    .filter((t) => t.userId === customer.id)
                                    .map((transaction) => (
                                      <TableRow key={transaction.id}>
                                        <TableCell>{transaction.id}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {transaction.type === "swap"
                                              ? "Đổi pin"
                                              : "Gói thuê"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {transaction.stationName ||
                                            transaction.description}
                                        </TableCell>
                                        <TableCell>
                                          {transaction.amount.toLocaleString(
                                            "vi-VN"
                                          )}{" "}
                                          VNĐ
                                        </TableCell>
                                        <TableCell>
                                          {transaction.date}
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="default">
                                            Hoàn thành
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TabsContent>
                            <TabsContent value="swaps">
                              <p className="text-sm text-muted-foreground">
                                Lịch sử đổi pin chi tiết sẽ được hiển thị ở đây
                              </p>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={
                          customer.accountStatus === "active"
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {customer.accountStatus === "active" ? (
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
    </main>
  );
}
