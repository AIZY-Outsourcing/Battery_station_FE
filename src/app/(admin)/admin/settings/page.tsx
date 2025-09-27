import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt</h2>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>
                Cài đặt thông tin cơ bản của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="company-name">Tên công ty</Label>
                <Input
                  type="text"
                  id="company-name"
                  placeholder="EV Battery Management"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email liên hệ</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="admin@evbattery.com"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input type="tel" id="phone" placeholder="+84 123 456 789" />
              </div>
              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý các loại thông báo của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo email</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo qua email
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cảnh báo bảo trì</Label>
                  <p className="text-sm text-muted-foreground">
                    Thông báo khi cần bảo trì trạm
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Báo cáo hàng ngày</Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi báo cáo tổng quan hàng ngày
                  </p>
                </div>
                <Switch />
              </div>
              <Button>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Cài đặt bảo mật cho tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input type="password" id="current-password" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input type="password" id="new-password" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input type="password" id="confirm-password" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Xác thực hai yếu tố</Label>
                  <p className="text-sm text-muted-foreground">
                    Tăng cường bảo mật với 2FA
                  </p>
                </div>
                <Switch />
              </div>
              <Button>Cập nhật mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt hệ thống</CardTitle>
              <CardDescription>Cấu hình hệ thống và hiệu suất</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">
                    Tạm ngưng các dịch vụ để bảo trì
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thu thập dữ liệu</Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động thu thập dữ liệu từ các trạm
                  </p>
                </div>
                <Switch />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="backup-frequency">Tần suất sao lưu (giờ)</Label>
                <Input type="number" id="backup-frequency" placeholder="24" />
              </div>
              <Button>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
