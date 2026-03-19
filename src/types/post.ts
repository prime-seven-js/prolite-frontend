export interface Post {
  post_id: string;
  user_id: string;
  content: string;
  users: { username: string; avatar?: string };
  created_at: string;
  likes: number;
  image_urls: string[];
}

export interface PostComment {
  comment_id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: { username: string; avatar?: string };
}

export interface PostLike {
  user_id: string;
  user: { username: string; avatar?: string };
}

export interface PostLikeSummary {
  likes: PostLike[];
  count: number;
  liked: boolean;
}
