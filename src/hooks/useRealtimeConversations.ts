import { useQueryClient } from "@tanstack/react-query";
import { useRealtimeSubscription } from "./useRealtimeSubscription";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Realtime subscription cho bảng conversations + messages.
 * Subscribe INSERT của messages và conversation_members để cập nhật UI.
 */
export function useRealtimeConversations() {
  const queryClient = useQueryClient();
  // Subscribe broadcast "NEW_MESSAGE" (khi có tin nhắn mới trong bất kỳ conversation nào)
  useRealtimeSubscription({
    channelName: "conversations-realtime",
    isBroadcast: true,
    broadcastEvent: "NEW_MESSAGE",
    onReceive: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });

  // Subscribe broadcast "NEW_CONVERSATION" (khi có conversation mới được tạo)
  useRealtimeSubscription({
    channelName: "conversations-realtime",
    isBroadcast: true,
    broadcastEvent: "NEW_CONVERSATION",
    onReceive: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });
}
