import api from "@/lib/api";
import { UsersParams, UsersListResponse, UserDetailResponse, UpdateUserRoleRequest } from "@/types/admin/users.type";

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

// Update user role
export const updateUserRole = async (id: string, role: 'user' | 'staff' | 'admin'): Promise<UserDetailResponse> => {
    const response = await api.put(`/users/${id}`, { role });
    return response.data;
};

// Soft delete user
export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};
