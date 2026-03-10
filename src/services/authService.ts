import api from "@/lib/ky";
import type { User } from "@/types/user";

interface SignInResponse {
  token: string;
  user: {
    userId: string;
  };
}

export const authService = {
  signUp: async (email: string, username: string, password: string) => {
    await api.post("register", {
      json: { email, username, password },
    });
  },

  signIn: async (email: string, password: string) => {
    return api
      .post("login", {
        json: { email, password },
      })
      .json<SignInResponse>();
  },

  fetchUserData: async (user_id: string) => {
    return api.get(`users/${user_id}`).json<User>();
  },
};
