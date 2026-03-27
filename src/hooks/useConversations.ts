import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook fetch danh sách conversations.
 * Backend trả về enriched data: participants[] + last_message.
 */
export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.all,
    queryFn: messageService.fetchConversations,
  });
}

/**
 * Hook fetch messages theo conversationId.
 */
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId ?? ""),
    queryFn: () => messageService.fetchMessages(conversationId!),
    enabled: !!conversationId,
  });
}

/**
 * Mutation gửi tin nhắn — optimistic update vào cache.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => messageService.sendMessage(conversationId, content),
    onSuccess: (_newMessage, { conversationId }) => {
      // Invalidate để refetch (hoặc chờ realtime broadcast append) thay vì tự append (tránh duplicate)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.messages(conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });
}

/**
 * Mutation tạo conversation mới.
 * Backend tự check duplicate — trả về conversation_id cũ nếu đã tồn tại.
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantIds: string[]) => {
      const result = await messageService.createConversation(participantIds);
      return result.conversation.conversation_id as string;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
    },
  });
}
