import {
  Bell,
  Heart,
  UserPlus,
  MessageSquare,
  Star,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useNotifications,
} from "@/hooks/useNotifications";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  usePendingFriendRequests,
} from "@/hooks/useFriends";
import { useUserLookup } from "@/hooks/useUserLookup";
import { timeAgo } from "@/lib/converttime";
import type { NotificationType } from "@/types/notification";
import type { FilterTabObject, FilterTabType } from "@/types/notificationspage";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationsContent from "@/components/notifications/NotificationsContent";

/**
 * Trang Notifications của Prolite.
 * Lib:
 * - timeAgo (postImages): Now - CreatedAt.
 * Global State:
 * - useAuthStore() → Lưu trữ toàn bộ State liên quan đến Auth.
 * React Hooks:
 * - useMemo() → Cache data chỉ thay đổi khi dependencies thay đổi.
 * Queries:
 * - useNotifications() → Fetch danh sách notifications.
 * - usePendingFriendRequests() → Fetch danh sách friend requests đang chờ duyệt.
 * Mutations:
 * - useMarkAllNotificationsRead() → Đánh dấu đã đọc tất cả noti.
 * - useAcceptFriendRequest() → Chấp nhận friend request.
 * - useDeclineFriendRequest() → từ chối friend request.
 * - useUserLookup() → Tạo lookup table: user_id → { username, avatar }.
 */

/** Mapping notification type → icon, color, và text hiển thị */
/** Tabs lọc notifications theo loại */

const FILTER_TABS: FilterTabObject[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "comments", label: "Comments", icon: MessageSquare },
  { key: "requests", label: "Requests", icon: UserPlus, mobileOnly: true },
];
const FILTER_TYPE_MAP: Record<FilterTabType, NotificationType | null> = {
  all: null,
  likes: "like",
  comments: "comment",
  requests: null,
};

const NotificationsPage = () => {
  // Auth State
  const user = useAuthStore((s) => s.user);

  // Tự động fetch, cache
  const { data: notifications = [], isLoading: loading } = useNotifications();
  const { data: pendingRequests = [] } = usePendingFriendRequests();
  const acceptMutation = useAcceptFriendRequest();
  const declineMutation = useDeclineFriendRequest();

  // UI state
  const [activeFilter, setActiveFilter] = useState<FilterTabType>("all");

  // Build user lookup table từ TanStack Query data
  const userLookup = useUserLookup();

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
        { likes: 0, comments: 0, requests: 0 },
      ),
    [notifications],
  );

  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  const onActiveFilter = (key: FilterTabType) => {
    setActiveFilter(key);
  }

  // Right sidebar: friend requests + activity summary
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
                    <p className="text-xs text-gray-500">
                      {timeAgo(req.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => acceptMutation.mutate(req.id)}
                      className="rounded-full w-7 h-7 bg-[#2496d4]/15 text-[#63d4f7] hover:bg-[#2496d4]/25"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => declineMutation.mutate(req.id)}
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
            <SummaryRow
              icon={Heart}
              iconColor="text-pink-500"
              label="Likes received"
              value={summary.likes}
            />
            <SummaryRow
              icon={MessageSquare}
              iconColor="text-[#63d4f7]"
              label="Comments"
              value={summary.comments}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <PageLayout
      username={user.username}
      activePath="/notifications"
      rightSidebar={rightSidebar}
    >
      {/* Page Header */}
      <NotificationsHeader unreadCount={unreadCount} onActiveFilter={(key: FilterTabType) => onActiveFilter(key)} filterTab={FILTER_TABS} activeFilter={activeFilter} pendingRequests={pendingRequests} />

      {/* Content — Friend Requests tab (mobile) hoặc Notification List */}
      <NotificationsContent activeFilter={activeFilter} pendingRequests={pendingRequests} loading={loading} filteredNotifications={filteredNotifications} userLookup={userLookup} />
    </PageLayout>
  );
};

export default NotificationsPage;

/** Dòng tổng hợp activity (likes/comments count) */
function SummaryRow({
  icon: Icon,
  iconColor,
  label,
  value,
}: {
  icon: typeof Heart;
  iconColor: string;
  label: string;
  value: number;
}) {
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

