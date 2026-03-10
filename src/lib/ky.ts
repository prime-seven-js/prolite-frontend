import ky from "ky";

import { useAuthStore } from "@/stores/useAuthStore";

const api = ky.create({
  prefixUrl: "http://127.0.0.1:8787",
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAuthStore.getState().token;

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export default api;
