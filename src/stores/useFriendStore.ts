import { create } from "zustand";
import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";

export const useFriendStore = create<FriendState>()((set) => ({
  pendingRequests: [],
  loading: false,

  fetchPendingRequests: async () => {
    try {
      const pendingRequests = await friendService.fetchPending();
      set({ pendingRequests });
    } catch (err) {
      console.log("Failed to fetch pending requests", err);
    }
  },

  acceptFriendRequest: async (friendshipId) => {
    try {
      await friendService.acceptRequest(friendshipId);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((r) => r.id !== friendshipId),
      }));
    } catch (err) {
      console.log("Failed to accept friend request", err);
    }
  },

  declineFriendRequest: async (friendshipId) => {
    try {
      await friendService.declineRequest(friendshipId);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((r) => r.id !== friendshipId),
      }));
    } catch (err) {
      console.log("Failed to decline friend request", err);
    }
  },

  
}));
