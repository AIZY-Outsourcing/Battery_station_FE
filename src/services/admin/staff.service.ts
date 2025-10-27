import api from "@/lib/api";

export const getStaffs = async () => {
    const response = await api.get("/staffs");
    return response.data;
}