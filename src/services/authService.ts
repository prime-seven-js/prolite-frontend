import api from "@/lib/axios";
import type { User } from "@/types/user";

type AuthResponseUser = {
  userId: string;
  email: string;
  username: string;
};

type ApiUser = {
  user_id: string;
  email: string;
  username: string;
  avatar?: string | null;
  bio?: string | null;
  created_at?: string;
  createdAt?: string;
};

type LoginResponse = {
  token: string;
  user: AuthResponseUser;
};

const normalizeUser = (user: AuthResponseUser | ApiUser): User => ({
  user_id: "user_id" in user ? user.user_id : user.userId,
  email: user.email,
  username: user.username,
  avatar: "avatar" in user ? (user.avatar ?? undefined) : undefined,
  bio: "bio" in user ? (user.bio ?? undefined) : undefined,
  createdAt:
    "created_at" in user
      ? user.created_at
      : "createdAt" in user
        ? user.createdAt
        : undefined,
});

export const authService = {
  fetchUsers: async () => {
    const res = await api.get<ApiUser[]>("/users");
    return res.data.map(normalizeUser);
  },

  signUp: async (email: string, username: string, password: string) => {
    const res = await api.post("/register", { email, username, password });
    return res.data;
  },

  signIn: async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/login", { email, password });
    return {
      token: res.data.token,
      user: normalizeUser(res.data.user),
    };
  },

  fetchUserData: async (user_id: string) => {
    const res = await api.get<ApiUser>(`/users/${user_id}`);
    return normalizeUser(res.data);
  },
};
