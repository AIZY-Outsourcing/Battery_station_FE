"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const AdminAuthWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Đảm bảo chỉ chạy trên client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = () => {
      // Nếu chưa đăng nhập -> đi đến unauthorize
      if (!accessToken || !user) {
        router.replace("/unauthorize");
        return;
      }

      // Nếu đăng nhập nhưng không phải admin -> đi đến unauthorize
      if (user.role !== "admin") {
        router.replace("/unauthorize");
        return;
      }

      // Nếu là admin hợp lệ -> cho phép hiển thị
      setIsChecking(false);
    };

    // Delay một chút để tránh flash và conflict với Next.js routing
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user, accessToken, router, isMounted]);

  // Hiển thị loading trong khi kiểm tra hoặc chưa mount
  if (!isMounted || isChecking) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        suppressHydrationWarning
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          suppressHydrationWarning
        ></div>
      </div>
    );
  }

  // Nếu không có user/token hoặc không phải admin -> không render (đã redirect)
  if (!user || !accessToken || user.role !== "admin") {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        suppressHydrationWarning
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          suppressHydrationWarning
        ></div>
      </div>
    );
  }

  // Nếu là admin hợp lệ -> render children
  return <>{children}</>;
};