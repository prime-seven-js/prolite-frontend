import { timeAgo } from '@/lib/converttime';
import type { NotificationType } from '@/types/notification';
import type { NotificationItemProps } from '@/types/notificationspage';
import { Heart, MessageSquare, type LucideIcon } from 'lucide-react';
import { InitialAvatar } from '../layout/InitialAvatar';
import { useNavigate } from 'react-router';

const NOTIFICATION_META: Record<
  NotificationType,
  { Icon: LucideIcon; color: string; bg: string; text: string }
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
};


const NotificationsItem = ({ notification, index }: NotificationItemProps) => {
  const meta = NOTIFICATION_META[notification.type] ?? NOTIFICATION_META.like;
  const navigate = useNavigate();

  // Use actor data from the API response
  const displayName = notification.actor?.username ?? "Someone";
  const displayAvatar = notification.actor?.avatar;

  const handleClick = () => {
    // Navigate to the newsfeed — the post will be visible there
    if (notification.post_id) {
      navigate(`/?post=${notification.post_id}`);
    }
  };

  return (
    <div
      className={`w-full text-left border-b border-white/4 px-4 py-4 transition-colors animate-fade-in-up hover:bg-white/1.5 cursor-pointer ${!notification.is_read ? "bg-[#2496d4]/3" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Actor Avatar */}
        <div className="shrink-0 mt-0.5">
          <InitialAvatar
            name={displayName}
            avatarUrl={displayAvatar}
            sizeClassName="w-10 h-10"
            textClassName="text-sm"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex items-center gap-2">
              <div
                className={`shrink-0 w-6 h-6 rounded-full ${meta.bg} flex items-center justify-center`}
              >
                <meta.Icon className={`w-3.5 h-3.5 ${meta.color}`} />
              </div>
              <p className="text-[15px] leading-snug">
                <span className="font-semibold">{displayName}</span>{" "}
                <span className="text-gray-400">{meta.text}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-600">
                {timeAgo(notification.created_at)}
              </span>
              {!notification.is_read && (
                <span className="w-2 h-2 rounded-full bg-[#2496d4] shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsItem