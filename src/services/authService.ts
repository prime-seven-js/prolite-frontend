import api from "@/lib/axios";
import { supabase } from "@/lib/supabase";
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
  avatar: string | null;
  bio: string | null;
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

/**
 * Auth Service — xử lý authentication và user data.
 * Gồm: đăng ký, đăng nhập, fetch users, fetch user profile.
 */
export const authService = {
  /** Fetch danh sách tất cả users (dùng cho userLookup, search) */
  fetchUsers: async (): Promise<User[]> => {
    const res = await api.get<ApiUser[]>("/users");
    return res.data.map(normalizeUser);
  },

  /** Đăng ký tài khoản mới */
  signUp: async (email: string, username: string, password: string) => {
    const res = await api.post("/register", { email, username, password });
    return res.data;
  },

  /** Đăng nhập → trả về token + user data */
  signIn: async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/login", { email, password });
    return {
      token: res.data.token,
      user: normalizeUser(res.data.user),
    };
  },

  /** Fetch profile data của một user theo ID */
  fetchUserData: async (user_id: string) => {
    const res = await api.get<ApiUser>(`/users/${user_id}`);
    return normalizeUser(res.data);
  },

  /** Cập nhật profile (bio, avatar) của current user */
  updateProfile: async (data: { bio?: string; avatar?: string }) => {
    const res = await api.put<ApiUser>("/protected/users/me", data);
    return normalizeUser(res.data);
  },

  /**
   * Đăng ký trên Supabase Auth để gửi email xác minh.
   * Gọi sau khi backend /register thành công.
   */
  signUpWithSupabase: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });
    if (error) throw error;
  },

  /**
   * Kiểm tra email đã xác minh trên Supabase chưa.
   * Dùng khi login — nếu chưa verify thì không cho đăng nhập.
   */
  checkEmailVerified: async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return false;
    const verified = !!data.user?.email_confirmed_at;
    // Sign out khỏi Supabase session (chỉ dùng để check, không dùng cho auth chính)
    await supabase.auth.signOut();
    return verified;
  },

  /**
   * Gửi lại email xác minh.
   * Dùng trên trang VerifyEmailPage khi user muốn gửi lại.
   */
  resendVerificationEmail: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });
    if (error) throw error;
  },
};
