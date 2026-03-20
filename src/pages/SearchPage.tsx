// Icons
import { Search, UserPlus, Users } from "lucide-react";
// Shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Components
import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
// Global states
import { useAuthStore } from "@/stores/useAuthStore";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { friendService } from "@/services/friendService";
// React & React-router Hooks
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
// Custom Hooks
import { useInitData } from "@/hooks/useInitData";
import { useFriendStore } from "@/stores/useFriendStore";

const SearchPage = () => {
  // Current authenticated user
  const user = useAuthStore((s) => s.user);
  const usersData = useGlobalStore((s) => s.usersData);
  const fetchAllUsersData = useGlobalStore((s) => s.fetchAllUsersData);
  const fetchUserFriendData = useFriendStore((s) => (s.fetchUserFriendData))
  const userFriendData = useFriendStore((s) => (s.userFriendData))

  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Highlight a user from query params: ?user=ID
  const highlightedUserId = searchParams.get("user");
  useInitData(fetchAllUsersData, fetchUserFriendData);

  // Auto-fill search input when navigated with ?user=ID
  useEffect(() => {
    if (highlightedUserId) {
      const found = usersData.find((u) => u.user_id === highlightedUserId);
      if (found) {
        setQuery(found.username);
      }
    }
  }, [highlightedUserId, usersData]);

  // Exclude current user and filter by username
  const filteredUsers = useMemo(() => {
    if (!user) return [];
    const others = usersData.filter((u) => u.user_id !== user.user_id);
    if (!query.trim()) return others;
    return others.filter((u) =>
      u.username.toLowerCase().includes(query.toLowerCase()),
    );
  }, [usersData, user, query]);
  const displayedUsers = useMemo(() => {
    const shuffled = [...filteredUsers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [filteredUsers]);

  const handleSendFriendRequest = async (userId: string) => {
    try {
      setSendingTo(userId);
      await friendService.sendRequest(userId);
      setSentRequests((prev) => new Set(prev).add(userId));
    } catch (err) {
      console.log("Failed to send friend request", err);
    } finally {
      setSendingTo(null);
    }
  };

  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  const rightSidebar = (
    <Card className="glass-card border-0 rounded-2xl py-0">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-bold text-[15px] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#63d4f7]" />
          Search Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Search by username to find people</p>
          <p>• Click "Add Friend" to connect</p>
          <p>• View profiles to learn more</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout username={user.username} activePath="/search" rightSidebar={rightSidebar}>
      {/* Search header */}
      <div className="sticky top-14 z-40 glass-header px-4 pt-4 pb-4">
        <h1 className="text-xl font-bold mb-3">Discover People</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/6 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/40 transition-colors"
          />
        </div>
      </div>

      {/* Search results */}
      <div className="no-scrollbar">
        {displayedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No users found</p>
            <p className="text-sm">
              {query ? `No results for "${query}"` : "Start typing to search"}
            </p>
          </div>
        ) : (
          displayedUsers.map((u, i) => {
            const isHighlighted = u.user_id === highlightedUserId;
            const hasSent = sentRequests.has(u.user_id);
            const isSending = sendingTo === u.user_id;
            const isFriend = userFriendData.some((friend) => friend.user_id === u.user_id);

            return (
              <div
                key={u.user_id}
                className={`border-b border-white/4 px-4 py-4 transition-colors animate-fade-in-up hover:bg-white/1.5 ${isHighlighted ? "bg-[#2496d4]/5" : ""
                  }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3 hover:cursor-pointer">
                  <div className="hover:cursor-pointer" onClick={() => navigate(`/profile/${u.user_id}`)}>
                    <InitialAvatar
                      name={u.username}
                      avatarUrl={u.avatar}
                      sizeClassName="w-12 h-12"
                      textClassName="text-base"
                    />
                  </div>
                  <div className="flex-1 min-w-0 hover:cursor-pointer" onClick={() => navigate(`/profile/${u.user_id}`)}>
                    <p className="text-[15px] font-semibold">@{u.username}</p>
                    {u.bio && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{u.bio}</p>
                    )}
                  </div>
                  {!isFriend && <div className="shrink-0">
                    {hasSent ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="rounded-full text-xs font-semibold border-white/10 text-gray-500 bg-transparent"
                      >
                        Requested
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => void handleSendFriendRequest(u.user_id)}
                        disabled={isSending}
                        className="rounded-full text-xs font-semibold btn-gradient gap-1.5 hover:cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        {isSending ? "Sending..." : "Add Friend"}
                      </Button>
                    )}
                  </div>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </PageLayout>
  );
};

export default SearchPage;