import api from "@/lib/axios";
import { aiService } from "./aiService";
import type { Conversation, Message } from "@/types/message";

/** Raw shape từ backend cũ GET /protected/conversations */
interface RawConversation {
  conversation_id: string;
  conversations: {
    is_group: boolean;
    created_at: string;
  };
  /** Có thể có nếu backend mới trả về */
  participants?: { user_id: string; username: string; avatar?: string }[];
  last_message?: { content: string; sender_id: string; created_at: string } | null;
}

/**
 * Message Service — xử lý conversations và messages.
 */
export const messageService = {
  /** Fetch danh sách conversations */
  fetchConversations: async (): Promise<Conversation[]> => {
    const res = await api.get<RawConversation[]>("/protected/conversations");
    // Normalize: đảm bảo participants luôn là array
    return res.data.map((raw) => ({
      ...raw,
      participants: raw.participants ?? [],
      last_message: raw.last_message ?? null,
    }));
  },

  /** Tạo conversation mới */
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

  /** Gửi tin nhắn mới vào conversation (tự động rewrite bằng AI) */
  sendMessage: async (
    conversationId: string,
    content: string,
  ): Promise<Message> => {
    // 1. Rewrite content bằng AI
    const aiContent = (await aiService.rewriteWithAI(content)).data;
    
    // 2. Gửi message đã được AI sửa
    const res = await api.post<Message>(
      `/protected/conversations/${conversationId}/messages`,
      { content: aiContent },
    );
    return res.data;
  },

  /** Đánh dấu message là đã đọc */
  markMessageRead: async (messageId: string): Promise<void> => {
    await api.put(`/protected/messages/${messageId}/read`);
  },
};
