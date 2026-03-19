export interface Conversation {
  conversation_id: string;
  conversations: {
    is_group: boolean;
    created_at: string;
  };
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
