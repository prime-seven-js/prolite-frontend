import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook fetch danh sách tất cả posts và chỉ refetch khi data stale hoặc bị invalidate.
 */
export function useAllPosts() {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: postService.fetchAllPostsData,
  });
}
