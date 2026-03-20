// Shadcn
import { Button } from "@/components/ui/button";
// Components
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { PostHeader } from "@/components/newfeed/PostHeader";
// Type
import type { CommentItemProps } from "@/types/newfeedspage";

export function CommentItem({ comment, currentUserId, deletingCommentId, onDelete }: CommentItemProps) {
  return (
    <div className="flex gap-3">
      <InitialAvatar
        name={comment.user.username}
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

          {/* Show delete button if commentUserID === currentUserId */}
          {(currentUserId && comment.user_id === currentUserId) && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              disabled={(deletingCommentId === comment.comment_id)}
              onClick={() => onDelete(comment.comment_id)}
              className="h-auto px-2 py-1 text-xs text-red-400 hover:bg-white/4 hover:text-red-300 rounded-full"
            >
              {(deletingCommentId === comment.comment_id) ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
        {/* Comment Content */}
        <p className="mt-1 text-sm leading-relaxed text-gray-300 wrap-anywhere">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
