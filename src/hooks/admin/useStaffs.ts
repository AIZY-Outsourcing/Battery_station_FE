import { getStaffs } from "@/services/admin/staff.service";
import { Staff } from "@/types/admin/staff.type";
import { useQuery } from "@tanstack/react-query";

export const useGetStaffs = () => {
    return useQuery<{data: Staff[]; statusCode: number; message: string}>({
        queryKey: ["staffs"],
        queryFn: getStaffs
    });
};