export enum KioskActionState {
  REQUESTED = 'requested',
  RESERVATION_CONFIRMED = 'reservation_confirmed',
  OPEN_EMPTY_SLOT = 'open_empty_slot',
  OLD_BATTERY_IN = 'old_battery_in',
  CLOSE_EMPTY_SLOT = 'close_empty_slot',
  OPEN_REQUIRE_SLOT = 'open_require_slot',
  NEW_BATTERY_OUT = 'new_battery_out',
  CLOSE_REQUIRE_SLOT = 'close_require_slot',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface KioskSlot {
  id: number;
  hasPin: boolean;
  pinId: string | null;
  pinStatus: 'available' | 'charging' | 'maintenance' | 'damaged' | 'in_use' | 'stored';
  isOpen: boolean;
  isReserved: boolean;
  isCoverOpen: boolean; // Thêm trạng thái nắp
}

export interface KioskTransaction {
  id: string;
  userId: string;
  qrCode: string;
  currentState: KioskActionState;
  emptySlotId: number | null;
  newSlotId: number | null;
  startTime: Date;
  lastUpdateTime: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
