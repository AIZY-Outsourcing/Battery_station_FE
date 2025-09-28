import {useMutation} from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export const useLogin = () => {
    const setAuth = useAuthStore(state => state.setAuth); // lấy hàm setAuth từ store

    return useMutation({
        mutationFn: (data: { emailOrPhone: string; password: string }) => {
            return authService.login(data.emailOrPhone, data.password); // gọi API đăng nhập
        },
        onSuccess: (response) => {
            // Cấu trúc từ API: response.data.data.data
            const apiData = response?.data?.data?.data;
            
            if (apiData && apiData.user && apiData.tokens) {
                const user = apiData.user;
                const tokens = apiData.tokens;
                // Chỉ lưu access token, refresh token đã được lưu trong cookie bởi backend
                setAuth(user, tokens.access_token);
            } else {
                console.error("❌ Invalid response structure:", response);
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
        }
    })
}