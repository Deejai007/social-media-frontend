import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { AppDispatch, RootState } from "redux/store/store";
import {
  fetchNotifications,
  markNotificationRead,
} from "redux/actions/NotificationActions";

const GeneralNotifications: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, loading, error, markingNotificationId } = useSelector(
    (state: RootState) =>
      state.notifications ?? {
        items: [],
        loading: false,
        error: null,
        markingNotificationId: null,
      },
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (loading && !items.length) {
    return (
      <div className="flex justify-center p-8" role="status">
        <ThreeDots
          visible
          height="48"
          width="72"
          color="dark"
          radius="48"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  if (error && !items.length) {
    return (
      <div className="flex flex-col items-center gap-3 p-8">
        <p role="alert">{error}</p>
        <button
          className="underline"
          onClick={() => dispatch(fetchNotifications())}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="p-8 text-center text-gray-600">
        No general notifications yet.
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p className="p-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {items.map((notification) => (
        <article
          key={notification.id}
          className={`flex items-center gap-3 border-b p-4 ${
            notification.isRead ? "bg-white" : "bg-blue-50"
          }`}
        >
          <img
            className="size-10 rounded-full object-cover"
            src={
              notification.actor.profileImage ||
              "https://cdn.vectorstock.com/i/500p/04/09/user-icon-vector-5770409.jpg"
            }
            alt=""
          />
          <p className="min-w-0 flex-1">
            <Link
              className="font-semibold"
              to={`/profile/${notification.actor.username}`}
            >
              {notification.actor.username || "Someone"}
            </Link>{" "}
            {notification.type === "new_follower"
              ? "started following you."
              : "liked your post."}
            <time className="mt-1 block text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </time>
          </p>
          {notification.type === "post_like" && notification.post && (
            <Link
              to={`/post/${notification.post.id}`}
              aria-label="View liked post"
            >
              <img
                className="size-12 rounded object-cover"
                src={notification.post.media || ""}
                alt=""
              />
            </Link>
          )}
          {!notification.isRead && (
            <button
              className="text-sm underline"
              disabled={markingNotificationId === notification.id}
              onClick={() => dispatch(markNotificationRead(notification.id))}
            >
              {markingNotificationId === notification.id
                ? "Saving..."
                : "Mark read"}
            </button>
          )}
        </article>
      ))}
    </div>
  );
};

export default GeneralNotifications;
