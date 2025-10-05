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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/stores/auth.store";

interface StaffSidebarProps {
  className?: string;
  isMobile?: boolean;
}

export function StaffSidebar({
  className,
  isMobile = false,
}: StaffSidebarProps) {
  const pathname = usePathname();
  const [currentStation] = useState("Trạm Quận 1"); // This would come from context/state
  const logoutMutation = useLogout();
  const user = useAuthStore((state) => state.user);

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Header - đồng bộ với admin */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">
              EV Battery
            </span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              Staff Dashboard
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Current Station */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 p-3 bg-sidebar-accent rounded-lg">
            <MapPin className="w-4 h-4 text-black" />
            <div className="flex-1">
              <p className="text-sm font-medium text-black">{currentStation}</p>
              <p className="text-xs text-gray-700">Trạm hiện tại</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ChevronDown className="w-4 h-4 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Navigation - với spacing đồng nhất */}
        <div className="flex flex-col gap-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  item.current &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer - với spacing đồng nhất */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="mr-2 h-4 w-4" />
          Cài đặt
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return <SidebarContent />;
  }

  return (
    <div
      className={cn("hidden border-r bg-sidebar lg:block h-full", className)}
    >
      <SidebarContent />
    </div>
  );
}
