export interface SavedPost {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  posts: {
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    gif_url: string | null;
    created_at: string;
    profiles: {
      id: string;
      full_name: string | null;
      username?: string | null;
      avatar_url: string | null;
      is_verified: boolean | null;
    } | null;
  };
  like_count: number;
  comment_count: number;
  share_count: number;
  is_liked: boolean;
}
