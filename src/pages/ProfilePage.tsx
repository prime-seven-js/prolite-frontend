import { useRef, useState } from "react";
import { useParams } from "react-router";
import { Edit3, UserPlus, Check, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatToVNDate } from "@/lib/converttime";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAllPosts } from "@/hooks/useAllPosts";
import { useUserFriends } from "@/hooks/useFriends";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import ProfilePostCard from "@/components/profile/ProfilePostCard";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/**
 * Trang Profile — hiển thị thông tin user và danh sách posts của họ.
 *
 * Data fetching (TanStack Query):
 * - useUserProfile(userId) → thông tin user (cache by userId)
 * - useAllPosts() → danh sách tất cả posts (filter client-side theo userId)
 * - useUserFriends() → danh sách bạn bè
 *
 * Edit Profile:
 * - Cho phép sửa bio và avatar (chỉ own profile)
 * - Avatar upload lên Supabase Storage bucket "avatars"
 * - Gọi PUT /protected/users/me → invalidate tất cả caches
 */

const ProfilePage = () => {
  const { userId } = useParams();
  const user = useAuthStore((s) => s.user);

  // Server state — TanStack Query
  const { data: userData, isLoading: profileLoading } = useUserProfile(userId);
  const { data: postsData = [] } = useAllPosts();
  const { data: userFriendData = [] } = useUserFriends();

  // UI state — editing
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Mutation cập nhật profile
  const updateProfileMutation = useUpdateProfile();

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

  /** Bắt đầu chỉnh sửa — fill form với data hiện tại */
  const handleStartEditing = () => {
    setEditBio(userData.bio || "");
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(true);
  };

  /** Hủy chỉnh sửa — reset tất cả state */
  const handleCancelEditing = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setAvatarFile(null);
    setEditBio(userData.bio || "");
    setIsEditing(false);
  };

  /** Chọn ảnh avatar mới — tạo preview */
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /** Lưu profile — upload avatar (nếu có) + gọi API */
  const handleSaveProfile = async () => {
    try {
      let avatarUrl: string | undefined;

      // Upload avatar mới lên Supabase Storage nếu có
      if (avatarFile && user) {
        const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.user_id}/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, {
            cacheControl: "3600",
            contentType: avatarFile.type,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(path);

        avatarUrl = publicUrl;
      }

      // Gọi API cập nhật profile
      await updateProfileMutation.mutateAsync({
        bio: editBio,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      });

      // Cleanup
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsEditing(false);
      toast.success("Profile updated!", { position: "bottom-right" });
    } catch (err) {
      toast.error("Failed to update profile");
      console.log("Failed to update profile", err);
    }
  };

  // Avatar hiển thị — preview nếu đang edit, hoặc avatar hiện tại
  const displayAvatar = avatarPreview ?? userData.avatar;

  return (
    <PageLayout username={user.username} activePath="/profile" rightSidebar=" ">
      {/* ── Profile Info ── */}
      <div className="px-4 pb-4 pt-6">
        <div className="flex justify-between items-start mb-3">
          {/* Avatar — có overlay camera icon khi đang edit */}
          <div className="relative group">
            <InitialAvatar
              name={userData.username}
              avatarUrl={displayAvatar}
              sizeClassName="w-24 h-24"
              textClassName="text-3xl"
            />
            {isEditing && (
              <>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Edit Profile / Save / Cancel buttons */}
          {isOwnProfile && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEditing}
                    className="rounded-full text-sm font-semibold border-white/10 text-gray-400 hover:bg-white/6 bg-transparent gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => void handleSaveProfile()}
                    disabled={updateProfileMutation.isPending}
                    className="rounded-full text-sm font-semibold btn-gradient gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEditing}
                  className="rounded-full text-sm font-semibold border-white/10 text-white hover:bg-white/6 bg-transparent gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit profile
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h1 className="text-xl font-bold">{userData?.username}</h1>
          </div>

          {/* Bio — editable cho own profile */}
          {isEditing ? (
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                placeholder="Tell people about yourself..."
                className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#2496d4]/40 resize-none placeholder:text-gray-600"
              />
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
