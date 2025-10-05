"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizePage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Icon và tiêu đề chính */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Truy cập bị từ chối
            </h1>
            <p className="text-lg text-muted-foreground">
              Bạn không có quyền truy cập vào trang này
            </p>
          </div>
        </div>

        {/* Card thông tin lỗi */}
        <Card className="border-destructive/20 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle className="text-2xl text-destructive">
              Lỗi xác thực
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thông báo lỗi */}
            <div className="text-center space-y-4">
              <p className="text-base text-foreground leading-relaxed">
                Bạn đã cố gắng truy cập vào trang <strong>/staff</strong> hoặc{" "}
                <strong>/admin</strong>
                mà không có quyền phù hợp.
              </p>

              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Điều này có thể xảy ra do:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bạn chưa đăng nhập vào hệ thống</li>
                  <li>• Vai trò tài khoản không phù hợp (Staff/Admin)</li>
                  <li>• Phiên đăng nhập đã hết hạn</li>
                  <li>• Truy cập trực tiếp URL không được phép</li>
                </ul>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="space-y-3">
              <Button
                onClick={handleBackToLogin}
                className="w-full h-12 text-base"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại trang đăng nhập
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer thông tin */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Vui lòng đăng nhập với tài khoản có quyền phù hợp
          </p>
          <div className="text-xs text-muted-foreground">
            Mã lỗi:{" "}
            <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
              403_UNAUTHORIZED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
