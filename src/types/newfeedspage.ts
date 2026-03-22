import type { RefObject } from "react";
import type { Post, PostComment } from "@/types/post";
import type { User, UserLookup } from "@/types/user";

export interface PostComposerProps {
  username: string;
  avatarUrl?: string;
  content: string;
  imageUrls: string[];
  imageError: string | null;
  isSubmitting: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onContentChange: (value: string) => void;
  onImageSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: () => void;
}

export interface PostCardProps {
  post: Post;
  currentUser: User;
  userLookup: UserLookup;
  idx: number;
}

export interface PostHeaderProps {
  username: string;
  timestamp: string;
  size?: "sm" | "base";
}

export interface PostMenuProps {
  loading: boolean;
  onDelete: () => Promise<void>;
}

export interface PostImageGridProps {
  imageUrls: string[];
  className?: string;
  variant?: "feed" | "composer";
  onRemoveImage?: (index: number) => void;
}

export interface CommentItemProps {
  comment: PostComment;
  currentUserId?: string;
  deletingCommentId?: string | null;
  onDelete?: (commentId: string) => void;
}

export interface CommentInputProps {
  username: string;
  avatarUrl?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export interface PostComposerModalProps {
  isOpen: boolean;
  username: string;
  avatarUrl?: string;
  content: string;
  imageUrls: string[];
  imageError: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onContentChange: (value: string) => void;
  onImageSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: () => void;
}

export interface DotIndicatorProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  activeDotColor?: string;
  inactiveDotColor?: string;
  stopPropagation?: boolean;
}

export interface ImagePickerProps {
  imageCount: number;
  onImageSelect: (files: FileList | null) => void;
  iconClassName?: string;
}

export interface LikeButtonProps {
  liked: boolean;
  likes: number;
  loading: boolean;
  animating: boolean;
  onClick: () => void;
}
