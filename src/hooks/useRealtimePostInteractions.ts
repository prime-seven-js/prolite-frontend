import { useRealtimeSubscription } from "./useRealtimeSubscription";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Realtime subscription cho post likes và comments.
 * Lắng nghe 2 bảng: `post_likes` và `post_comments` với filter theo postId.
 * Khi có thay đổi → invalidate cache likes/comments tương ứng.
 * Chỉ subscribe khi đang xem chi tiết post (truyền postId).
 */
export function useRealtimePostInteractions(postId: string) {
  // Lắng nghe likes thay đổi
  useRealtimeSubscription({
    channelName: `post-likes-${postId}`,
    table: "post_likes",
    event: "*",
    filter: `post_id=eq.${postId}`,
    queryKeys: [queryKeys.posts.likes(postId)],
  });

  // Lắng nghe comments thay đổi (bảng "comments" trong Supabase)
  useRealtimeSubscription({
    channelName: `post-comments-${postId}`,
    table: "comments",
    event: "*",
    filter: `post_id=eq.${postId}`,
    queryKeys: [queryKeys.posts.comments(postId)],
  });
}
