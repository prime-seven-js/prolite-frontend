import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

/**
 * Khởi tạo luồng nối api
 */

const api = axios.create({
  baseURL: "https://api.prolite.gay",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
