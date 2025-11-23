import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, getUserById, updateUserRole, deleteUser } from "@/services/admin/users.service";
import { UsersParams, UsersListResponse, UserDetailResponse } from "@/types/admin/users.type";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

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

// Hook to update user role with protection against self-modification
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuthStore();

    return useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: 'user' | 'staff' | 'admin' }) => {
            // Prevent admin from modifying their own role
            if (currentUser && currentUser.id === userId) {
                throw new Error("Bạn không thể thay đổi vai trò của chính mình");
            }
            
            return updateUserRole(userId, role);
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch users queries
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
            
            toast.success(`Đã cập nhật vai trò người dùng thành công`);
        },
        onError: (error: Error) => {
            console.error("Error updating user role:", error);
            toast.error(error.message || "Có lỗi xảy ra khi cập nhật vai trò người dùng");
        },
    });
};

// Hook to delete user with protection against self-deletion
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuthStore();

    return useMutation({
        mutationFn: async (userId: string) => {
            // Prevent admin from deleting themselves
            if (currentUser && currentUser.id === userId) {
                throw new Error("Bạn không thể xóa tài khoản của chính mình");
            }
            
            return deleteUser(userId);
        },
        onSuccess: (data, userId) => {
            // Invalidate and refetch users queries
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
            
            toast.success("Đã xóa người dùng thành công");
        },
        onError: (error: Error) => {
            console.error("Error deleting user:", error);
            toast.error(error.message || "Có lỗi xảy ra khi xóa người dùng");
        },
    });
};
