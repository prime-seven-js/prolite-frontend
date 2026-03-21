import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Hook fetch profile data theo userId.
 * Nếu userId === current user → trả về data từ auth store (không cần fetch).
 * Nếu userId khác → fetch từ API với caching.
 * Thay thế inline useEffect trong ProfilePage.
 */
export function useUserProfile(userId: string | undefined) {
  const currentUser = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: queryKeys.profile.detail(userId ?? ""),
    queryFn: () => authService.fetchUserData(userId!),
    // Chỉ fetch khi userId tồn tại VÀ không phải current user
    enabled: !!userId && userId !== currentUser?.user_id,
    // Nếu là current user, dùng initialData từ auth store
    initialData:
      userId === currentUser?.user_id ? (currentUser ?? undefined) : undefined,
  });
}
