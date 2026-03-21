import { useRealtimeSubscription } from "./useRealtimeSubscription";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Realtime subscription cho post posts.
 * Lắng nghe 1 bảng: posts.
 */
export function useRealtimePost() {
  useRealtimeSubscription({
    channelName: `posts`,
    table: "posts",
    event: "*",
    queryKeys: [queryKeys.posts.all],
  });
}
