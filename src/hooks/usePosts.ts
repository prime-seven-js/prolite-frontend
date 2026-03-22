import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";

/**
 * Mutation tạo post mới.
 * Optimistic update: thêm post vào đầu danh sách cache ngay lập tức
 * để user thấy post mới xuất hiện mà không cần đợi refetch.
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      user,
      imageUrls,
    }: {
      content: string;
      user: User;
      imageUrls?: string[];
    }) => postService.newPost(content, user, imageUrls),
    onSuccess: (createdPost) => {
      // Thêm post mới vào đầu feed
      toast.success("You have just created a new post", {position: "bottom-right"});
      queryClient.setQueryData<Post[]>(queryKeys.posts.all, (old) =>
        old ? [createdPost, ...old] : [createdPost],
      );
    },
  });
}

/**
 * Mutation xóa post.
 * Optimistic update: xóa post khỏi cache ngay lập tức.
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: (_data, postId) => {
      queryClient.setQueryData<Post[]>(queryKeys.posts.all, (old) =>
        old?.filter((p) => p.post_id !== postId),
      );
    },
  });
}
