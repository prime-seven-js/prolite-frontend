// Shadcn
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// Icons
import { MessageCircle } from "lucide-react";
// Components
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { PostImageGrid } from "@/components/newfeed/PostImageGrid";
import { PostHeader } from "@/components/newfeed/PostHeader";
import { PostMenu } from "@/components/newfeed/PostMenu";
import { LikeButton } from "@/components/newfeed/LikeButton";
import { CommentItem } from "@/components/newfeed/CommentItem";
import { CommentInput } from "@/components/newfeed/CommentInput";
// React Hooks & Global state
import { useEffect, useState } from "react";
import { usePostService } from "@/stores/usePostService";
// Services 
import { postService } from "@/services/postService";
// Types
import type { PostComment } from "@/types/post";
import type { PostCardProps } from "@/types/newfeedspage";
import { useNavigate } from "react-router";

export function PostCard({
  post,
  currentUser,
  userLookup,
  idx,
}: PostCardProps) {
  // Like state
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [animating, setAnimating] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [submitCommentLoading, setSubmitCommentLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const navigate = useNavigate();

  // Global store 
  const deletePost = usePostService((s) => s.deletePost);
  const deletePostLoading = usePostService((s) => s.deletePostLoading);

  // Fetch initial like state
  useEffect(() => {
    let isMounted = true;
    const syncPostLikes = async () => {
      try {
        setLikeLoading(true);
        const likeSummary = await postService.fetchPostLikes(
          post.post_id,
          currentUser.user_id,
        );
        if (!isMounted) return;
        setLikes(likeSummary.count);
        setLiked(likeSummary.liked);
      } catch (err) {
        console.log("Failed to load post likes", err);
      } finally {
        if (isMounted) setLikeLoading(false);
      }
    };
    syncPostLikes();
    return () => {
      isMounted = false;
    };
  }, [post.post_id, currentUser.user_id]);

  // Load comments on mount
  useEffect(() => {
    if (!commentsLoaded && !commentLoading) loadComments();
  }, [commentsLoaded, commentLoading, post.post_id, currentUser, userLookup]);

  // Toggle Like
  const handleToggleLike = async () => {
    if (likeLoading) return;
    try {
      setLikeLoading(true);
      const likeSummary = await postService.togglePostLike(
        post.post_id,
        currentUser.user_id,
      );
      setLiked(likeSummary.liked);
      setLikes(likeSummary.count);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 350);
    } catch (err) {
      console.log("Failed to toggle post like", err);
    } finally {
      setLikeLoading(false);
    }
  };

  // Load comments
  const loadComments = async () => {
    try {
      setCommentLoading(true);
      const fetchedComments = await postService.fetchAllPostComments(
        post.post_id,
        currentUser,
        userLookup,
      );
      setComments(fetchedComments);
      setCommentsLoaded(true);
      setShowAllComments(false);
    } catch (err) {
      console.log("Failed to load post comments", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Show comments
  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded && !commentLoading) loadComments();
  };

  // Submit comment 
  const handleSubmitComment = async () => {
    const trimmed = commentInput.trim();
    if (!trimmed) return;
    try {
      setSubmitCommentLoading(true);
      const createdComment = await postService.createPostComment(post.post_id, trimmed, currentUser, userLookup);
      setComments((prev) => [createdComment, ...prev]);
      setCommentsLoaded(true);
      setShowComments(true);
      setShowAllComments(false);
      setCommentInput("");
    } catch (err) {
      console.log("Failed to create comment", err);
    } finally {
      setSubmitCommentLoading(false);
    }
  };

  // Delete comment 
  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);
      await postService.deletePostComment(commentId);
      setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
    } catch (err) {
      console.log("Failed to delete comment", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Get visible comments that can be seen in each post
  const numberOfVisibleComments = 3;
  const visibleComments = showAllComments ? comments : comments.slice(0, numberOfVisibleComments);
  const previewComments = comments.slice(0, numberOfVisibleComments);
  const hiddenCommentsCount = Math.max(comments.length - numberOfVisibleComments, 0);

  return (
    <div
      className="border-b border-white/4 px-4 py-4 hover:bg-white/1.5 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="flex gap-3">
        <div className="hover:cursor-pointer" onClick={() => navigate(`/profile/${post.user_id}`)}>
          <InitialAvatar
            name={post.users.username}
            sizeClassName="w-10 h-10"
            textClassName="text-sm"
            wrapperClassName="shrink-0 self-start mt-0.5"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Post header */}
          <div className="flex items-center justify-between">
            <PostHeader
              username={post.users.username}
              timestamp={post.created_at}
            />
            {/* Post Menu (Only owner of posts can see) */}
            {post.user_id === currentUser.user_id && (
              <PostMenu
                loading={deletePostLoading}
                onDelete={() => deletePost(post.post_id)}
              />
            )}
          </div>

          {/* Post content */}
          {post.content && (
            <p className="mt-1 text-[15px] leading-relaxed text-gray-100 wrap-anywhere">
              {post.content}
            </p>
          )}
          {/* Post image (90% AI) */}
          <PostImageGrid imageUrls={post.image_urls} />

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
            <LikeButton
              liked={liked}
              likes={likes}
              loading={likeLoading}
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

          {/* Preview comments (collapsed) */}
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
              <CommentInput
                username={currentUser.username}
                value={commentInput}
                onChange={setCommentInput}
                onSubmit={handleSubmitComment}
                disabled={submitCommentLoading}
              />

              <Separator className="my-4 bg-white/6" />
              {/* Load comments if exist otherwise print the below text */}
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
                      deletingCommentId={deletingCommentId}
                      onDelete={handleDeleteComment}
                    />
                  ))}

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
