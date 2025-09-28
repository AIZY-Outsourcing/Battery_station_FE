import api from "@/lib/api";
import plainApi from "@/lib/plainApi";
import { LoginResponse, RefreshResponse } from "@/types/auth";

export const authService = {
    login: (emailOrPhone: string, password: string) => {
       return plainApi.post<LoginResponse>("/auth/login", { emailOrPhone, password  })
    },

    refresh: () => {
       // Refresh token sẽ được gửi tự động qua HTTP-only cookie
       return plainApi.post<RefreshResponse>("/auth/refresh")
    },

    logout: () => {
       // Logout có thể dùng api vì cần access token để xác thực
       return api.post("/auth/logout");
    }

}