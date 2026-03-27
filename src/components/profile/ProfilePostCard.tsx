import type { Post } from "@/types/post";
import { InitialAvatar } from "../layout/InitialAvatar";
import { PostHeader } from "../newfeeds/PostHeader";
import { PostImageGrid } from "../newfeeds/PostImageGrid";
import { ExpandableText } from "../newfeeds/ExpandableText";
import { PostMenu } from "../newfeeds/PostMenu";
import { useDeletePost } from "@/hooks/usePosts";

const ProfilePostCard = ({
  post,
  index,
  isOwnProfile = false,
}: {
  post: Post;
  index: number;
  isOwnProfile?: boolean;
}) => {
  const deletePostMutation = useDeletePost();
  
  return (
    <div
      className="border-b border-white/4 px-4 py-4 hover:bg-white/1.5 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex gap-3">
        <InitialAvatar
          name={post.users.username}
          avatarUrl={post.users.avatar}
          sizeClassName="w-10 h-10"
          textClassName="text-sm"
          wrapperClassName="shrink-0 self-start mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <PostHeader
              username={post.users.username}
              timestamp={post.created_at}
            />
            {isOwnProfile && (
              <PostMenu
                loading={deletePostMutation.isPending}
                onDelete={() => deletePostMutation.mutateAsync(post.post_id)}
              />
            )}
          </div>
          {/* Post content — truncate nếu quá 200 từ */}
          <ExpandableText
            content={post.content}
            wordLimit={200}
            className="text-[15px] leading-relaxed mt-1 text-gray-100 whitespace-pre-wrap wrap-anywhere"
          />
          <PostImageGrid imageUrls={post.image_urls} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePostCard;
