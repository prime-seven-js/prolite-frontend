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
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useRealtimePost } from "@/hooks/useRealtimePost";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";

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

  // Server state — TanStack Infinite Query
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllPosts();
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
  const [searchQuery, setSearchQuery] = useState("");

  // Infinite scroll sentinel ref
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Realtime — lắng nghe posts mới
  useRealtimePost();

  // Flatten infinite query pages thành flat array
  const allPosts = useMemo(
    () => postsData?.pages.flatMap((page) => page) ?? [],
    [postsData],
  );

  // Filter posts theo search query (client-side)
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts;
    const q = searchQuery.toLowerCase();
    return allPosts.filter(
      (post) =>
        post.content?.toLowerCase().includes(q) ||
        post.users.username.toLowerCase().includes(q),
    );
  }, [allPosts, searchQuery]);

  // IntersectionObserver cho infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

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
        content: postContent,
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
        {/* Search bar — tìm kiếm posts (desktop + mobile) */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/6 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2496d4]/40 transition-colors"
            />
          </div>
        </div>

        {/* Post Composer — form tạo post trên trang chính */}
        <PostComposer
          username={user.username}
          avatarUrl={user.avatar}
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
        {filteredPosts.map((post, idx) => (
          <PostCard
            key={post.post_id}
            post={post}
            currentUser={user}
            userLookup={userLookup}
            idx={idx}
          />
        ))}

        {/* Search: không tìm thấy */}
        {searchQuery.trim() && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No posts found</p>
            <p className="text-sm">No results for "{searchQuery}"</p>
          </div>
        )}

        {/* Infinite scroll sentinel + loading indicator */}
        {!searchQuery.trim() && (
          <>
            <div ref={sentinelRef} className="h-1" />
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-6 gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading more posts...</span>
              </div>
            )}
            {!hasNextPage && allPosts.length > 0 && (
              <div className="text-center py-6 text-gray-600 text-sm">
                You've reached the end ✨
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal composer — form tạo post full-screen */}
      <PostComposerModal
        isOpen={showComposer}
        username={user.username}
        avatarUrl={user.avatar}
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
