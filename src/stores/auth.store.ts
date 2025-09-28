import {create} from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth"; 

// tạo interface AuthState để định kiểu cho trạng thái xác thực
interface AuthState {
    user: User | null; // thông tin người dùng, có thể là null nếu chưa đăng nhập
    accessToken: string | null; // token truy cập, có thể là null nếu chưa đăng nhập
    setAuth: (user: User, access: string) => void; // hàm để cập nhật trạng thái xác thực với param user và access token
    clearAuth: () => void; // hàm để xóa trạng thái xác thực
}

export const useAuthStore = create<AuthState>()(
  persist( // sử dụng middleware persist để lưu trạng thái vào localStorage
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, access) =>
        set({ user, accessToken: access }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-storage", // key lưu trong localStorage
      partialize: (state) => ({ // partialize để chỉ lưu một phần của state
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);