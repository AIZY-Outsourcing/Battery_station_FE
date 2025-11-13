import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById } from "@/services/admin/users.service";
import { UsersParams, UsersListResponse, UserDetailResponse } from "@/types/admin/users.type";

// Hook to get all users
export const useGetUsers = (params?: UsersParams) => {
    return useQuery<UsersListResponse>({
        queryKey: ["users", params],
        queryFn: () => getUsers(params),
    });
};

// Hook to get user by ID
export const useGetUserById = (id: string) => {
    return useQuery<UserDetailResponse>({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
};
