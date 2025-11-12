import { z } from 'zod';

// Schema for creating a new battery
export const createBatterySchema = z.object({
  name: z.string().min(1, 'Tên pin không được để trống'),
  serial_number: z.string().min(1, 'Số serial không được để trống'),
  capacity_kwh: z.number().min(1, 'Dung lượng phải lớn hơn 0'),
  soh: z.number().min(0).max(100, 'SOH phải từ 0-100'),
  battery_type_id: z.string().min(1, 'Loại pin không được để trống'),
  station_id: z.string().optional(),
  station_kiosk_slot: z.string().optional(),
});

// Schema for updating an existing battery
export const updateBatterySchema = createBatterySchema.partial();

// TypeScript types derived from schemas
export type CreateBatteryRequest = z.infer<typeof createBatterySchema>;
export type UpdateBatteryRequest = z.infer<typeof updateBatterySchema>;