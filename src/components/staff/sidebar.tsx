"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  GitCompare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/stores/auth.store";
import { useStaffStations } from "@/hooks/staff/useStaffStations";
import { useSupportTickets } from "@/hooks/staff/useSupportTickets";
import { useQueryClient } from "@tanstack/react-query";
import type { StaffStation } from "@/types/staff/station.type";

interface StaffSidebarProps {
  className?: string;
  isMobile?: boolean;
}

export function StaffSidebar({
  className,
  isMobile = false,
}: StaffSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();
  const user = useAuthStore((state) => state.user);
  const { data: stations = [] } = useStaffStations();
  const { data: supportData } = useSupportTickets({});
  
  const [currentStation, setCurrentStation] = useState<any>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const stationData = localStorage.getItem("selectedStation");
    if (stationData) {
      try {
        const station = JSON.parse(stationData);
        setCurrentStation(station);
      } catch (error) {
        console.error("Error parsing station data:", error);
      }
    }
  }, []);

  const handleStationChange = (station: StaffStation) => {
    localStorage.setItem("selectedStation", JSON.stringify({
      id: station.id,
      name: station.name,
      address: station.address,
      city: station.city,
      lat: station.lat,
      lng: station.lng,
      status: station.status,
      image_url: station.image_url,
      staff_id: station.staff_id,
      created_at: station.created_at,
      updated_at: station.updated_at,
    }));
    setCurrentStation(station);
    setIsPopoverOpen(false);
    
    // Invalidate all station-related queries to force refetch
    queryClient.invalidateQueries({ queryKey: ["station-batteries"] });
    queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("stationChanged", { detail: station }));
    
    // Refresh page to load new station data
    router.refresh();
  };

  // Get support tickets count - filter by staff_id and station_id
  const supportTicketsCount = supportData?.tickets 
    ? (Array.isArray(supportData.tickets) 
        ? supportData.tickets 
        : Object.values(supportData.tickets))
        .filter((ticket: any) => {
          // Filter by staff_id (user.id when role is staff)
          const matchesStaff = user?.role === "staff" ? ticket.staff_id === user.id : true;
          // Filter by station_id (current station)
          const matchesStation = currentStation?.id ? ticket.station_id === currentStation.id : true;
          // Only count "open" or "in-progress" tickets
          const isActive = ticket.status === "open" || ticket.status === "in-progress";
          return matchesStaff && matchesStation && isActive;
        }).length
    : 0;

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
      name: "Đổi chéo pin",
      href: "/staff/exchange",
      icon: GitCompare,
      current: pathname.startsWith("/staff/exchange"),
    },
    {
      name: "Hỗ trợ",
      href: "/staff/support",
      icon: MessageSquare,
      current: pathname.startsWith("/staff/support"),
      badge: supportTicketsCount > 0 ? supportTicketsCount.toString() : undefined,
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
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 p-3 bg-sidebar-accent rounded-lg cursor-pointer hover:bg-sidebar-accent/80 transition-colors">
                <MapPin className="w-4 h-4 text-black flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {currentStation?.name || "Chưa chọn trạm"}
                  </p>
                  <p className="text-xs text-gray-700">Trạm hiện tại</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-700 flex-shrink-0" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-2">
                <div className="px-3 py-2 text-sm font-semibold">
                  Chọn trạm khác
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {stations.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => handleStationChange(station)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors flex items-center justify-between",
                        currentStation?.id === station.id && "bg-accent"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{station.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {station.address}, {station.city}
                        </p>
                      </div>
                      <Badge
                        variant={station.status === "active" ? "default" : "secondary"}
                        className="ml-2 flex-shrink-0"
                      >
                        {station.status === "active"
                          ? "Hoạt động"
                          : station.status === "maintenance"
                          ? "Bảo trì"
                          : "Không hoạt động"}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
