import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { queryKeys } from "@/lib/queryKeys";
import type { PostComment, PostLikeSummary } from "@/types/post";
import type { User, UserLookup } from "@/types/user";

/**
 * Hook fetch like summary cho một post (count, liked status, danh sách likes).
 */
export function usePostLikes(postId: string, currentUserId: string) {
  return useQuery({
    queryKey: queryKeys.posts.likes(postId),
    queryFn: () => postService.fetchPostLikes(postId, currentUserId),
  });
}

/**
 * Hook fetch comments cho một post.
 */
export function usePostComments(
  postId: string,
  currentUser: User,
  userLookup: UserLookup,
) {
  return useQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: () =>
      postService.fetchAllPostComments(postId, currentUser, userLookup),
  });
}

/**
 * Mutation toggle like (like/unlike) cho một post.
 */
export function useToggleLike(postId: string, currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postService.togglePostLike(postId, currentUserId),
    onSuccess: (likeSummary) => {
      // Cập nhật cache trực tiếp với data mới từ server
      queryClient.setQueryData<PostLikeSummary>(
        queryKeys.posts.likes(postId),
        likeSummary,
      );
    },
  });
}

/**
 * Mutation tạo comment mới cho post.
 * Optimistic update: thêm comment vào đầu danh sách cache.
 */
export function useCreateComment(
  postId: string,
  currentUser: User,
  userLookup: UserLookup,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      postService.createPostComment(postId, content, currentUser, userLookup),
    onSuccess: (newComment) => {
      // Thêm comment mới vào đầu danh sách (hiển thị mới nhất trước)
      queryClient.setQueryData<PostComment[]>(
        queryKeys.posts.comments(postId),
        (old) => (old ? [newComment, ...old] : [newComment]),
      );
    },
  });
}

/**
 * Mutation xóa comment.
 * Optimistic update: xóa comment khỏi cache ngay lập tức.
 */
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => postService.deletePostComment(commentId),
    onSuccess: (_data, commentId) => {
      queryClient.setQueryData<PostComment[]>(
        queryKeys.posts.comments(postId),
        (old) => old?.filter((c) => c.comment_id !== commentId),
      );
    },
  });
}
