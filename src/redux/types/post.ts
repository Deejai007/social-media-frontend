export interface Post {
  id: number | null;
  userId: number | null;
  media: string | null;
  location: string | null;
  createdAt: string | null;
  likes: number | 0;
  isLikedByCurrentUser: boolean;
}
export interface PostState {
  posts: Array<Post>;
  loading: boolean | false;
  error: string | null;
}
