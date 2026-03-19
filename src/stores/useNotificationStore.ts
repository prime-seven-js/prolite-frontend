import { create } from "zustand";
import { notificationService } from "@/services/notificationService";
import { friendService } from "@/services/friendService";
import type { NotificationState } from "@/types/store";

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  pendingRequests: [],
  loading: false,

  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const notifications = await notificationService.fetchNotifications();
      set({ notifications });
    } catch (err) {
      console.log("Failed to fetch notifications", err);
    } finally {
      set({ loading: false });
    }
  },

  markAllRead: async () => {
    try {
      await notificationService.markAllRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      }));
    } catch (err) {
      console.log("Failed to mark all read", err);
    }
  },

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
