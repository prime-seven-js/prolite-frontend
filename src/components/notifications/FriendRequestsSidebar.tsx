import { Check, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { timeAgo } from "@/lib/converttime";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from "@/hooks/useFriends";
import type { FriendRequest } from "@/types/notification";

interface FriendRequestsSidebarProps {
  pendingRequests: FriendRequest[];
}

/**
 * FriendRequestsSidebar — card hiển thị danh sách friend requests trên right sidebar.
 * Mỗi request có 2 nút: Accept / Decline.
 * Ẩn card nếu không có request nào.
 */
const FriendRequestsSidebar = ({
  pendingRequests,
}: FriendRequestsSidebarProps) => {
  const acceptMutation = useAcceptFriendRequest();
  const declineMutation = useDeclineFriendRequest();

  if (pendingRequests.length === 0) return null;

  return (
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
  );
};

export default FriendRequestsSidebar;
