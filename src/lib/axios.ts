import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8787",
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
