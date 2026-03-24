import { Button } from "@/components/ui/button";
import { AutoResizeTextarea } from "@/components/ui/AutoResizeTextarea";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import type { CommentInputProps } from "@/types/newfeedspage";
import type { KeyboardEvent } from "react";

/**
 * UI Input của phần Comment.
 * Global State:
 * - useAuthStore → Lưu trữ state liên quan đến Auth.
 */

export function CommentInput({
  username,
  avatarUrl,
  value,
  onChange,
  onSubmit,
  disabled,
}: CommentInputProps) {
  const canSubmit = !!value.trim() && !disabled;

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;

    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <div className="flex gap-3 min-w-0">
      <InitialAvatar
        name={username}
        avatarUrl={avatarUrl}
        sizeClassName="w-8 h-8"
        textClassName="text-xs"
        wrapperClassName="shrink-0 self-start"
      />

      <div className="flex-1 min-w-0">
        {/* Textarea cho để nhập Comment*/}
        <AutoResizeTextarea
          value={value}
          onChange={onChange}
          onKeyDown={handleTextareaKeyDown}
          placeholder="Write a comment..."
          maxLength={300}
          showCounter
          rows={1}
          className="w-full border-0 bg-transparent dark:bg-transparent shadow-none resize-none text-sm placeholder:text-gray-500 leading-relaxed focus-visible:ring-0 px-0 min-h-0 wrap-anywhere"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs">Comment directly on this post.</p>
          {/* Nút gửi comment */}
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="btn-gradient rounded-full px-4 py-1.5 h-auto text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {disabled ? "Commenting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
