"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Battery,
  ArrowLeftRight,
  MessageSquare,
  LayoutDashboard,
  MapPin,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StaffSidebarProps {
  className?: string;
}

export function StaffSidebar({ className }: StaffSidebarProps) {
  const pathname = usePathname();
  const [currentStation] = useState("Trạm Quận 1"); // This would come from context/state

  const navigation = [
    {
      name: "Tổng quan",
      href: "/staff/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/staff/dashboard",
    },
    {
      name: "Quản lý Pin",
      href: "/staff/inventory",
      icon: Battery,
      current: pathname.startsWith("/staff/inventory"),
    },
    {
      name: "Giao dịch",
      href: "/staff/transactions",
      icon: ArrowLeftRight,
      current: pathname.startsWith("/staff/transactions"),
    },
    {
      name: "Hỗ trợ",
      href: "/staff/support",
      icon: MessageSquare,
      current: pathname.startsWith("/staff/support"),
      badge: "3",
    },
  ];

  return (
    <div className={cn("flex flex-col bg-card border-r", className)}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Battery className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">BSS Staff</h2>
            <p className="text-xs text-muted-foreground">Nhân viên trạm</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Current Station */}
      <div className="p-4">
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <MapPin className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{currentStation}</p>
            <p className="text-xs text-muted-foreground">Trạm hiện tại</p>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  item.current &&
                    "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="w-4 h-4" />
          Cài đặt
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
