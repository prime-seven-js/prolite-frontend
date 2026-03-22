import { PageLayout } from "@/components/layout/PageLayout";
import { PostCard } from "@/components/newfeeds/PostCard";
import { PostComposer } from "@/components/newfeeds/PostComposer";
import { PostComposerModal } from "@/components/newfeeds/PostComposerModal";
import { removeUploadedPostImages, uploadPostImages } from "@/lib/postImages";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAllPosts } from "@/hooks/useAllPosts";
import { useCreatePost } from "@/hooks/usePosts";
import { useUserLookup } from "@/hooks/useUserLookup";
import { useDraftImages } from "@/hooks/useDraftImages";
import { useRef, useState } from "react";
import { useRealtimePost } from "@/hooks/useRealtimePost";
import { toast } from "sonner";

/**
 * Trang NewFeeds — hiển thị danh sách posts + form tạo post mới.
 *
 * Data fetching (TanStack Query):
 * - useAllPosts() → danh sách posts (cache, auto-refetch)
 * - useCreatePost() → mutation tạo post mới
 * - useUserLookup() → lookup table user_id → { username, avatar }
 *
 * Custom hooks:
 * - useDraftImages() × 2 → quản lý draft images cho main composer và modal
 * - useRealtimePost() → realtime subscription cho posts
 */
const NewFeedsPage = () => {
  // Auth state
  const user = useAuthStore((s) => s.user);

  // Server state — TanStack Query
  const { data: postsData = [] } = useAllPosts();
  const createPostMutation = useCreatePost();
  const userLookup = useUserLookup();

  // Draft images — main composer + modal dùng 2 instances riêng
  const mainDraft = useDraftImages();
  const modalDraft = useDraftImages();

  // UI state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);

  // Realtime — lắng nghe posts mới
  useRealtimePost();

  /**
   * Tạo post mới: rewrite content bằng AI → upload ảnh → gọi mutation.
   * Rollback: xóa ảnh đã upload nếu mutation fail.
   */
  const createPost = async (
    postContent: string,
    draft: ReturnType<typeof useDraftImages>,
  ) => {
    const trimmed = postContent.trim();
    if ((!trimmed && draft.images.length === 0) || !user) return false;
    let uploadedPaths: string[] = [];

    try {
      const uploadResult =
        draft.images.length > 0
          ? await uploadPostImages(user.user_id, draft.images)
          : { imageUrls: [], uploadedPaths: [] };

      uploadedPaths = uploadResult.uploadedPaths;

      await createPostMutation.mutateAsync({
        content,
        user,
        imageUrls: uploadResult.imageUrls,
      });

      return true;
    } catch (err) {
      // Rollback: xóa ảnh đã upload khi có lỗi
      toast.error("Error appears while trying to create a new post!")
      await removeUploadedPostImages(uploadedPaths);
      console.log("Failed to create post", err);
      return false;
    }
  };

  /** Đăng post nhanh từ composer trên trang chính */
  const handleQuickPost = async () => {
    const created = await createPost(content, mainDraft);
    if (created) {
      setContent("");
      mainDraft.clearImages();
      textareaRef.current?.focus();
    }
  };

  /** Đăng post từ modal composer */
  const handleModalPost = async () => {
    const created = await createPost(modalContent, modalDraft);
    if (created) {
      setModalContent("");
      modalDraft.clearImages();
      setShowComposer(false);
    }
  };

  // Guard: chờ auth hydrate xong
  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  return (
    <PageLayout
      username={user.username}
      activePath="/"
      onNewPost={() => setShowComposer(true)}
    >
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-0 no-scrollbar">
        {/* Post Composer — form tạo post trên trang chính */}
        <PostComposer
          username={user.username}
          content={content}
          imageUrls={mainDraft.previewUrls}
          imageError={mainDraft.imageError}
          isSubmitting={createPostMutation.isPending}
          textareaRef={textareaRef}
          onContentChange={setContent}
          onImageSelect={(files) => mainDraft.appendImages(files)}
          onRemoveImage={(index) => mainDraft.removeImage(index)}
          onSubmit={() => handleQuickPost()}
        />

        {/* Danh sách post cards */}
        {postsData.map((post, idx) => (
          <PostCard
            key={post.post_id}
            post={post}
            currentUser={user}
            userLookup={userLookup}
            idx={idx}
          />
        ))}
      </div>

      {/* Modal composer — form tạo post full-screen */}
      <PostComposerModal
        isOpen={showComposer}
        username={user.username}
        content={modalContent}
        imageUrls={modalDraft.previewUrls}
        imageError={modalDraft.imageError}
        isSubmitting={createPostMutation.isPending}
        onClose={() => setShowComposer(false)}
        onContentChange={setModalContent}
        onImageSelect={(files) => modalDraft.appendImages(files)}
        onRemoveImage={(index) => modalDraft.removeImage(index)}
        onSubmit={() => handleModalPost()}
      />
    </PageLayout>
  );
};

export default NewFeedsPage;
