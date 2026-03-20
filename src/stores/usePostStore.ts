import { postService } from "@/services/postService";
import type { PostState } from "@/types/store";
import { create } from "zustand";

export const usePostService = create<PostState>()((set) => ({
  postsData: [],
  deletePostLoading: false,

  fetchAllPostsData: async () => {
    try {
      const postsData = await postService.fetchAllPostsData();
      set({ postsData });
    } catch (err) {
      console.log("Failed to fetch all posts data", err);
      throw err;
    }
  },

  newPost: async (content, user, image_urls) => {
    try {
      const createdPost = await postService.newPost(content, user, image_urls);
      set((state) => ({
        postsData: [createdPost, ...state.postsData],
      }));
    } catch (err) {
      console.log("Failed to create a new post", err);
      throw err;
    }
  },

  deletePost: async (post_id) => {
    try {
      set({ deletePostLoading: true });
      await postService.deletePost(post_id);
      set((state) => ({
        postsData: state.postsData.filter((post) => post.post_id !== post_id),
      }));
    } catch (err) {
      console.log("Failed to delete post", err);
      throw err;
    } finally {
      set({ deletePostLoading: false });
    }
  },
}));
