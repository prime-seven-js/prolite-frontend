import { useQueryClient } from "@tanstack/react-query";
import { useRealtimeSubscription } from "./useRealtimeSubscription";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Realtime subscription cho bảng conversations + messages.
 *
 * Khi có conversation mới hoặc message mới (ở bất kỳ conversation nào):
 * - Invalidate danh sách conversations để cập nhật UI
 * - ConversationList sẽ tự re-render với data mới nhất
 *
 * Dùng kết hợp với useRealtimeMessages (subscribe message chi tiết cho
 * conversation đang active).
 */
export function useRealtimeConversations() {
  const queryClient = useQueryClient();

  // Subscribe INSERT trên bảng messages — cập nhật lastMessage trên ConversationList
  useRealtimeSubscription({
    channelName: "conversations-messages-realtime",
    table: "messages",
    event: "INSERT",
    onReceive: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });

  // Subscribe INSERT trên bảng conversation_participants — conversation mới
  useRealtimeSubscription({
    channelName: "conversations-participants-realtime",
    table: "conversation_participants",
    event: "INSERT",
    onReceive: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });
}
