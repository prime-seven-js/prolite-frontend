import api from "@/lib/axios";
import type { Conversation, Message } from "@/types/message";

export const messageService = {
  fetchConversations: async (): Promise<Conversation[]> => {
    const res = await api.get<Conversation[]>("/protected/conversations");
    return res.data;
  },

  createConversation: async (participantIds: string[], isGroup = false) => {
    const res = await api.post("/protected/conversations", {
      participantIds,
      isGroup,
    });
    return res.data;
  },

  fetchMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await api.get<Message[]>(
      `/protected/conversations/${conversationId}/messages`,
    );
    return res.data;
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const res = await api.post<Message>(
      `/protected/conversations/${conversationId}/messages`,
      { content },
    );
    return res.data;
  },

  markMessageRead: async (messageId: string): Promise<void> => {
    await api.put(`/protected/messages/${messageId}/read`);
  },
};
