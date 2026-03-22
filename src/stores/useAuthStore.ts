import { authService } from "@/services/authService";
import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Auth store state — quản lý token, user, và các auth actions */
interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  clearState: () => void;
  setHydrated: (hydrated: boolean) => void;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserData: (user_id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      hydrated: false,

      clearState: () => {
        set({ token: null, user: null, loading: false });
      },

      setHydrated: (hydrated) => {
        set({ hydrated });
      },

      signUp: async (email, username, password) => {
        try {
          set({ loading: true });
          await authService.signUp(email, username, password);
        } catch (err) {
          console.log("Failed to register: ", err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true });
          const { token, user } = await authService.signIn(email, password);
          set({ token, user });
          try {
            await get().fetchUserData(user.user_id);
          } catch (fetchUserError) {
            console.log("Failed to hydrate user after login", fetchUserError);
          }
          console.log("Login successfully !");
        } catch (err) {
          console.log("Failed to login", err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        get().clearState();
      },

      fetchUserData: async (user_id) => {
        try {
          set({ loading: true });
          const user = await authService.fetchUserData(user_id);
          set({ user });
        } catch (err) {
          console.log("Failed to fetch user data", err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
