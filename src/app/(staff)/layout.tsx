import type React from "react";
import { Inter } from "next/font/google";
import { StaffAuthWrapper } from "@/components/staff/staff-auth-wrapper"; // 👈 thêm dòng này

const inter = Inter({ subsets: ["latin"] });

export default function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      {/* ✅ Bọc children bằng AuthWrapper */}
      <StaffAuthWrapper>{children}</StaffAuthWrapper>
    </div>
  );
}
