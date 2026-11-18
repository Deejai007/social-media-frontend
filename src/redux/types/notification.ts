export interface NotificationItem {
  id: number;
  type: "new_follower" | "post_like";
  isRead: boolean;
  createdAt: string;
  actor: {
    id: number;
    username: string | null;
    profileImage: string | null;
  };
  post?: {
    id: number;
    media: string | null;
  } | null;
}

export interface NotificationState {
  items: NotificationItem[];
  loading: boolean;
  error: string | null;
  markingNotificationId: number | null;
}
