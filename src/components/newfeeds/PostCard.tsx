import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { PostImageGrid } from "@/components/newfeeds/PostImageGrid";
import { PostHeader } from "@/components/newfeeds/PostHeader";
import { PostMenu } from "@/components/newfeeds/PostMenu";
import { LikeButton } from "@/components/newfeeds/LikeButton";
import { CommentItem } from "@/components/newfeeds/CommentItem";
import { CommentInput } from "@/components/newfeeds/CommentInput";
import { useState } from "react";
import { useDeletePost } from "@/hooks/usePosts";
import {
  usePostLikes,
  usePostComments,
  useToggleLike,
  useCreateComment,
  useDeleteComment,
} from "@/hooks/usePostInteractions";
import { useRealtimePostInteractions } from "@/hooks/useRealtimePostInteractions";
import { useNavigate } from "react-router";
import type { PostCardProps } from "@/types/newfeedspage";

/**
 * Hiển thị một post trong feed.
 * Queries:
 * - usePostLikes() → Fetch đếm lượt thích và trạng thái.
 * - usePostComments() → Fetch danh sách comments.
 * Mutations:
 * - useToggleLike() → Like/unlike post.
 * - useCreateComment() → Tạo comment mới.
 * - useDeleteComment() → Xóa comment.
 * - useDeletePost() → Xóa post.
 * Supabase Realtime:
 * - useRealtimePostInteractions → Cập nhật các tương tác với các bài post thời gian thực.
 */

export function PostCard({
  post,
  currentUser,
  userLookup,
  idx,
}: PostCardProps) {
  const navigate = useNavigate();

  // Tự động fetch đếm lượt thích và trạng thái.
  const { data: likeSummary, isLoading: likeLoading } = usePostLikes(
    post.post_id,
    currentUser.user_id,
  );
  // Tự động fetch danh sách comments
  const { data: comments = [], isLoading: commentLoading } = usePostComments(
    post.post_id,
    currentUser,
    userLookup,
  );

  // Cập nhật các tương tác theo post_id theo thời gian thực.
  useRealtimePostInteractions(post.post_id);

  // Các mutations thực thi các tương tác với post_id.
  const toggleLikeMutation = useToggleLike(post.post_id, currentUser.user_id);
  const createCommentMutation = useCreateComment(
    post.post_id,
    currentUser,
    userLookup,
  );
  const deleteCommentMutation = useDeleteComment(post.post_id);
  const deletePostMutation = useDeletePost();

  // Các Local State cho việc hiển thị UI.
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Các Derived State lấy từ Query Data.
  const liked = likeSummary?.liked ?? false;
  const likes = likeSummary?.count ?? post.likes;

  // Like/Unlike
  const handleToggleLike = () => {
    if (likeLoading || toggleLikeMutation.isPending) return;
    toggleLikeMutation.mutate();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 250);
  };

  // Hiển thị thêm comments.
  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // Tạo comment mới.
  const handleSubmitComment = async () => {
    const trimmed = commentInput.trim();
    if (!trimmed) return;
    try {
      await createCommentMutation.mutateAsync(trimmed);
      setCommentInput("");
      setShowComments(true);
      setShowAllComments(false);
    } catch (err) {
      console.log("Failed to create comment", err);
    }
  };

  // Xóa comment.
  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  // Hiển thị trước 3 comments của bài viết.
  const numberOfVisibleComments = 3;
  const visibleComments = showAllComments
    ? comments
    : comments.slice(0, numberOfVisibleComments);
  const previewComments = comments.slice(0, numberOfVisibleComments);
  const hiddenCommentsCount = Math.max(
    comments.length - numberOfVisibleComments,
    0,
  );

  return (
    <div
      className="border-b border-white/4 px-4 py-4 hover:bg-white/1.5 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="flex gap-3">
        {/* Avatar — Click vào để điều hướng đến profile. */}
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate(`/profile/${post.user_id}`)}
        >
          <InitialAvatar
            name={post.users.username}
            sizeClassName="w-10 h-10"
            textClassName="text-sm"
            wrapperClassName="shrink-0 self-start mt-0.5"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Post header: username + timestamp */}
          <div className="flex items-center justify-between">
            <PostHeader
              username={post.users.username}
              timestamp={post.created_at}
            />
            {/* Menu xóa post — chỉ owner mới thấy */}
            {post.user_id === currentUser.user_id && (
              <PostMenu
                loading={deletePostMutation.isPending}
                onDelete={() => deletePostMutation.mutateAsync(post.post_id)}
              />
            )}
          </div>

          {/* Post content text */}
          {post.content && (
            <p className="mt-1 text-[15px] leading-relaxed text-gray-100 wrap-anywhere">
              {post.content}
            </p>
          )}

          {/* Post images grid */}
          <PostImageGrid imageUrls={post.image_urls} />

          {/* Action buttons: Like + Comment */}
          <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
            <LikeButton
              liked={liked}
              likes={likes}
              loading={likeLoading || toggleLikeMutation.isPending}
              animating={animating}
              onClick={handleToggleLike}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleComments}
              className={`gap-1.5 rounded-full px-2 ${showComments ? "bg-[#2496d4]/10 text-[#63d4f7]" : "hover:bg-[#2496d4]/10 text-gray-600"}`}
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span className="text-xs transition-colors">
                {comments.length}
              </span>
            </Button>
          </div>

          {/* Preview comments (collapsed view) */}
          {!showComments && previewComments.length > 0 && (
            <div className="mt-4 space-y-3">
              {previewComments.map((comment) => (
                <CommentItem key={comment.comment_id} comment={comment} />
              ))}

              {comments.length > numberOfVisibleComments && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleComments}
                  className="h-auto px-0 py-1 text-xs text-[#63d4f7] hover:bg-transparent hover:text-[#8dd8f8]"
                >
                  View all {comments.length} comments
                </Button>
              )}
            </div>
          )}

          {/* Expanded comment section */}
          {showComments && (
            <div className="mt-4 rounded-2xl border border-white/6 bg-white/2 p-4">
              {/* Comment input */}
              <CommentInput
                username={currentUser.username}
                value={commentInput}
                onChange={setCommentInput}
                onSubmit={handleSubmitComment}
                disabled={createCommentMutation.isPending}
              />

              <Separator className="my-4 bg-white/6" />

              {/* Comments list */}
              {commentLoading ? (
                <p className="text-sm text-gray-500">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                <div className="space-y-4">
                  {visibleComments.map((comment) => (
                    <CommentItem
                      key={comment.comment_id}
                      comment={comment}
                      currentUserId={currentUser.user_id}
                      deletingCommentId={
                        deleteCommentMutation.isPending
                          ? (deleteCommentMutation.variables ?? null)
                          : null
                      }
                      onDelete={handleDeleteComment}
                    />
                  ))}

                  {/* Nút show more/less comments */}
                  {hiddenCommentsCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllComments((prev) => !prev)}
                      className="h-auto px-0 py-1 text-xs text-[#63d4f7] hover:bg-transparent hover:text-[#8dd8f8]"
                    >
                      {showAllComments
                        ? "Show fewer comments"
                        : `Show ${hiddenCommentsCount} more comments`}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
