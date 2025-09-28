"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Battery, Eye, EyeOff, Zap } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Gọi hook useLogin để lấy mutation đăng nhập
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Gọi mutation đăng nhập với email và mật khẩu
    loginMutation.mutate(
      { emailOrPhone, password },
      {
        onSuccess: (res: any) => {
          const role = res?.data?.data?.data?.user?.role;

          if (role === "staff") {
            router.push("/staff");
            toast.success("Staff đăng nhập thành công!");
          } else if (role === "admin") {
            router.push("/admin");
            toast.success("Admin đăng nhập thành công!");
          } else {
            router.push("/login");
            toast.error("Vai trò không hợp lệ.");
          }
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo và tiêu đề */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Battery className="h-12 w-12 text-primary" />
              <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Enerzy EV
          </h1>
          <p className="text-muted-foreground mt-2">
            Hệ thống quản lý đổi pin xe điện
          </p>
        </div>

        {/* Form đăng nhập */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin để truy cập hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@gmail.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Nút đăng nhập */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
            {/* Thông báo lỗi */}
            {loginMutation.isError && (
              <p className="text-red-500 text-sm text-center mt-2">
                {(loginMutation.error as any).response?.data?.message ||
                  "Đăng nhập thất bại"}
              </p>
            )}
            {/* Liên kết hỗ trợ */}
            <div className="text-center space-y-2 mt-6">
              <Button variant="link" className="text-sm text-muted-foreground">
                Quên mật khẩu?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin hỗ trợ */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Cần hỗ trợ? Liên hệ:{" "}
            <a
              href="mailto:support@enerzy.com"
              className="text-primary hover:underline"
            >
              support@enerzy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
