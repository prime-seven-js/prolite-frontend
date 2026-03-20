import { useMemo, useState } from "react";
import {
  Bell,
  Heart,
  UserPlus,
  MessageSquare,
  CheckCheck,
  Settings,
  Star,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";

import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useGlobalStore } from "@/stores/useGlobalStore";
// Custom Hooks
import { useUserLookup } from "@/hooks/useUserLookup";
import { useInitData } from "@/hooks/useInitData";
import { timeAgo } from "@/lib/converttime";

import type { Notification, NotificationType } from "@/types/notification";
import { useFriendStore } from "@/stores/useFriendStore";

// ── Helpers ──────────────────────────────────────────────────
const NOTIFICATION_META: Record<
  NotificationType,
  { Icon: typeof Heart; color: string; bg: string; text: string }
> = {
  like: {
    Icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    text: "liked your post",
  },
  comment: {
    Icon: MessageSquare,
    color: "text-[#63d4f7]",
    bg: "bg-[#63d4f7]/10",
    text: "commented on your post",
  },
  friend_request: {
    Icon: UserPlus,
    color: "text-[#2496d4]",
    bg: "bg-[#2496d4]/10",
    text: "sent you a friend request",
  },
};

// ── Filters ──────────────────────────────────────────────────
type FilterTab = "all" | "likes" | "comments" | "requests";

const FILTER_TABS: { key: FilterTab; label: string; icon: typeof Heart }[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "comments", label: "Comments", icon: MessageSquare },
  { key: "requests", label: "Requests", icon: UserPlus },
];

const FILTER_TYPE_MAP: Record<FilterTab, NotificationType | null> = {
  all: null,
  likes: "like",
  comments: "comment",
  requests: "friend_request",
};

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════════════
const NotificationsPage = () => {
  const user = useAuthStore((s) => s.user);
  const fetchAllUsersData = useGlobalStore((s) => s.fetchAllUsersData);
  const notifications = useNotificationStore((s) => s.notifications);
  const pendingRequests = useFriendStore((s) => s.pendingRequests);
  const loading = useNotificationStore((s) => s.loading);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const fetchPendingRequests = useFriendStore((s) => s.fetchPendingRequests);
  const acceptFriendRequest = useFriendStore((s) => s.acceptFriendRequest);
  const declineFriendRequest = useFriendStore((s) => s.declineFriendRequest);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  // Build user lookup
  const userLookup = useUserLookup();

  // Fetch data on mount
  useInitData(fetchNotifications, fetchPendingRequests, fetchAllUsersData);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const type = FILTER_TYPE_MAP[activeFilter];
    return type ? notifications.filter((n) => n.type === type) : notifications;
  }, [activeFilter, notifications]);

  const summary = useMemo(
    () =>
      notifications.reduce(
        (acc, n) => {
          if (n.type === "like") acc.likes += 1;
          if (n.type === "comment") acc.comments += 1;
          if (n.type === "friend_request") acc.requests += 1;
          return acc;
        },
        { likes: 0, comments: 0, requests: 0 },
      ),
    [notifications],
  );

  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  const rightSidebar = (
    <>
      {/* Pending Friend Requests Card */}
      {pendingRequests.length > 0 && (
        <Card className="glass-card border-0 rounded-2xl py-0">
          <CardHeader className="p-5 pb-0">
            <CardTitle className="font-bold text-[15px] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#2496d4]" />
              Friend Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-4">
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-3">
                  <InitialAvatar
                    name={req.users.username}
                    sizeClassName="w-9 h-9"
                    textClassName="text-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {req.users.username}
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo(req.created_at)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => acceptFriendRequest(req.id)}
                      className="rounded-full w-7 h-7 bg-[#2496d4]/15 text-[#63d4f7] hover:bg-[#2496d4]/25"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => declineFriendRequest(req.id)}
                      className="rounded-full w-7 h-7 bg-white/5 text-gray-500 hover:bg-red-500/15 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Summary */}
      <Card className="glass-card border-0 rounded-2xl py-0">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="font-bold text-[15px] flex items-center gap-2">
            <Star className="w-4 h-4 text-[#63d4f7]" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4">
          <div className="space-y-3">
            <SummaryRow icon={Heart} iconColor="text-pink-500" label="Likes received" value={summary.likes} />
            <SummaryRow icon={UserPlus} iconColor="text-[#2496d4]" label="Friend requests" value={summary.requests} />
            <SummaryRow icon={MessageSquare} iconColor="text-[#63d4f7]" label="Comments" value={summary.comments} />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card border-0 rounded-2xl py-0">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="font-bold text-[15px] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#63d4f7]" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4">
          <div className="space-y-3">
            <ToggleSetting label="Push notifications" defaultOn={true} />
            <ToggleSetting label="Like notifications" defaultOn={true} />
            <ToggleSetting label="Comment notifications" defaultOn={true} />
            <ToggleSetting label="Friend request notifications" defaultOn={true} />
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <PageLayout username={user.username} activePath="/notifications" rightSidebar={rightSidebar}>
      {/* Page Header */}
      <div className="sticky top-14 z-40 glass-header">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h1 className="text-xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void markAllRead()}
                className="gap-1.5 rounded-full text-xs font-medium text-[#63d4f7] hover:bg-[#2496d4]/10"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-white/6 text-gray-400 hover:text-gray-200">
              <Settings className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex px-2 gap-1 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(tab.key)}
              className={`gap-1.5 h-auto px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-none border-b-2 ${
                activeFilter === tab.key
                  ? "text-[#63d4f7] border-[#2496d4]"
                  : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-700"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-[#2496d4] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Bell className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No notifications</p>
            <p className="text-sm">
              {activeFilter === "all"
                ? "You're all caught up!"
                : `No ${activeFilter} notifications yet.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif, i) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              index={i}
              userLookup={userLookup}
              pendingRequests={pendingRequests}
              onAccept={acceptFriendRequest}
              onDecline={declineFriendRequest}
            />
          ))
        )}
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;

// ── Helper Components ────────────────────────────────────────

function SummaryRow({ icon: Icon, iconColor, label, value }: { icon: typeof Heart; iconColor: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  index: number;
  userLookup: Record<string, { username: string; avatar?: string }>;
  pendingRequests: { id: string; users: { user_id: string } }[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function NotificationItem({
  notification,
  index,
  userLookup,
  pendingRequests,
  onAccept,
  onDecline,
}: NotificationItemProps) {
  const meta = NOTIFICATION_META[notification.type] ?? NOTIFICATION_META.like;

  // For notifications, reference_id could be the post_id, comment_id, or friendship_id
  // The 'user_id' on the notification is the RECIPIENT. We need to figure out who triggered it.
  // Since we don't have a 'from_user_id' field, we'll use reference_id to look up context.
  // For friend_request type, reference_id is the friendship id.
  // For like/comment, reference_id is the post_id.
  
  // Try to find the username from pending requests for friend_request type
  let fromUsername = "Someone";
  if (notification.type === "friend_request") {
    const req = pendingRequests.find((r) => r.id === notification.reference_id);
    if (req) {
      fromUsername = userLookup[req.users.user_id]?.username ?? req.users.user_id;
    }
  }

  // For other types, we don't have direct from_user info in notification schema,
  // so we show a generic message.
  const displayText = notification.type === "friend_request" && fromUsername !== "Someone"
    ? fromUsername
    : notification.type === "friend_request"
      ? "Someone"
      : "Someone";

  return (
    <div
      className={`w-full text-left border-b border-white/4 px-4 py-4 transition-colors animate-fade-in-up hover:bg-white/1.5 ${!notification.is_read ? "bg-[#2496d4]/3" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex gap-3">
        <div className={`shrink-0 mt-0.5 w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center`}>
          <meta.Icon className={`w-5 h-5 ${meta.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[15px] leading-snug">
                <span className="font-semibold">{displayText}</span>{" "}
                <span className="text-gray-400">{meta.text}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-600">{timeAgo(notification.created_at)}</span>
              {!notification.is_read && <span className="w-2 h-2 rounded-full bg-[#2496d4] shrink-0" />}
            </div>
          </div>

          {/* Accept/Decline for friend requests */}
          {notification.type === "friend_request" && (() => {
            const req = pendingRequests.find((r) => r.id === notification.reference_id);
            if (!req) return null;
            return (
              <div className="flex gap-2 mt-2.5">
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onAccept(req.id); }}
                  className="rounded-full text-xs font-semibold btn-gradient gap-1.5 px-4"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onDecline(req.id); }}
                  className="rounded-full text-xs font-semibold border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 bg-transparent"
                >
                  <X className="w-3.5 h-3.5" />
                  Decline
                </Button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5.5 rounded-full transition-colors relative ${on ? "bg-[#2496d4]" : "bg-gray-700"}`}
      >
        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}
