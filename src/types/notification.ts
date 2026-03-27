export type NotificationType = "like" | "comment";

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  post_id: string;
  type: NotificationType;
  reference_id: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    username: string;
    avatar?: string;
  };
}

export interface SentFriendRequest {
  id: string;
  created_at: string;
  users: {
    user_id: string;
    username: string;
    avatar?: string;
  };
}

export interface FriendRequest {
  id: string; // friendship id
  created_at: string;
  users: {
    user_id: string;
    username: string;
    avatar?: string;
  };
}

export interface Friend {
  friendship_id: string;
  friend_since: string;
  user_id: string;
  username: string;
  avatar: string;
}
