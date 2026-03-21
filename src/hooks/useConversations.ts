import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";
import { queryKeys } from "@/lib/queryKeys";
import type { Message } from "@/types/message";

/**
 * Hook fetch danh sách conversations.
 */
export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.all,
    queryFn: messageService.fetchConversations,
  });
}

/**
 * Hook fetch messages theo conversationId.
 * Chỉ fetch khi conversationId khác null (enabled option).
 */
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId ?? ""),
    queryFn: () => messageService.fetchMessages(conversationId!),
    // Chỉ enable khi có conversationId, tránh fetch với id rỗng
    enabled: !!conversationId,
  });
}

/**
 * Mutation gửi tin nhắn mới.
 * Optimistic update: thêm message vào cache ngay lập tức.
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
    onSuccess: (newMessage, { conversationId }) => {
      // Append message mới vào cache thay vì refetch toàn bộ
      queryClient.setQueryData<Message[]>(
        queryKeys.conversations.messages(conversationId),
        (old) => (old ? [...old, newMessage] : [newMessage]),
      );
    },
  });
}

/**
 * Mutation tạo conversation mới.
 * Sau khi thành công, invalidate danh sách conversations để refetch.
 * Trả về conversationId để caller có thể navigate đến conversation mới.
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
