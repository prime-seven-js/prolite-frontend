import { useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { queryKeys } from "@/lib/queryKeys";

const POSTS_PER_PAGE = 10;

/**
 * Hook fetch posts với infinite scroll.
 */
export function useAllPosts() {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.all,
    queryFn: ({ pageParam = 1 }) =>
      postService.fetchAllPostsData({ page: pageParam, limit: POSTS_PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // Nếu page trả về đủ items → có page tiếp
      if (lastPage.length >= POSTS_PER_PAGE) return lastPageParam + 1;
      return undefined; // Hết data
    },
  });
}
