import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";

/**
 * Mutation tạo post mới.
 * Optimistic update: thêm post vào đầu page đầu tiên trong InfiniteData cache.
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
      toast.success("You have just created a new post", {position: "bottom-right"});
      // Thêm post mới vào đầu page đầu tiên trong InfiniteData
      queryClient.setQueryData<InfiniteData<Post[]>>(queryKeys.posts.all, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? [createdPost, ...page] : page,
          ),
        };
      });
    },
  });
}

/**
 * Mutation xóa post.
 * Optimistic update: xóa post khỏi tất cả pages trong InfiniteData cache.
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: (_data, postId) => {
      queryClient.setQueryData<InfiniteData<Post[]>>(queryKeys.posts.all, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.filter((p) => p.post_id !== postId),
          ),
        };
      });
    },
  });
}
