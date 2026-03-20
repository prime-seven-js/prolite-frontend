import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Edit3, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/authService";
import type { User } from "@/types/user";
import { formatToVNDate } from "@/lib/converttime";
import { usePostService } from "@/stores/usePostStore";
import { useInitData } from "@/hooks/useInitData";
import type { Post } from "@/types/post";
import { PostHeader } from "@/components/newfeed/PostHeader";
import { PostImageGrid } from "@/components/newfeed/PostImageGrid";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const { fetchAllPostsData, postsData } = usePostService();

  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");

  useInitData(fetchAllPostsData);

  useEffect(() => {
    if (!userId || !user) return;

    // Reset state immediately on userId change to avoid showing stale data
    const loadProfile = async () => {
      setUserData(null);
      setIsEditing(false);

      if (userId === user.user_id) {
        setUserData(user);
        setEditBio(user.bio || "");
      } else {
        try {
          const fetched = await authService.fetchUserData(userId);
          setUserData(fetched);
          setEditBio(fetched.bio || "");
        } catch (err) {
          console.log("Failed to fetch user", err);
        }
      }
    };
    loadProfile();
  }, [userId, user]);


  if (!user || !userId) return <></>;
  if (!userData) {
    return (
      <PageLayout username={user.username} activePath="/profile">
        <div className="flex items-center justify-center py-20 text-gray-500">
          <div className="w-8 h-8 border-2 border-[#2496d4] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  const filteredPosts = postsData.filter(post => post.user_id === userId);

  const isOwnProfile = userId === user.user_id;

  return (
    <PageLayout
      username={user.username}
      activePath="/profile"
      rightSidebar=" "
    >
      {/* Profile Info */}
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
            {!isOwnProfile && (
              <Button
                size="sm"
                className="rounded-full text-xs font-semibold btn-gradient gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />Add Friend
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator className="bg-white/6" />

      {/* Profile Tabs */}
      <div className="flex overflow-x-auto no-scrollbar">
        <div
          className={`flex-1 text-center h-auto py-3 text-sm font-medium rounded-none border-b-2 transition-all text-[#63d4f7] border-[#2496d4]`}
        >
          Posts
        </div>
      </div>

      {/* Tab Content */}
      <div className="no-scrollbar">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-medium mb-1">No posts yet.</p>
            <p className="text-sm">{isOwnProfile ? "Your" : "Their"} posts will appear here.</p>
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

function ProfilePostCard({ post, index }: { post: Post; index: number }) {
  return (
    <div
      className="border-b border-white/4 px-4 py-4 hover:bg-white/1.5 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex gap-3">
        <InitialAvatar
          name={post.users.username}
          sizeClassName="w-10 h-10"
          textClassName="text-sm"
          wrapperClassName="shrink-0 self-start mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <PostHeader username={post.users.username} timestamp={post.created_at} />
          <p className="text-[15px] leading-relaxed mt-1 text-gray-100">{post.content}</p>
          <PostImageGrid imageUrls={post.image_urls} />
        </div>
      </div>
    </div>
  );
}
