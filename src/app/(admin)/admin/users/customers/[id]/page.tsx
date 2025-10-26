import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react";
import Link from "next/link";

// Mock data - trong thực tế sẽ fetch từ API
const customerData = {
  id: "USR001",
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0901234567",
  subscriptionType: "premium",
  status: "active",
  joinedAt: "2024-01-15",
  lastLogin: "2024-10-25 14:30",
  totalTransactions: 45,
  totalSpent: 1250000,
  currentBalance: 50000,
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  emergencyContact: "0987654321",
};

const recentTransactions = [
  {
    id: "TXN001",
    date: "2024-10-25",
    type: "charge",
    station: "ST001 - Nguyễn Huệ",
    amount: 25000,
    status: "completed",
  },
  {
    id: "TXN002",
    date: "2024-10-24",
    type: "subscription",
    station: "Premium Plan",
    amount: 200000,
    status: "completed",
  },
  {
    id: "TXN003",
    date: "2024-10-23",
    type: "charge",
    station: "ST005 - Lê Lợi",
    amount: 30000,
    status: "completed",
  },
];

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết khách hàng
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và lịch sử giao dịch của khách hàng
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Thông tin cơ bản */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Mã khách hàng
                </label>
                <p className="text-lg font-semibold">{customerData.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </label>
                <div>{getStatusBadge(customerData.status)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Họ và tên
                </label>
                <p className="text-lg">{customerData.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Gói dịch vụ
                </label>
                <div>{getSubscriptionBadge(customerData.subscriptionType)}</div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p>{customerData.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </label>
                <p>{customerData.phone}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Địa chỉ
                </label>
                <p>{customerData.address}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Liên hệ khẩn cấp
                </label>
                <p>{customerData.emergencyContact}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ngày tham gia
                </label>
                <p>
                  {new Date(customerData.joinedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Đăng nhập cuối
                </label>
                <p>{customerData.lastLogin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thống kê giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tổng giao dịch
                </label>
                <p className="text-2xl font-bold text-primary">
                  {customerData.totalTransactions}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tổng chi tiêu
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(customerData.totalSpent)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Số dư hiện tại
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(customerData.currentBalance)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lịch sử giao dịch */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch gần đây</CardTitle>
          <CardDescription>
            Các giao dịch sạc pin và thanh toán gói dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã GD</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạm/Dịch vụ</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "charge" ? "default" : "secondary"
                      }
                    >
                      {transaction.type === "charge"
                        ? "Sạc pin"
                        : "Gói dịch vụ"}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.station}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Hoàn thành</Badge>
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
