import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "@/services/friendService";
import { queryKeys } from "@/lib/queryKeys";
import type { FriendRequest } from "@/types/notification";

/**
 * Hook fetch danh sách friend requests đang chờ duyệt (nhận được).
 */
export function usePendingFriendRequests() {
  return useQuery({
    queryKey: queryKeys.friends.pending,
    queryFn: friendService.fetchPending,
  });
}

/**
 * Hook fetch danh sách friend requests đã gửi đi.
 */
export function useSentFriendRequests() {
  return useQuery({
    queryKey: queryKeys.friends.sent,
    queryFn: friendService.fetchSentRequests,
  });
}

/**
 * Hook fetch danh sách bạn bè đã accepted.
 */
export function useUserFriends() {
  return useQuery({
    queryKey: queryKeys.friends.list,
    queryFn: friendService.fetchFriends,
  });
}

/**
 * Mutation chấp nhận friend request.
 * Optimistic update: xóa request khỏi pending list
 * và invalidate friends list để refetch.
 */
export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: string) =>
      friendService.acceptRequest(friendshipId),
    onSuccess: (_data, friendshipId) => {
      // Xóa request đã accept khỏi pending cache
      queryClient.setQueryData<FriendRequest[]>(
        queryKeys.friends.pending,
        (old) => old?.filter((r) => r.id !== friendshipId),
      );
      // Refetch danh sách bạn bè vì có thêm bạn mới
      void queryClient.invalidateQueries({
        queryKey: queryKeys.friends.list,
      });
    },
  });
}

/**
 * Mutation từ chối friend request.
 * Optimistic update: xóa request khỏi pending list.
 */
export function useDeclineFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: string) =>
      friendService.declineRequest(friendshipId),
    onSuccess: (_data, friendshipId) => {
      queryClient.setQueryData<FriendRequest[]>(
        queryKeys.friends.pending,
        (old) => old?.filter((r) => r.id !== friendshipId),
      );
    },
  });
}

/**
 * Mutation gửi friend request.
 * Sau khi thành công, invalidate sent requests cache.
 */
export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => friendService.sendRequest(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.friends.sent,
      });
    },
  });
}
