import api from "@/lib/axios";
import type {
  Post,
  PostComment,
  PostLike,
  PostLikeSummary,
} from "@/types/post";
import type { User } from "@/types/user";

type RawUserSummary =
  | {
      username?: string | null;
      avatar?: string | null;
    }
  | null
  | undefined;

type RawPost = {
  post_id: string;
  user_id: string;
  content?: string | null;
  created_at?: string | null;
  likes?: number | null;
  image_urls?: string[] | null;
  users?: RawUserSummary;
  post_images?:
    | {
        image_url?: string | null;
        position?: number | null;
      }[]
    | null;
};

type RawPostComment = {
  comment_id: string;
  post_id: string;
  user_id: string;
  content?: string | null;
  created_at?: string | null;
  user?: RawUserSummary;
  users?: RawUserSummary;
};

type RawPostLike = {
  user_id: string;
  users?: RawUserSummary;
};

const mapPostImageUrls = (post: RawPost): string[] => {
  if (post.post_images?.length) {
    return [...post.post_images]
      .sort((left, right) => (left.position ?? 0) - (right.position ?? 0))
      .map((image) => image.image_url ?? "")
      .filter(Boolean);
  }
  return post.image_urls?.filter(Boolean) ?? [];
};

const mapPost = (post: RawPost, fallbackUser?: User): Post => ({
  post_id: post.post_id,
  user_id: post.user_id,
  content: post.content ?? "",
  users: {
    username: post.users?.username ?? fallbackUser?.username ?? "Unknown user",
    avatar: post.users?.avatar ?? fallbackUser?.avatar ?? undefined,
  },
  created_at: post.created_at ?? new Date().toISOString(),
  likes: post.likes ?? 0,
  image_urls: mapPostImageUrls(post),
});

export const mapComment = (
  comment: RawPostComment,
  currentUser: User,
  userLookup: Record<string, { username: string; avatar?: string }>,
): PostComment => {
  const commentAuthor =
    comment.user_id === currentUser.user_id
      ? currentUser
      : userLookup[comment.user_id];
  const mappedUser = comment.user ?? comment.users;

  return {
    comment_id: comment.comment_id,
    post_id: comment.post_id,
    user_id: comment.user_id,
    content: comment.content ?? "",
    created_at: comment.created_at ?? new Date().toISOString(),
    user: {
      username:
        commentAuthor?.username ?? mappedUser?.username ?? "Unknown user",
      avatar: commentAuthor?.avatar ?? mappedUser?.avatar ?? undefined,
    },
  };
};

const mapPostLike = (like: RawPostLike): PostLike => ({
  user_id: like.user_id,
  user: {
    username: like.users?.username ?? "Unknown user",
    avatar: like.users?.avatar ?? undefined,
  },
});

const fetchPostLikesSummary = async (
  post_id: string,
  currentUserId: string,
): Promise<PostLikeSummary> => {
  const res = await api.get<RawPostLike[]>(`/posts/${post_id}/likes`);
  const likes = res.data.map(mapPostLike);

  return {
    likes,
    count: likes.length,
    liked: likes.some((like) => like.user_id === currentUserId),
  };
};

export const postService = {
  fetchAllPostsData: async () => {
    const res = await api.get<RawPost[]>("/posts");
    return res.data.map((post) => mapPost(post));
  },

  newPost: async (content: string, user: User, image_urls?: string[]) => {
    const res = await api.post<RawPost>("/protected/posts", {
      content,
      title: content.trim().slice(0, 80) || null,
      image_urls: image_urls ?? [],
    });
    const post = mapPost(res.data, user);
    if (post.image_urls.length === 0 && image_urls?.length) {
      post.image_urls = image_urls;
    }
    return post;
  },

  deletePost: async (post_id: string) => {
    await api.delete(`/protected/posts/${post_id}`);
  },

  fetchAllPostComments: async (
    post_id: string,
    currentUser: User,
    userLookup: Record<string, { username: string; avatar?: string }>,
  ) => {
    const res = await api.get<RawPostComment[]>(`/posts/${post_id}/comments`);
    return res.data.map((comment) =>
      mapComment(comment, currentUser, userLookup),
    );
  },

  createPostComment: async (
    post_id: string,
    content: string,
    currentUser: User,
    userLookup: Record<string, { username: string; avatar?: string }>,
  ) => {
    const res = await api.post<RawPostComment>(
      `/protected/posts/${post_id}/comments`,
      { content },
    );
    return mapComment(res.data, currentUser, userLookup);
  },

  deletePostComment: async (comment_id: string) => {
    await api.delete(`/protected/comments/${comment_id}`);
  },

  fetchPostLikes: async (post_id: string, currentUserId: string) =>
    fetchPostLikesSummary(post_id, currentUserId),

  togglePostLike: async (post_id: string, currentUserId: string) => {
    await api.post(`/protected/posts/${post_id}/like`);
    return fetchPostLikesSummary(post_id, currentUserId);
  },
};
