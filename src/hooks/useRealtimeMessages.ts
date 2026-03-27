import { useQueryClient } from "@tanstack/react-query";
import { useRealtimeSubscription } from "./useRealtimeSubscription";
import { queryKeys } from "@/lib/queryKeys";
import type { Message } from "@/types/message";

/**
 * Realtime subscription cho messages.
 *
 * Khi có message mới trong conversation đang active:
 * - Append message vào cuối cache (không refetch toàn bộ)
 * - Invalidate danh sách conversations để cập nhật "last message"
 * Chỉ subscribe khi có conversationId (enabled = !!conversationId).
 */
export function useRealtimeMessages(conversationId: string | null) {
  const queryClient = useQueryClient();

  useRealtimeSubscription<Message>({
    channelName: `messages-${conversationId ?? "none"}`,
    isBroadcast: true,
    broadcastEvent: "NEW_MESSAGE",
    enabled: !!conversationId,
    onReceive: (payload) => {
      // payload từ broadcast channel có cấu trúc: { type: "broadcast", event: "NEW_MESSAGE", payload: { ... } }
      if (conversationId && payload.payload) {
        const newMessage = payload.payload as Message;
        // Append message mới vào cuối danh sách cache
        queryClient.setQueryData<Message[]>(
          queryKeys.conversations.messages(conversationId),
          (old) => (old ? [...old, newMessage] : [newMessage]),
        );
        // Invalidate conversations list để cập nhật preview/last message
        void queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.all,
        });
      }
    },
  });
}
