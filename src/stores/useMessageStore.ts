import { create } from "zustand";
import { messageService } from "@/services/messageService";
import type { MessageState } from "@/types/store";

export const useMessageStore = create<MessageState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  loading: false,

  fetchConversations: async () => {
    try {
      set({ loading: true });
      const conversations = await messageService.fetchConversations();
      set({ conversations });
    } catch (err) {
      console.log("Failed to fetch conversations", err);
    } finally {
      set({ loading: false });
    }
  },

  setActiveConversation: async (conversationId) => {
    try {
      set({ activeConversationId: conversationId, loading: true });
      const messages = await messageService.fetchMessages(conversationId);
      set({ messages });
    } catch (err) {
      console.log("Failed to fetch messages", err);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (conversationId, content) => {
    try {
      const message = await messageService.sendMessage(conversationId, content);
      if (get().activeConversationId === conversationId) {
        set((state) => ({ messages: [...state.messages, message] }));
      }
    } catch (err) {
      console.log("Failed to send message", err);
    }
  },

  createConversation: async (participantIds) => {
    try {
      const result = await messageService.createConversation(participantIds);
      const conversationId = result.conversation.conversation_id;
      await get().fetchConversations();
      return conversationId;
    } catch (err) {
      console.log("Failed to create conversation", err);
      throw err;
    }
  },
}));
