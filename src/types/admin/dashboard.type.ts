export interface StationStats {
  total: number;
  changeFromLastMonth: number;
  changePercentage: number;
}

export interface BatteryStats {
  total: number;
  activePercentage: number;
  available: number;
  charging: number;
  inUse: number;
  maintenance: number;
  damaged: number;
  reserved: number;
}

export interface UserStats {
  totalActiveUsers: number;
  changeFromLastMonth: number;
  changePercentage: number;
  totalUsers: number;
  newUsersThisMonth: number;
}

export interface SwapStats {
  swapsToday: number;
  changeFromYesterday: number;
  changePercentage: number;
  swapsThisWeek: number;
  swapsThisMonth: number;
}

export interface StationStatus {
  id: string;
  name: string;
  city: string;
  totalBatteries: number;
  availableBatteries: number;
  status: "normal" | "warning" | "critical";
  utilizationRate: number;
}

export interface RecentActivity {
  id: string;
  type: "battery_swap" | "battery_movement" | "maintenance" | "user_registration" | "subscription";
  title: string;
  description: string;
  timestamp: string;
  severity: "success" | "info" | "warning" | "error";
  relatedEntity: {
    type: string;
    id: string;
    name: string;
  };
}

export interface SystemHealth {
  batteryAvailabilityRate: number;
  stationEfficiency: number;
  customerSatisfaction: number;
  averageSwapTime: number;
  systemUptime: number;
}

export interface DashboardOverview {
  stationStats: StationStats;
  batteryStats: BatteryStats;
  userStats: UserStats;
  swapStats: SwapStats;
  stationStatus: StationStatus[];
  recentActivities: RecentActivity[];
  systemHealth: SystemHealth;
}
