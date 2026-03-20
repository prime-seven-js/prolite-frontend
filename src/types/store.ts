import type { User } from "@/types/user";
import type { Post } from "@/types/post";
import type { Conversation, Message } from "@/types/message";
import type { Notification, FriendRequest, Friend } from "@/types/notification";

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  hydrated: boolean;

  clearState: () => void;
  setHydrated: (hydrated: boolean) => void;

  signUp: (email: string, username: string, password: string) => Promise<void>;

  signIn: (email: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;

  fetchUserData: (user_id: string) => Promise<void>;
}

export interface GlobalState {
  usersData: User[];
  loading: boolean;

  fetchAllUsersData: () => Promise<void>;
}

export interface PostState {
  postsData: Post[];
  deletePostLoading: boolean;

  fetchAllPostsData: () => Promise<void>;

  newPost: (
    content: string,
    user: User,
    image_urls?: string[],
  ) => Promise<void>;

  deletePost: (post_id: string) => Promise<void>;
}

export interface MessageState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  loading: boolean;

  fetchConversations: () => Promise<void>;
  setActiveConversation: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  createConversation: (participantIds: string[]) => Promise<string>;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;

  fetchNotifications: () => Promise<void>;
  markAllRead: () => Promise<void>;
}

export interface FriendState {
  pendingRequests: FriendRequest[];
  userFriendData: Friend[];
  loading: boolean;

  fetchPendingRequests: () => Promise<void>;
  acceptFriendRequest: (friendshipId: string) => Promise<void>;
  declineFriendRequest: (friendshipId: string) => Promise<void>;
  fetchUserFriendData: () => Promise<void>
}
