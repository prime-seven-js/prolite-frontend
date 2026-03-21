import { useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { Button } from '../ui/button'
import { CheckCheck, Settings } from 'lucide-react'
import type { NotificationsHeaderProps } from '@/types/notificationspage';

const NotificationsHeader = ({ unreadCount, onActiveFilter, filterTab, activeFilter, pendingRequests }: NotificationsHeaderProps) => {
    const markAllReadMutation = useMarkAllNotificationsRead();

    return (
        <div className="sticky top-14 z-40 glass-header">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <h1 className="text-xl font-bold">Notifications</h1>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAllReadMutation.mutate()}
                            className="gap-1.5 rounded-full text-xs font-medium text-[#63d4f7] hover:bg-[#2496d4]/10"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full hover:bg-white/6 text-gray-400 hover:text-gray-200"
                    >
                        <Settings className="w-4.5 h-4.5" />
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex px-2 gap-1 overflow-x-auto no-scrollbar">
                {filterTab.map((tab) => (
                    <Button
                        key={tab.key}
                        variant="ghost"
                        size="sm"
                        onClick={() => onActiveFilter(tab.key)}
                        className={`gap-1.5 h-auto px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-none border-b-2 ${tab.mobileOnly ? "md:hidden " : ""
                            }${activeFilter === tab.key
                                ? "text-[#63d4f7] border-[#2496d4]"
                                : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-700"
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                        {tab.key === "requests" && pendingRequests.length > 0 && (
                            <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#2496d4] text-white leading-none">
                                {pendingRequests.length}
                            </span>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default NotificationsHeader