export interface Post {
  id: number | null;
  userId: number | null;
  media: string | null;
  caption: string | null;
  location: string | null;
  profileImage: string | null;
  isPrivate: boolean | false;
  username: string | null;
  createdAt: Date | null;
  likeCount: number | 0;
  isLikedByCurrentUser: boolean;
}
export interface PostState {
  posts: Array<Post>;
  loading: boolean | false;
  error: string | null;
}
