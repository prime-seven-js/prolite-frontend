import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook fetch danh sách tất cả users.
 * cache, dedupe, và refetch khi stale.
 */
export function useAllUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: authService.fetchUsers,
  });
}
