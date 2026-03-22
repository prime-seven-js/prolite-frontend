import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/message";

/**
 * Message Service — xử lý conversations và messages.
 * Gồm: fetch/create conversations, fetch/send messages, mark read.
 */
export const messageService = {
  /** Fetch danh sách conversations của user hiện tại */
  fetchConversations: async (): Promise<Conversation[]> => {
    const res = await api.get<Conversation[]>("/protected/conversations");
    return res.data;
  },

  /** Tạo conversation mới với danh sách participants */
  createConversation: async (participantIds: string[], isGroup = false) => {
    const res = await api.post("/protected/conversations", {
      participantIds,
      isGroup,
    });
    return res.data;
  },

  /** Fetch tất cả messages trong một conversation */
  fetchMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await api.get<Message[]>(
      `/protected/conversations/${conversationId}/messages`,
    );
    return res.data;
  },

  /** Gửi tin nhắn mới vào conversation */
  sendMessage: async (
    conversationId: string,
    content: string,
  ): Promise<Message> => {
    const res = await api.post<Message>(
      `/protected/conversations/${conversationId}/messages`,
      { content },
    );
    return res.data;
  },

  /** Đánh dấu message là đã đọc */
  markMessageRead: async (messageId: string): Promise<void> => {
    await api.put(`/protected/messages/${messageId}/read`);
  },
};
