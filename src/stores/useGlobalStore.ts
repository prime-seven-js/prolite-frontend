import { globalService } from "@/services/globalService";
import type { GlobalState } from "@/types/store";
import { create } from "zustand";

export const useGlobalStore = create<GlobalState>()((set) => ({
  usersData: [],
  loading: false,

  fetchAllUsersData: async () => {
    try {
      set({ loading: true });
      const usersData = await globalService.fetchAllUsersData();
      set({ usersData });
    } catch (err) {
      console.log("Failed to fetch all users data", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
