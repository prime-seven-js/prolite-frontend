import { PageLayout } from "@/components/layout/PageLayout";
import { PostCard } from "@/components/newfeeds/PostCard";
import { PostComposer } from "@/components/newfeeds/PostComposer";
import { PostComposerModal } from "@/components/newfeeds/PostComposerModal";
import { preparePostImageUrls } from "@/lib/postImages";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAllPosts } from "@/hooks/useAllPosts";
import { useCreatePost } from "@/hooks/usePosts";
import { useUserLookup } from "@/hooks/useUserLookup";
import { useRef, useState } from "react";
import { type Dispatch, type SetStateAction } from "react"

/**
 * Trang NewFeedsPage của Prolite.
 * Lib:
 * - preparePostImageUrls (postImages): Chuẩn bị ảnh để đăng lên cùng bài viết.
 * Global State:
 * - useAuthStore() → Lưu trữ toàn bộ State liên quan đến Auth.
 * React Hooks:
 * - useRef() → Giữ cho components không bị re-render.
 * Queries:
 * - useAllPosts() → Fetch danh sách tất cả posts.
 * Mutations:
 * - useCreatePost() → Tạo post mới.
 * - useUserLookup() → Tạo lookup table: user_id → { username, avatar }
 */

const NewFeedsPage = () => {
  // Lấy dữ liệu user hiện tại
  const user = useAuthStore((s) => s.user);
  // Tự động fetch, cache
  const { data: postsData = [] } = useAllPosts();
  const createPostMutation = useCreatePost();
  const userLookup = useUserLookup();
  // Local State cho form input
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [modalImageUrls, setModalImageUrls] = useState<string[]>([]);
  const [selectedImageError, setSelectedImageError] = useState<string | null>(
    null,
  );
  const [modalImageError, setModalImageError] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);

  // Tạo post mới qua mutation.
  const createPost = async (postContent: string, imageUrls: string[]) => {
    const trimmed = postContent.trim();
    if ((!trimmed && imageUrls.length === 0) || !user) return false;
    try {
      await createPostMutation.mutateAsync({
        content: trimmed,
        user,
        imageUrls,
      });
      return true;
    } catch (err) {
      console.log("Failed to create post", err);
      return false;
    }
  };

  /// Xử lý chọn ảnh cho post
  const appendImagesToDraft = async (
    files: FileList | null,
    draftImageUrls: string[],
    setDraftImageUrls: Dispatch<SetStateAction<string[]>>,
    setDraftImageError: Dispatch<SetStateAction<string | null>>,
  ) => {
    const { imageUrls, error } = await preparePostImageUrls(
      files,
      draftImageUrls.length,
    );
    if (imageUrls.length > 0) {
      setDraftImageUrls((current) => [...current, ...imageUrls]);
    }
    setDraftImageError(error);
  };

  // Đăng post nhanh từ composer trên trang chính
  const handleQuickPost = async () => {
    const created = await createPost(content, selectedImageUrls);
    if (created) {
      setContent("");
      setSelectedImageUrls([]);
      setSelectedImageError(null);
      textareaRef.current?.focus();
    }
  };

  // Đăng post từ modal composer
  const handleModalPost = async () => {
    const created = await createPost(modalContent, modalImageUrls);
    if (created) {
      setModalContent("");
      setModalImageUrls([]);
      setModalImageError(null);
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
        {/* Post Composer — Form tạo post trên trang chính */}
        <PostComposer
          username={user.username}
          content={content}
          imageUrls={selectedImageUrls}
          imageError={selectedImageError}
          isSubmitting={createPostMutation.isPending}
          textareaRef={textareaRef}
          onContentChange={setContent}
          onImageSelect={(files) =>
            appendImagesToDraft(
              files,
              selectedImageUrls,
              setSelectedImageUrls,
              setSelectedImageError,
            )
          }
          onRemoveImage={(index) => {
            setSelectedImageUrls((imgs) => imgs.filter((_, i) => i !== index));
            setSelectedImageError(null);
          }}
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
        imageUrls={modalImageUrls}
        imageError={modalImageError}
        isSubmitting={createPostMutation.isPending}
        onClose={() => setShowComposer(false)}
        onContentChange={setModalContent}
        onImageSelect={(files) =>
          appendImagesToDraft(
            files,
            modalImageUrls,
            setModalImageUrls,
            setModalImageError,
          )
        }
        onRemoveImage={(index) => {
          setModalImageUrls((imgs) => imgs.filter((_, i) => i !== index));
          setModalImageError(null);
        }}
        onSubmit={() => handleModalPost()}
      />
    </PageLayout>
  );
};

export default NewFeedsPage;
