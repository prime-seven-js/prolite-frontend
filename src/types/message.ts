/** Participant trong một conversation */
export interface ConversationParticipant {
  user_id: string;
  username: string;
  avatar?: string;
}

/** Last message preview cho ConversationList */
export interface LastMessage {
  content: string;
  sender_id: string;
  created_at: string;
}

export interface Conversation {
  conversation_id: string;
  conversations: {
    is_group: boolean;
    created_at: string;
  };
  /** Danh sách participants — populated từ API hoặc enriched client-side */
  participants?: ConversationParticipant[];
  /** Tin nhắn cuối cùng — dùng hiển thị preview trên ConversationList */
  last_message?: LastMessage;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  users?: {
    username: string;
    avatar?: string;
  };
}
