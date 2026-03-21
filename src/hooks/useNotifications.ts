import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { queryKeys } from "@/lib/queryKeys";
import type { Notification } from "@/types/notification";

/**
 * Hook fetch danh sách notifications.
 */
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: notificationService.fetchNotifications,
  });
}

/**
 * Mutation đánh dấu tất cả notifications là đã đọc.
 * Optimistic update cache: set is_read = true cho tất cả.
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      // Optimistic update: cập nhật cache trực tiếp thay vì refetch
      queryClient.setQueryData<Notification[]>(
        queryKeys.notifications.all,
        (old) => old?.map((n) => ({ ...n, is_read: true })),
      );
    },
  });
}
