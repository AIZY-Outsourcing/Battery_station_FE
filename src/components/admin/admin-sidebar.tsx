"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Battery,
  BrainCircuit,
  ChevronDown,
  Home,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Quản lý trạm",
    icon: Battery,
    items: [
      { title: "Danh sách trạm", href: "/admin/stations" },
      { title: "Loại pin", href: "/admin/stations/battery-types" },
      { title: "Theo dõi pin", href: "/admin/stations/batteries" },
      { title: "Điều phối pin", href: "/admin/stations/transfer" },
      { title: "Khiếu nại", href: "/admin/stations/complaints" },
    ],
  },
  {
    title: "Quản lý người dùng",
    icon: Users,
    items: [
      { title: "Khách hàng", href: "/admin/users/customers" },
      { title: "Nhân viên", href: "/admin/users/staff" },
      { title: "Gói thuê pin", href: "/admin/users/subscriptions" },
      { title: "Giao dịch thanh toán", href: "/admin/users/payments" },
    ],
  },
  {
    title: "Báo cáo & Thống kê",
    icon: BarChart3,
    items: [
      { title: "Doanh thu", href: "/admin/reports/revenue" },
      // { title: "Tần suất sử dụng", href: "/admin/reports/usage" },
    ],
  },
  {
    title: "AI Dự báo",
    href: "/admin/ai-prediction",
    icon: BrainCircuit,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
}

export function AdminSidebar({ className, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar">
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
              Admin Dashboard
            </span>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => {
            if (item.items) {
              const isOpen = openItems.includes(item.title);
              return (
                <Collapsible
                  key={item.title}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {item.items.map((subItem) => (
                      <Button
                        key={subItem.href}
                        variant="ghost"
                        size="sm"
                        asChild
                        className={cn(
                          "w-full justify-start pl-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          pathname === subItem.href &&
                            "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <Link href={subItem.href}>{subItem.title}</Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === item.href &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
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
