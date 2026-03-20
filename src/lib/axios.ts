import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

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

// Auto-logout on 401 (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { token } = useAuthStore.getState();
      if (token) {
        useAuthStore.getState().clearState();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
