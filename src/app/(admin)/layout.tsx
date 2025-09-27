import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "../globals.css";
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapped";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Battery Management - Admin Dashboard",
  description: "Hệ thống quản lý đổi pin xe điện",
  generator: "v0.app",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <AdminLayoutWrapper>
          <Suspense fallback={null}>{children}</Suspense>
        </AdminLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
