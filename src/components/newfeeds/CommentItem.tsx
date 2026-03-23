import { Button } from "@/components/ui/button";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { PostHeader } from "@/components/newfeeds/PostHeader";
import { ExpandableText } from "@/components/newfeeds/ExpandableText";
import type { CommentItemProps } from "@/types/newfeedspage";

/**
 * Danh sách các Comments của 1 post.
 */

export function CommentItem({
  comment,
  currentUserId,
  deletingCommentId,
  onDelete,
}: CommentItemProps) {
  return (
    <div className="flex gap-3">
      <InitialAvatar
        name={comment.user.username}
        avatarUrl={comment.user.avatar}
        sizeClassName="w-8 h-8"
        textClassName="text-xs"
        wrapperClassName="shrink-0 self-start"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 min-w-0">
          {/* Header */}
          <PostHeader
            username={comment.user.username}
            timestamp={comment.created_at}
            size="sm"
          />

          {/* Hiện nút Delete nếu comment.user_id === currentUserId */}
          {currentUserId && comment.user_id === currentUserId && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              disabled={deletingCommentId === comment.comment_id}
              onClick={() => onDelete(comment.comment_id)}
              className="h-auto px-2 py-1 text-xs text-red-400 hover:bg-white/4 hover:text-red-300 rounded-full"
            >
              {deletingCommentId === comment.comment_id
                ? "Deleting..."
                : "Delete"}
            </Button>
          )}
        </div>
        {/* Comment Content — truncate nếu quá 200 từ */}
        <ExpandableText
          content={comment.content}
          wordLimit={200}
          className="mt-1 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap wrap-anywhere"
        />
      </div>
    </div>
  );
}
