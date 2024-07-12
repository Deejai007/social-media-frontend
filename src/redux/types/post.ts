export interface Post {
  id: number | null;
  userId: number | null;
  media: string | null;
  caption: string | null;
  location: string | null;
  profileImage: string | null;
  username: string | null;
  createdAt: Date | null;
  likes: number | 0;
  isLikedByCurrentUser: boolean;
}
export interface PostState {
  posts: Array<Post>;
  loading: boolean | false;
  error: string | null;
}
