import z from "zod";

export const StationSchema = z.object({
    name: z.string().min(1, "Station name is required"),
    image_url: z.string().url().nullable(),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    lat: z.string().min(1, "Latitude is required"),
    lng: z.string().min(1, "Longitude is required"),
    staff_id: z.string().nullable(),
    status: z.string().min(1, "Status is required"),
})

export type CreateStationRequest = z.infer<typeof StationSchema>;
export type UpdateStationRequest = z.infer<typeof StationSchema>;