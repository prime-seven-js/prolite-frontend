/**
 * Tập trung tất cả query key constants.
 * Mỗi key là một mảng duy nhất để TanStack Query có thể invalidate chính xác.
 * Convention: dùng tuple [domain, ...params] để dễ quản lý invalidation.
 */
export const queryKeys = {
  /** Danh sách tất cả users (dùng cho userLookup) */
  users: {
    all: ["users"] as const,
  },

  /** Posts: danh sách, likes, comments */
  posts: {
    all: ["posts"] as const,
    likes: (postId: string) => ["posts", postId, "likes"] as const,
    comments: (postId: string) => ["posts", postId, "comments"] as const,
  },

  /** Notifications */
  notifications: {
    all: ["notifications"] as const,
  },

  /** Friends: pending requests + danh sách bạn bè */
  friends: {
    pending: ["friends", "pending"] as const,
    list: ["friends", "list"] as const,
  },

  /** Conversations + messages */
  conversations: {
    all: ["conversations"] as const,
    messages: (conversationId: string) =>
      ["conversations", conversationId, "messages"] as const,
  },

  /** Profile chi tiết theo userId */
  profile: {
    detail: (userId: string) => ["profile", userId] as const,
  },
} as const;
