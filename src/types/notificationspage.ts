import type { LucideIcon } from "lucide-react";
import type { FriendRequest, Notification } from "./notification";
import type { UserLookup } from "./user";

export type FilterTabType = "all" | "likes" | "comments" | "requests";

export interface FilterTabObject {
  key: FilterTabType;
  label: string;
  icon: LucideIcon;
  mobileOnly?: boolean;
}

export interface NotificationsHeaderProps {
  unreadCount: number;
  onActiveFilter: (key: FilterTabType) => void;
  filterTab: FilterTabObject[];
  activeFilter: FilterTabType;
  pendingRequests: FriendRequest[];
}

export interface NotificationsContentProps {
  activeFilter: FilterTabType;
  pendingRequests: FriendRequest[];
  loading: boolean;
  filteredNotifications: Notification[];
  userLookup: UserLookup;
}

export interface NotificationItemProps {
  notification: Notification;
  index: number;
  userLookup: Record<string, { username: string; avatar?: string }>;
  pendingRequests: { id: string; users: { user_id: string } }[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}
