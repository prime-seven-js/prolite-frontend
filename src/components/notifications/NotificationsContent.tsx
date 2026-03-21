import { Bell, Check, UserPlus, X } from 'lucide-react'
import { InitialAvatar } from '../layout/InitialAvatar'
import { timeAgo } from '@/lib/converttime'
import { Button } from '../ui/button'
import NotificationsItem from './NotificationsItem'
import { useAcceptFriendRequest, useDeclineFriendRequest } from '@/hooks/useFriends'
import type { NotificationsContentProps } from '@/types/notificationspage'

const NotificationsContent = ({ activeFilter, pendingRequests, loading, filteredNotifications, userLookup }: NotificationsContentProps) => {
    const acceptMutation = useAcceptFriendRequest();
    const declineMutation = useDeclineFriendRequest();

    return (
        <div className="no-scrollbar">
            {activeFilter === "requests" ? (
                /* Friend Requests list — chỉ hiển thị trên mobile */
                pendingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <UserPlus className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-lg font-medium mb-1">No friend requests</p>
                        <p className="text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    pendingRequests.map((req, i) => (
                        <div
                            key={req.id}
                            className="flex items-center gap-3 px-4 py-4 border-b border-white/4 hover:bg-white/1.5 transition-colors animate-fade-in-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <InitialAvatar
                                name={req.users.username}
                                sizeClassName="w-10 h-10"
                                textClassName="text-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold truncate">
                                    {req.users.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {timeAgo(req.created_at)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => acceptMutation.mutate(req.id)}
                                    className="rounded-full px-3 h-8 bg-[#2496d4]/15 text-[#63d4f7] hover:bg-[#2496d4]/25 text-xs font-medium gap-1.5"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Accept
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => declineMutation.mutate(req.id)}
                                    className="rounded-full px-3 h-8 bg-white/5 text-gray-500 hover:bg-red-500/15 hover:text-red-400 text-xs font-medium gap-1.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Decline
                                </Button>
                            </div>
                        </div>
                    ))
                )
            ) : loading ? (
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
                    <NotificationsItem
                        key={notif.id}
                        notification={notif}
                        index={i}
                        userLookup={userLookup}
                        pendingRequests={pendingRequests}
                        onAccept={(id) => acceptMutation.mutate(id)}
                        onDecline={(id) => declineMutation.mutate(id)}
                    />
                ))
            )}
        </div>
    )
}

export default NotificationsContent