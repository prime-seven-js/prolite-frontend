import api from "@/lib/axios";
import type { Friend, FriendRequest } from "@/types/notification";

export const friendService = {
  sendRequest: async (userId: string) => {
    const res = await api.post(`/protected/friends/request/${userId}`);
    return res.data;
  },

  acceptRequest: async (friendshipId: string) => {
    const res = await api.put(`/protected/friends/accept/${friendshipId}`);
    return res.data;
  },

  declineRequest: async (friendshipId: string) => {
    const res = await api.put(`/protected/friends/decline/${friendshipId}`);
    return res.data;
  },

  fetchPending: async (): Promise<FriendRequest[]> => {
    const res = await api.get<FriendRequest[]>("/protected/friends/pending");
    return res.data;
  },

  fetchFriends: async (): Promise<Friend[]> => {
    const res = await api.get<Friend[]>("/protected/friends");
    return res.data;
  },
};
