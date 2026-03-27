import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Fetch ALL posts for a specific user (no infinite load).
 * Backend caps limit at 1000.
 */
export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: queryKeys.posts.byUser(userId),
    queryFn: () => postService.fetchAllPostsData({ page: 1, limit: 1000, userId }),
    enabled: !!userId,
  });
}

