import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchFeed, likePost, unlikePost } from "redux/actions/PostActions";
import { updateFeedPostLike } from "redux/reducers/postReducer";
import { AppDispatch, RootState } from "redux/store/store";
import { Post } from "redux/types/post";

const PAGE_SIZE = 10;

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { feedPosts, feedLoading, feedError, feedHasMore } = useSelector(
    (state: RootState) => state.post,
  );
  const [likingPostId, setLikingPostId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchFeed({ limit: PAGE_SIZE, offset: 0 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchFeed({ limit: PAGE_SIZE, offset: feedPosts.length }));
  };

  const handleLike = async (post: Post) => {
    if (post.id === null || likingPostId !== null) return;

    const isLiked = Boolean(post.isLikedByUser || post.isLikedByCurrentUser);
    setLikingPostId(post.id);
    try {
      let succeeded = false;
      if (isLiked) {
        const result = await dispatch(unlikePost({ postId: String(post.id) }));
        succeeded =
          unlikePost.fulfilled.match(result) &&
          Boolean(result.payload?.success);
      } else {
        const result = await dispatch(likePost(String(post.id)));
        succeeded =
          likePost.fulfilled.match(result) && Boolean(result.payload?.success);
      }

      if (succeeded) {
        dispatch(
          updateFeedPostLike({
            postId: post.id,
            isLiked: !isLiked,
            likeCount: Math.max(0, post.likeCount + (isLiked ? -1 : 1)),
          }),
        );
      } else {
        toast.error("Unable to update the like. Please try again.");
      }
    } finally {
      setLikingPostId(null);
    }
  };

  if (feedLoading && feedPosts.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8" aria-live="polite">
        <p className="text-center text-gray-500">Loading your feed...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Your feed</h1>

      {feedError && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <span>{feedError}</span>
          <button
            type="button"
            className="font-semibold underline"
            onClick={() =>
              dispatch(
                fetchFeed({
                  limit: PAGE_SIZE,
                  offset: 0,
                }),
              )
            }
          >
            Try again
          </button>
        </div>
      )}

      {feedPosts.length === 0 && !feedLoading ? (
        <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">
            Your feed is waiting for its first post
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Share a post or follow people to see their posts here.
          </p>
          <Link
            to="/create"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 font-medium text-white"
          >
            Create a post
          </Link>
        </section>
      ) : (
        <section
          className="space-y-5"
          aria-label="Posts from you and people you follow"
        >
          {feedPosts.map((post) => {
            const isLiked = Boolean(
              post.isLikedByUser || post.isLikedByCurrentUser,
            );
            const postContent = (
              <>
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={
                      post.profileImage ||
                      "https://cdn.vectorstock.com/i/500p/04/09/user-icon-vector-5770409.jpg"
                    }
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    {post.username ? (
                      <Link
                        to={`/profile/${post.username}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {post.username}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        Treiwo user
                      </span>
                    )}
                    {post.location && (
                      <p className="flex items-center gap-1 text-sm text-gray-600">
                        <CiLocationOn aria-hidden="true" />
                        {post.location}
                      </p>
                    )}
                  </div>
                  {post.isPrivate && (
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                      Private
                    </span>
                  )}
                </div>

                {post.media && (
                  <img
                    src={post.media}
                    alt={post.caption || "Post"}
                    className="max-h-[70vh] w-full bg-gray-100 object-contain"
                  />
                )}

                <div className="p-4">
                  <button
                    type="button"
                    aria-label={isLiked ? "Unlike post" : "Like post"}
                    disabled={likingPostId !== null}
                    onClick={() => handleLike(post)}
                    className="mb-2 text-2xl text-red-600 disabled:opacity-50"
                  >
                    {isLiked ? <IoHeart /> : <IoHeartOutline />}
                  </button>
                  <p className="text-sm font-semibold">
                    {post.likeCount} likes
                  </p>
                  {post.caption && (
                    <p className="mt-2 whitespace-pre-wrap text-sm">
                      <span className="mr-2 font-semibold">
                        {post.username}
                      </span>
                      {post.caption}
                    </p>
                  )}
                  {post.createdAt && (
                    <time
                      dateTime={new Date(post.createdAt).toISOString()}
                      className="mt-3 block text-xs text-gray-500"
                    >
                      {new Date(post.createdAt).toLocaleString()}
                    </time>
                  )}
                  {post.id !== null && (
                    <Link
                      to={`/post/${post.id}`}
                      className="mt-3 inline-block text-sm text-gray-500 hover:underline"
                    >
                      View post
                    </Link>
                  )}
                </div>
              </>
            );

            return (
              <article
                key={post.id}
                className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
                  post.isPrivate ? "border-purple-300" : "border-gray-200"
                }`}
              >
                {post.id !== null ? (
                  postContent
                ) : (
                  <div className="p-4">{postContent}</div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {feedHasMore && feedPosts.length > 0 && (
        <div className="py-2 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={feedLoading}
            className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {feedLoading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
