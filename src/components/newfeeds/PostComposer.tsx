import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { PostImageGrid } from "@/components/newfeeds/PostImageGrid";
import { ImagePicker } from "@/components/newfeeds/ImagePicker";
import type { PostComposerProps } from "@/types/newfeedspage";

/**
 * Composer đăng post ở trang chính.
 */

export function PostComposer({
  username,
  avatarUrl,
  content,
  imageUrls,
  imageError,
  isSubmitting,
  textareaRef,
  onContentChange,
  onImageSelect,
  onRemoveImage,
  onSubmit,
}: PostComposerProps) {
  return (
    <Card className="glass-card mb-6 rounded-2xl border-0 py-0">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Initial avatar */}
          <InitialAvatar
            name={username}
            avatarUrl={avatarUrl}
            sizeClassName="h-10 w-10"
            textClassName="text-sm"
            wrapperClassName="mt-0.5 shrink-0 self-start"
          />

          <div className="min-w-0 flex-1">
            {/* Content input */}
            <Textarea
              ref={textareaRef}
              placeholder="What's happening?"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              rows={1}
              className="min-h-0 w-full border-0 bg-transparent px-0 text-[15px] leading-relaxed placeholder:text-gray-500 shadow-none wrap-anywhere focus-visible:ring-0 dark:bg-transparent"
            />
            {/* Image display */}
            <PostImageGrid
              imageUrls={imageUrls}
              variant="composer"
              onRemoveImage={onRemoveImage}
            />
            {/* Show error if failed to upload image */}
            {imageError && (
              <p className="mt-3 text-xs text-amber-300">{imageError}</p>
            )}

            <Separator className="my-2 bg-white/6" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Image Upload */}
                <ImagePicker
                  imageCount={imageUrls.length}
                  onImageSelect={onImageSelect}
                />
              </div>
              {/* Submit new post */}
              <Button
                onClick={onSubmit}
                disabled={
                  (!content.trim() && imageUrls.length === 0) || isSubmitting
                }
                className="btn-gradient h-auto rounded-full px-5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
