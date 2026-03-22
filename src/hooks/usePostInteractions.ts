import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { queryKeys } from "@/lib/queryKeys";
import type { PostComment, PostLikeSummary } from "@/types/post";
import type { User } from "@/types/user";

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
 * Username resolution KHÔNG thực hiện ở đây — chỉ fetch raw data.
 * Component sẽ resolve username từ userLookup tại render time.
 */
export function usePostComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: () => postService.fetchAllPostComments(postId),
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
 * Optimistic update: thêm comment vào đầu danh sách cache,
 * enrich với currentUser info (vì người tạo comment chính là current user).
 */
export function useCreateComment(postId: string, currentUser: User) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      postService.createPostComment(postId, content),
    onSuccess: (newComment) => {
      // Enrich comment với current user info (người vừa tạo comment)
      const enrichedComment: PostComment = {
        ...newComment,
        user: {
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      };
      // Thêm comment mới vào đầu danh sách (hiển thị mới nhất trước)
      queryClient.setQueryData<PostComment[]>(
        queryKeys.posts.comments(postId),
        (old) => (old ? [enrichedComment, ...old] : [enrichedComment]),
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
