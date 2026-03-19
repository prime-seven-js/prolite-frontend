import api from "@/lib/axios";

export const globalService = {
  fetchAllUsersData: async () => {
    const res = await api.get(`/users`);
    return res.data;
  },
};
