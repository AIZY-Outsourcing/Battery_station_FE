import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://enerzy-be.aizy.vn/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // gửi cookie cùng với yêu cầu
})


// Interceptor: thêm access_token vào header của mỗi yêu cầu
api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken; // lấy access token từ store
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // thêm token vào header
    }
    return config;
})

// Interceptor: xử lý 401 và làm mới token (refresh token)
api.interceptors.response.use (
    (response) => response, // nếu phản hồi thành công, trả về phản hồi
    async (error) => {
        const originalRequest = error.config; // lưu yêu cầu gốc
        if (error.response?.status === 401 && !originalRequest._retry) { // nếu lỗi 401 và chưa thử làm mới token
            originalRequest._retry = true; // đánh dấu đã thử làm mới token
            const { user, clearAuth, setAuth } = useAuthStore.getState(); // lấy các hàm từ store
            
            try {
                // Gọi API refresh - refresh token sẽ được gửi tự động qua cookie
                const response = await authService.refresh(); 
                const newAccessToken = response.data.data.data.access_token; // lấy access token mới

                // Cập nhật lại trạng thái xác thực trong store (chỉ access token)
                setAuth(user!, newAccessToken); 

                // Cập nhật lại header Authorization cho yêu cầu gốc
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; 

                // Thực hiện lại yêu cầu gốc với token mới
                return api(originalRequest);
            } catch (refreshError) {
                // Nếu làm mới token thất bại, xóa trạng thái xác thực
                clearAuth(); 
                return Promise.reject(refreshError); // Promise.reject để trả về lỗi
            }
        }
        return Promise.reject(error); // trả về lỗi nếu không phải 401 hoặc đã thử làm mới token     
    }
)


export default api;