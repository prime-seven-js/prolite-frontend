import type { User } from "@/types/user";

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;

  signUp: (email: string, username: string, password: string) => Promise<void>;

  signIn: (email: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;

  fetchUserData: (user_id: string) => Promise<void>;
}
