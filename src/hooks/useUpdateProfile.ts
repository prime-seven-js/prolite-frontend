import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/user";

/**
 * Mutation cập nhật profile (bio, avatar).
 *
 * Sau khi update thành công:
 * 1. Cập nhật auth store (Zustand + localStorage) → Header, Sidebar hiển thị đúng
 * 2. Trực tiếp setQueryData cho profile + users list → UI cập nhật ngay lập tức
 * 3. Invalidate posts → feed refetch (vì posts embed user info)
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (data: { bio?: string; avatar?: string }) =>
      authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // 1. Cập nhật auth store (Zustand + localStorage)
      useAuthStore.setState({ user: updatedUser });

      // 2. Trực tiếp update profile cache → UI cập nhật ngay, không cần refetch
      if (currentUser) {
        queryClient.setQueryData(
          queryKeys.profile.detail(currentUser.user_id),
          updatedUser,
        );
      }

      // 3. Trực tiếp update users list cache → useUserLookup rebuild ngay
      queryClient.setQueryData<User[]>(queryKeys.users.all, (old) =>
        old?.map((u) =>
          u.user_id === updatedUser.user_id ? updatedUser : u,
        ) ?? [],
      );

      // 4. Invalidate posts → refetch vì posts embed user info từ server
      void queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}
