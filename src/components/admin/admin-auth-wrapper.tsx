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

  useEffect(() => {
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
  }, [user, accessToken, router]);

  // Hiển thị loading trong khi kiểm tra
  if (isChecking || !user || !accessToken || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
