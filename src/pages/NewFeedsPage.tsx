// Components
import { PageLayout } from "@/components/layout/PageLayout";
import { PostCard } from "@/components/newfeed/PostCard";
import { PostComposer } from "@/components/newfeed/PostComposer";
import { PostComposerModal } from "@/components/newfeed/PostComposerModal";
// Function from library
import { preparePostImageUrls } from "@/lib/postImages";
// React Hooks & Global states
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { usePostService } from "@/stores/usePostStore";
// Custom Hooks
import { useUserLookup } from "@/hooks/useUserLookup";
import { useInitData } from "@/hooks/useInitData";

const NewFeedsPage = () => {
  // Global states
  const user = useAuthStore((s) => s.user);
  const fetchAllUsersData = useGlobalStore((s) => s.fetchAllUsersData);
  const postsData = usePostService((s) => s.postsData);
  const fetchAllPostsData = usePostService((s) => s.fetchAllPostsData);
  const newPost = usePostService((s) => s.newPost);

  // React Hooks
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
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // When posts & users data have changes, react will automatically fetch data again
  useInitData(fetchAllUsersData, fetchAllPostsData);

  // Convert usersData into a object type for accessing to user faster
  const userLookup = useUserLookup();

  // Create new post 
  const createPost = async (postContent: string, imageUrls: string[]) => {
    const trimmed = postContent.trim();
    if ((!trimmed && imageUrls.length === 0) || !user) return false;
    try {
      setIsSubmittingPost(true);
      await newPost(trimmed, user, imageUrls);
      return true;
    } catch (err) {
      console.log("Failed to create post", err);
      return false;
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Display images in post input
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

  // Handle posting new post on home page
  const handleQuickPost = async () => {
    const created = await createPost(content, selectedImageUrls);
    if (created) {
      setContent("");
      setSelectedImageUrls([]);
      setSelectedImageError(null);
      textareaRef.current?.focus();
    }
  };

  // Handle posting new post on composer modal 
  const handleModalPost = async () => {
    const created = await createPost(modalContent, modalImageUrls);
    if (created) {
      setModalContent("");
      setModalImageUrls([]);
      setModalImageError(null);
      setShowComposer(false);
    }
  };

  // For validating fetching user data.
  if (!user) return <div className="min-h-screen bg-gradient-blue" />;

  return (
    // Page layout
    <PageLayout username={user.username} activePath="/" onNewPost={() => setShowComposer(true)} >
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-0 no-scrollbar">
        {/* Post Composer */}
        <PostComposer
          username={user.username}
          content={content}
          imageUrls={selectedImageUrls}
          imageError={selectedImageError}
          isSubmitting={isSubmittingPost}
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

        {/* Post data cards */}
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

      {/* Post composer modal */}
      <PostComposerModal
        isOpen={showComposer}
        username={user.username}
        content={modalContent}
        imageUrls={modalImageUrls}
        imageError={modalImageError}
        isSubmitting={isSubmittingPost}
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
