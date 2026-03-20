import { create } from "zustand";
import { notificationService } from "@/services/notificationService";
import type { NotificationState } from "@/types/store";

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
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
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
      }));
    } catch (err) {
      console.log("Failed to mark all read", err);
    }
  },
}));
