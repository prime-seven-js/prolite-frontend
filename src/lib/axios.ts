import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

/**
 * Axios instance cấu hình sẵn baseURL.
 * Tất cả API calls trong app đều dùng instance này.
 */
const api = axios.create({
  baseURL: "https://api.prolite.gay/",
});

/**
 * Request interceptor — tự động gắn JWT token vào header Authorization.
 * Lấy token từ Zustand auth store (không cần truyền thủ công).
 */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
