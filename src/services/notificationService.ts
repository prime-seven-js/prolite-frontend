import api from "@/lib/axios";
import type { Notification } from "@/types/notification";

/**
 * Notification Service — fetch và quản lý trạng thái notifications.
 */
export const notificationService = {
  fetchNotifications: async (): Promise<Notification[]> => {
    const res = await api.get<Notification[]>("/protected/notifications");
    return res.data;
  },

  markAllRead: async (): Promise<void> => {
    await api.put("/protected/notifications/read-all");
  },
};
