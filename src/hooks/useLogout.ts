import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
    const clearAuth = useAuthStore(state => state.clearAuth);
    const router = useRouter();

    return useMutation({
        mutationFn: () => {
            return authService.logout();
        },
        onSuccess: () => {
            clearAuth(); // Xóa auth state
            router.push("/login"); // Redirect về login
            toast.success("Đăng xuất thành công!");
        },
        onError: (error: Error) => {
            // Dù API lỗi vẫn clear auth và redirect (vì có thể server đã logout)
            clearAuth();
            router.push("/login");
            console.error("Logout error:", error);
            toast.success("Đăng xuất thành công!");
        }
    });
};