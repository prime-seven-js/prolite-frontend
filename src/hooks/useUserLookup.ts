import { useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAllUsers } from "@/hooks/useAllUsers";
import type { UserLookup } from "@/types/user";

/**
 * Custom hook tạo lookup table: user_id → { username, avatar }.
 * Kết hợp data từ useAllUsers query + current user từ auth store.
 * Sử dụng ở mọi nơi cần resolve username/avatar từ user_id.
 */
export function useUserLookup(): UserLookup {
  const user = useAuthStore((s) => s.user);
  const { data: usersData = [] } = useAllUsers();

  return useMemo<UserLookup>(() => {
    const lookup: UserLookup = {};
    for (const u of usersData) {
      lookup[u.user_id] = { username: u.username, avatar: u.avatar };
    }
    // Đảm bảo current user luôn có trong lookup
    if (user) {
      lookup[user.user_id] = { username: user.username, avatar: user.avatar };
    }
    return lookup;
  }, [user, usersData]);
}
