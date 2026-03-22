import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotifications } from "@/hooks/useNotifications";
import { usePendingFriendRequests } from "@/hooks/useFriends";
import { useUserLookup } from "@/hooks/useUserLookup";
import type { NotificationType } from "@/types/notification";
import type { FilterTabObject, FilterTabType } from "@/types/notificationspage";

// Components tách nhỏ
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationsContent from "@/components/notifications/NotificationsContent";
import FriendRequestsSidebar from "@/components/notifications/FriendRequestsSidebar";
import ActivitySummary from "@/components/notifications/ActivitySummary";

/**
 * Trang Notifications của Prolite.
 *
 * Data fetching (TanStack Query):
 * - useNotifications() → danh sách notifications (cache, auto-refetch)
 * - usePendingFriendRequests() → friend requests đang chờ duyệt
 * - useUserLookup() → lookup table user_id → { username, avatar }
 */

/** Tabs lọc notifications theo loại */
const FILTER_TABS: FilterTabObject[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "comments", label: "Comments", icon: MessageSquare },
  { key: "requests", label: "Requests", icon: UserPlus, mobileOnly: true },
];

/** Mapping tab key → notification type (null = hiển thị tất cả) */
const FILTER_TYPE_MAP: Record<FilterTabType, NotificationType | null> = {
  all: null,
  likes: "like",
  comments: "comment",
  requests: null,
};

const NotificationsPage = () => {
  const user = useAuthStore((s) => s.user);

  // Server state — TanStack Query
  const { data: notifications = [], isLoading: loading } = useNotifications();
  const { data: pendingRequests = [] } = usePendingFriendRequests();
  const userLookup = useUserLookup();

  // UI state
  const [activeFilter, setActiveFilter] = useState<FilterTabType>("all");

  // Đếm số notification chưa đọc
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  // Lọc notifications theo tab đang active
  const filteredNotifications = useMemo(() => {
    const type = FILTER_TYPE_MAP[activeFilter];
    return type ? notifications.filter((n) => n.type === type) : notifications;
  }, [activeFilter, notifications]);

  // Tổng hợp số lượng likes/comments
  const summary = useMemo(
    () =>
      notifications.reduce(
        (acc, n) => {
          if (n.type === "like") acc.likes += 1;
          if (n.type === "comment") acc.comments += 1;
          return acc;
        },
        { likes: 0, comments: 0 },
      ),
    [notifications],
  );

  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  // Right sidebar — friend requests + activity summary
  const rightSidebar = (
    <>
      <FriendRequestsSidebar pendingRequests={pendingRequests} />
      <ActivitySummary likes={summary.likes} comments={summary.comments} />
    </>
  );

  return (
    <PageLayout
      username={user.username}
      activePath="/notifications"
      rightSidebar={rightSidebar}
    >
      {/* Page Header + Filter Tabs */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onActiveFilter={setActiveFilter}
        filterTab={FILTER_TABS}
        activeFilter={activeFilter}
        pendingRequests={pendingRequests}
      />

      {/* Content — Friend Requests tab (mobile) hoặc Notification List */}
      <NotificationsContent
        activeFilter={activeFilter}
        pendingRequests={pendingRequests}
        loading={loading}
        filteredNotifications={filteredNotifications}
        userLookup={userLookup}
      />
    </PageLayout>
  );
};

export default NotificationsPage;
