import api from "@/lib/axios";

export const authService = {
  signUp: async (email: string, username: string, password: string) => {
    const res = await api.post(
      "/register",
      { email, username, password },
      { withCredentials: true },
    );
    return res.data;
  },

  signIn: async (email: string, password: string) => {
    const res = await api.post(
      "/login",
      { email, password },
      { withCredentials: true },
    );
    return res.data;
  },

  fetchUserData: async (user_id: string) => {
    const res = await api.get(`/users/${user_id}`, { withCredentials: true });
    return res.data;
  },
};
