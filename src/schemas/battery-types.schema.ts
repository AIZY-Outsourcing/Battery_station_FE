import { z } from "zod";

// Battery type schema for create/update forms
export const batteryTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Tên loại pin là bắt buộc")
    .min(3, "Tên loại pin phải có ít nhất 3 ký tự")
    .max(100, "Tên loại pin không được vượt quá 100 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả là bắt buộc")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được vượt quá 500 ký tự"),
});

// Create battery type request schema
export const createBatteryTypeSchema = batteryTypeSchema;

// Update battery type request schema (all fields optional)
export const updateBatteryTypeSchema = batteryTypeSchema.partial();

// Infer types from schemas
export type CreateBatteryTypeRequest = z.infer<typeof createBatteryTypeSchema>;
export type UpdateBatteryTypeRequest = z.infer<typeof updateBatteryTypeSchema>;