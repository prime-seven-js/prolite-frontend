export interface User {
  user_id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export type UserLookup = Record<string, { username: string; avatar?: string }>;
