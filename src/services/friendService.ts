import api from "@/lib/axios";
import type { Friend, FriendRequest, SentFriendRequest } from "@/types/notification";

/**
 * Friend Service — quản lý friend requests và danh sách bạn bè.
 * Gồm: gửi/chấp nhận/từ chối request, fetch pending/sent/friends.
 */
export const friendService = {
  /** Gửi friend request đến user */
  sendRequest: async (userId: string) => {
    const res = await api.post(`/protected/friends/request/${userId}`);
    return res.data;
  },

  /** Chấp nhận friend request */
  acceptRequest: async (friendshipId: string) => {
    const res = await api.put(`/protected/friends/accept/${friendshipId}`);
    return res.data;
  },

  /** Từ chối friend request */
  declineRequest: async (friendshipId: string) => {
    const res = await api.put(`/protected/friends/decline/${friendshipId}`);
    return res.data;
  },

  /** Fetch danh sách friend requests đang chờ duyệt (nhận được) */
  fetchPending: async (): Promise<FriendRequest[]> => {
    const res = await api.get<FriendRequest[]>("/protected/friends/pending");
    return res.data;
  },

  /** Fetch danh sách friend requests đã gửi đi */
  fetchSentRequests: async (): Promise<SentFriendRequest[]> => {
    const res = await api.get<SentFriendRequest[]>("/protected/friends/sent");
    return res.data;
  },

  /** Fetch danh sách bạn bè đã accepted */
  fetchFriends: async (): Promise<Friend[]> => {
    const res = await api.get<Friend[]>("/protected/friends");
    return res.data;
  },
};
