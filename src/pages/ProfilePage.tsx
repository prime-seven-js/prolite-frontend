import { useState } from "react";
import { useParams } from "react-router";
import { Edit3, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatToVNDate } from "@/lib/converttime";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAllPosts } from "@/hooks/useAllPosts";
import { useUserFriends } from "@/hooks/useFriends";
import ProfilePostCard from "@/components/profile/ProfilePostCard";

/**
 * Trang Profile — hiển thị thông tin user và danh sách posts của họ.
 *
 * Data fetching (TanStack Query):
 * - useUserProfile(userId) → thông tin user (cache by userId)
 *   → nếu xem profile mình: dùng data từ auth store (initialData)
 *   → nếu xem profile người khác: fetch từ API
 * - useAllPosts() → danh sách tất cả posts (filter client-side theo userId)
 * - useUserFriends() → danh sách bạn bè (để hiển thị nút Add/Your Friend)
 */
const ProfilePage = () => {
  const { userId } = useParams();
  const user = useAuthStore((s) => s.user);

  // Server state — TanStack Query
  const { data: userData, isLoading: profileLoading } = useUserProfile(userId);
  const { data: postsData = [] } = useAllPosts();
  const { data: userFriendData = [] } = useUserFriends();

  // UI state — editing bio
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");

  // Guard: chờ auth và params
  if (!user || !userId) return <></>;

  // Loading state — chờ profile data
  if (profileLoading && !userData) {
    return (
      <PageLayout username={user.username} activePath="/profile">
        <div className="flex items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-2 border-[#2496d4] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!userData) return <></>;

  // Filter posts của user đang xem profile
  const filteredPosts = postsData.filter((post) => post.user_id === userId);

  const isOwnProfile = userId === user.user_id;
  const isFriend = userFriendData.some(
    (friend) => friend.user_id === user.user_id,
  );

  return (
    <PageLayout username={user.username} activePath="/profile" rightSidebar=" ">
      {/* ── Profile Info ── */}
      <div className="px-4 pb-4 pt-6">
        <div className="flex justify-between items-start mb-3">
          <InitialAvatar
            name={userData.username}
            sizeClassName="w-24 h-24"
            textClassName="text-3xl"
          />
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-sm font-semibold border-white/10 text-white hover:bg-white/6 bg-transparent gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit profile
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h1 className="text-xl font-bold">{userData?.username}</h1>
          </div>

          {/* Bio — editable cho own profile */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2496d4]/40 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditBio(userData?.bio || "");
                    setIsEditing(false);
                  }}
                  className="rounded-full text-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="btn-gradient rounded-full"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed">
              {userData.bio
                ? userData.bio
                : isOwnProfile
                  ? "You do not have a bio!"
                  : `${userData.username} does not have a bio!`}
            </p>
          )}

          <div className="flex flex-row justify-between text-sm">
            <span className="text-gray-500 text-sm">
              Created at {formatToVNDate(userData.createdAt || "")}
            </span>
            {/* Nút Add Friend / Your Friend — chỉ hiển thị khi xem profile người khác */}
            {!isOwnProfile &&
              (isFriend ? (
                <Button
                  size="sm"
                  className="rounded-full text-xs font-semibold btn-gradient gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add Friend
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="rounded-full text-xs font-semibold bg-gradient-primary text-neutral-50 gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Your Friend
                </Button>
              ))}
          </div>
        </div>
      </div>

      <Separator className="bg-white/6" />

      {/* ── Profile Tabs ── */}
      <div className="flex overflow-x-auto no-scrollbar">
        <div
          className={`flex-1 text-center h-auto py-3 text-sm font-medium rounded-none border-b-2 transition-all text-[#63d4f7] border-[#2496d4]`}
        >
          Posts {filteredPosts.length}
        </div>
      </div>

      {/* ── Tab Content: danh sách posts của user ── */}
      <div className="no-scrollbar">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-medium mb-1">No posts yet.</p>
            <p className="text-sm">
              {isOwnProfile ? "Your" : "Their"} posts will appear here.
            </p>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <ProfilePostCard key={post.post_id} post={post} index={i} />
          ))
        )}
      </div>
    </PageLayout>
  );
};

export default ProfilePage;


