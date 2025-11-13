import api from "@/lib/api";
import { UsersParams, UsersListResponse, UserDetailResponse } from "@/types/admin/users.type";

// Get all users with optional pagination and sorting
export const getUsers = async (params?: UsersParams): Promise<UsersListResponse> => {
    const response = await api.get("/users", { params });
    return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserDetailResponse> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};
