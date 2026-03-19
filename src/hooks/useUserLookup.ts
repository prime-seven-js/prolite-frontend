import { useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useGlobalStore } from "@/stores/useGlobalStore";
import type { UserLookup } from "@/types/user";

// Custom hook gom logic build userLookup (mapping user_id → {username, avatar})
// Thay thế block useMemo đang lặp ở NewFeedsPage, MessagesPage, NotificationsPage
export function useUserLookup(): UserLookup {
  const user = useAuthStore((s) => s.user);
  const usersData = useGlobalStore((s) => s.usersData);

  return useMemo<UserLookup>(() => {
    const lookup: UserLookup = {};
    for (const u of usersData) {
      lookup[u.user_id] = { username: u.username, avatar: u.avatar };
    }
    if (user) {
      lookup[user.user_id] = { username: user.username, avatar: user.avatar };
    }
    return lookup;
  }, [user, usersData]);
}
