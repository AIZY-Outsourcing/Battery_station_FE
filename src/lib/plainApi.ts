// lib/plainApi.ts
import axios from "axios";

const plainApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://enerzy-be.aizy.vn/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // nếu backend cần cookie
});


// plainApi chỉ dùng cho login, refresh token

export default plainApi;
