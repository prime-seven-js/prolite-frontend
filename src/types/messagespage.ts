import type { ReactNode } from "react";
import type { Message, Conversation } from "./message";
import type { User, UserLookup } from "./user";

/** Props cho ConversationList — sidebar trái */
export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showNewChat: boolean;
  onToggleNewChat: () => void;
  newChatPanel: ReactNode;
}

/** Props cho ConversationListHeader — header + search */
export interface ConversationListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showNewChat: boolean;
  onToggleNewChat: () => void;
}

/** Props cho NewChatPanel — danh sách users có thể chat */
export interface NewChatPanelProps {
  users: User[];
  onStartConversation: (userId: string) => void;
}

/** Props cho MessageThread — thread chat chính */
export interface MessageThreadProps {
  messages: Message[];
  loading: boolean;
  currentUser: User;
  userLookup: UserLookup;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
}

/** Props cho MessageBubble — một tin nhắn */
export interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  senderName: string;
}

/** Props cho MessageInput — ô nhập + gửi tin nhắn */
export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

/** Props cho EmptyConversation — placeholder */
export interface EmptyConversationProps {
  onStartNewChat: () => void;
}
