import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "@/services/friendService";
import { queryKeys } from "@/lib/queryKeys";
import type { FriendRequest } from "@/types/notification";

/**
 * Hook fetch danh sách friend requests đang chờ duyệt.
 */
export function usePendingFriendRequests() {
  return useQuery({
    queryKey: queryKeys.friends.pending,
    queryFn: friendService.fetchPending,
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
 * Không cần invalidate gì vì pending list là của mình, không phải của target user.
 */
export function useSendFriendRequest() {
  return useMutation({
    mutationFn: (userId: string) => friendService.sendRequest(userId),
  });
}
