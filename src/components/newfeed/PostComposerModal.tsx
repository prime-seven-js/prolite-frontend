import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { InitialAvatar } from "@/components/layout/InitialAvatar";
import { PostImageGrid } from "@/components/newfeed/PostImageGrid";
import { ImagePicker } from "@/components/newfeed/ImagePicker";
import type { PostComposerModalProps } from "@/types/newfeedspage";

export function PostComposerModal({
  isOpen,
  username,
  content,
  imageUrls,
  imageError,
  isSubmitting,
  onClose,
  onContentChange,
  onImageSelect,
  onRemoveImage,
  onSubmit,
}: PostComposerModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center px-4 pt-20"
      style={{ background: "rgba(0, 0, 0, 0.6)" }}
      onClick={onClose}
    >
      <Card
        className="glass-modal w-full max-w-lg rounded-2xl border-0 py-0 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-between p-4 pb-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="z-10 h-auto px-0 text-sm font-medium text-gray-400 hover:bg-transparent hover:text-white"
          >
            Cancel
          </Button>

          <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white">
            New Post
          </h2>

          <Button
            onClick={onSubmit}
            disabled={(!content.trim() && imageUrls.length === 0) || isSubmitting}
            className="btn-gradient z-10 h-auto rounded-full px-5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>

        <Separator className="mx-4 mt-3 bg-white/6" />

        <CardContent className="p-4">
          <div className="flex min-w-0 gap-3">
            <InitialAvatar
              name={username}
              sizeClassName="h-10 w-10"
              textClassName="text-sm"
              wrapperClassName="shrink-0 self-start"
            />

            <div className="min-w-0 flex-1">
              <Textarea
                autoFocus
                placeholder="What's happening?"
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                rows={1}
                className="min-h-0 flex-1 border-0 bg-transparent px-0 text-[15px] leading-relaxed placeholder:text-gray-500 shadow-none wrap-anywhere focus-visible:ring-0 dark:bg-transparent"
              />

              <PostImageGrid
                imageUrls={imageUrls}
                variant="composer"
                onRemoveImage={onRemoveImage}
              />

              {imageError && (
                <p className="mt-3 text-xs text-amber-300">{imageError}</p>
              )}
            </div>
          </div>
        </CardContent>

        <Separator className="mx-4 bg-white/6" />

        <div className="flex items-center gap-3 px-4 pb-4 pt-2">
          <ImagePicker
            imageCount={imageUrls.length}
            onImageSelect={onImageSelect}
            iconClassName="h-5 w-5"
          />
        </div>
      </Card>
    </div>
  );
}
