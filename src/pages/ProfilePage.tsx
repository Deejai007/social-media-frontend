import { sendFollowRequest, unfollowUser } from "redux/actions/FollowActions";
import { getUserProfile } from "../redux/actions/userActions";
import { AppDispatch, RootState } from "../redux/store/store";
import { getUserPosts } from "redux/actions/PostActions";
import { Post } from "redux/types/post";
import { useNavigate } from "react-router-dom";
import FollowPopOver from "../components/FollowPopOver";
import VibeBadge from "../components/VibeBadge";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { IoMdGrid } from "react-icons/io";
import { toast } from "react-toastify";

interface ProfileData {
  username: string;
  postCount?: number;
  followerCount?: number;
  isFollowing?: string;
  isFollowedByUser?: boolean;
  followingCount?: number;
  bio?: string;
  profileImage?: string;
  id?: string;
}
const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);

  const { username } = useParams<{ username: string }>();
  const [offset, setOffset] = useState(0);
  const [retryPostLoad, setRetryPostLoad] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [isFollowerListOpen, setIsFollowerListOpen] = useState(false);
  const [postsFinish, setPostsFinish] = useState(true); //to check if all posts are fetched then hide the load more button
  const [posts, setPosts] = useState<{ posts: Post[] }>({ posts: [] });
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
    isFollowing: undefined,
    isFollowedByUser: false,
    bio: "",
    profileImage: "",
    id: "",
  });

  const handleOpenFollower = async () => {
    if (profileData.followerCount && profileData.id) {
      navigate(`/follow-list/${profileData.id}/followers`);
    }
  };
  const handleFollow = async () => {
    if (!profileData.id || followActionLoading) return;
    setFollowActionLoading(true);
    try {
      const result = await dispatch(sendFollowRequest(profileData.id));
      if (sendFollowRequest.fulfilled.match(result) && result.payload.success) {
        setProfileData((prev) => ({ ...prev, isFollowing: "pending" }));
      } else {
        toast.error(
          result.payload?.message || "Unable to follow this user. Try again.",
        );
      }
    } catch (error) {
      toast.error("Unable to follow this user. Try again.");
    } finally {
      setFollowActionLoading(false);
    }
  };
  const handleUnfollow = async (mode: "reqCancel" | "reqUnfollow") => {
    if (!profileData.id || followActionLoading) return;
    const wasAccepted = profileData.isFollowing === "accepted";
    setFollowActionLoading(true);
    try {
      const result = await dispatch(
        unfollowUser({ followingId: profileData.id, mode }),
      );
      if (unfollowUser.fulfilled.match(result) && result.payload.success) {
        setProfileData((prev) => ({
          ...prev,
          isFollowing: undefined,
          followerCount: wasAccepted
            ? Math.max(0, (prev.followerCount || 0) - 1)
            : prev.followerCount,
        }));
      } else {
        toast.error(
          result.payload?.message ||
            "Unable to update follow status. Try again.",
        );
      }
    } catch (error) {
      toast.error("Unable to update follow status. Try again.");
    } finally {
      setFollowActionLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (postsLoading || !postsFinish) return;
    setOffset((currentOffset) => currentOffset + 9);
  };

  const retryLoadingPosts = () => {
    setPostsError(null);
    setRetryPostLoad((attempt) => attempt + 1);
  };

  useEffect(() => {
    let cancelled = false;
    setPosts({ posts: [] });
    setOffset(0);
    setPostsFinish(true);
    setPostsLoading(false);
    setPostsError(null);
    setProfileData({
      username: "",
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
      isFollowing: undefined,
      isFollowedByUser: false,
      bio: "",
      profileImage: "",
      id: "",
    });

    const fetchProfile = async () => {
      if (!username) return;
      try {
        const result = await dispatch(getUserProfile(username));
        if (cancelled) return;

        if (getUserProfile.fulfilled.match(result) && result.payload.success) {
          setProfileData(result.payload.data.user);
        } else if (getUserProfile.rejected.match(result)) {
          toast.error("Unable to load this profile.");
        } else {
          toast.error(result.payload.message || "Unable to load this profile.");
        }
      } catch (error) {
        if (!cancelled) toast.error("Unable to load this profile.");
      }
    };
    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [dispatch, username]);

  useEffect(() => {
    if (!profileData.id) return;

    let cancelled = false;
    const profileId = profileData.id;
    setPostsLoading(true);
    setPostsError(null);
    const fetchPosts = async () => {
      try {
        const result = await dispatch(
          getUserPosts({
            userId: profileId,
            limit: 9,
            offset,
          }),
        );
        if (cancelled) return;

        if (getUserPosts.fulfilled.match(result) && result.payload.success) {
          const fetchedPosts = result.payload.data;
          setPostsFinish(fetchedPosts.length >= 9);
          setPosts((current) => ({
            posts:
              offset === 0 ? fetchedPosts : [...current.posts, ...fetchedPosts],
          }));
        } else if (getUserPosts.rejected.match(result)) {
          setPostsError("Unable to load posts. Please try again.");
        } else {
          setPostsError(
            result.payload.message || "Unable to load posts. Please try again.",
          );
        }
      } catch (error) {
        if (!cancelled) {
          setPostsError("Unable to load posts. Please try again.");
        }
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    };
    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [dispatch, offset, profileData.id, retryPostLoad]);

  if (User.loading) {
    return (
      <div className=" -mt-16 flex items-center justify-center h-screen">
        <ThreeDots
          visible={true}
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

  return (
    <main className="bg-gray-100 max-w-4xl">
      {/* <FollowListModel modelOpen={modelOpen} setModelOpen={setModelOpen} /> */}
      <FollowPopOver
        isOpen={isFollowerListOpen}
        setIsOpen={setIsFollowerListOpen}
      />
      <div className=" mb-8 py-8  2md:px-12">
        <div className="flex flex-wrap items-center px-8 md:py-8">
          <div className="">
            {/* profile image */}
            <img
              className="md:w-44 md:h-44 w-24 h-24 rounded-full "
              src={
                profileData.profileImage ||
                "https://cdn.vectorstock.com/i/500p/04/09/user-icon-vector-5770409.jpg"
              }
              alt="profile"
            />
          </div>
          {/* profile meta */}
          <div className="ml-4">
            <div className="md:flex md:flex-wrap md:items-center mb-4">
              <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                {profileData.username || "User Not found"}
              </h2>
              {User.user?.username == username ? (
                <button
                  className="bg-secondary px-2 py-1 
              text-white font-semibold text-sm rounded flex justify-center items-center text-center 
            "
                >
                  <FaUserEdit /> &nbsp; Edit Profile
                </button>
              ) : profileData.isFollowing == null ? (
                <button
                  onClick={handleFollow}
                  disabled={followActionLoading}
                  className="bg-primary px-2 py-1 text-white font-semibold text-sm rounded text-center sm:inline-block"
                >
                  {followActionLoading
                    ? "Working..."
                    : profileData.isFollowedByUser
                      ? "Follow back"
                      : "Follow"}
                </button>
              ) : profileData.isFollowing == "pending" ? (
                <button
                  onClick={() => handleUnfollow("reqCancel")}
                  disabled={followActionLoading}
                  className="bg-gray-700 px-2 py-1 
            text-white font-semibold text-sm rounded block text-center 
            sm:inline-block block"
                >
                  {followActionLoading
                    ? "Working..."
                    : "Follow request pending"}
                </button>
              ) : (
                <button
                  onClick={() => handleUnfollow("reqUnfollow")}
                  disabled={followActionLoading}
                  className="bg-primary px-2 py-1 
            text-white font-semibold text-sm rounded block text-center 
            sm:inline-block block"
                >
                  {followActionLoading ? "Working..." : "Unfollow"}
                </button>
              )}
            </div>
            {/* post, following, followers list for medium screens */}
            <ul className="hidden md:flex space-x-8 mb-4">
              <li>
                <span className="font-semibold text-lg">
                  {profileData.postCount || 0}
                </span>
                &nbsp; posts
              </li>
              <li
                className="cursor-pointer "
                onClick={() => handleOpenFollower()}
              >
                <span className="font-semibold text-lg">
                  {/* desktop */}
                  {profileData.followerCount}
                </span>
                &nbsp; followers
              </li>
              <li>
                <span className="font-semibold text-lg">
                  {" "}
                  {profileData.followingCount}
                </span>
                &nbsp; following
              </li>
            </ul>
            <div className="hidden md:block">
              <pre>{profileData.bio}</pre>
            </div>
          </div>
        </div>
        {/* user following for mobile only */}
        <pre className="md:hidden text-md my-4 px-8">{profileData.bio}</pre>

        <div className="px-8 md:px-3">
          <ul
            className=" flex justify-center md:hidden space-x-12 
          text-center p-2 text-gray-600 leading-snug text-sm"
          >
            <li>
              <span className="font-semibold text-gray-800 block text-xl">
                {profileData.postCount || 0}
              </span>
              posts
            </li>
            <li onClick={() => handleOpenFollower()}>
              <span className="font-semibold text-gray-800 block text-xl">
                {/* mobile */}
                {profileData.followerCount}
              </span>
              followerm
            </li>
            <li>
              <span className="font-semibold text-gray-800 block text-xl">
                {profileData.followingCount}
              </span>
              following
            </li>
          </ul>
          <hr className="border border-1 border-gray-400 mt-4 mb-2"></hr>
          {/* posts */}
          <section className="posts">
            <h1 className="text-lg font-semibold py-2 flex items-center flex-row">
              <span>
                <IoMdGrid />
              </span>
              Recent Activity
            </h1>

            <div className="grid grid-cols-3">
              {posts.posts.length ? (
                posts.posts.map((item) => (
                  <div
                    key={item.id}
                    className={`relative grid-span-1 border-2 border-gray-300 ${
                      item.isPrivate
                        ? "border-purple-500 shadow-[0_0_8px_2px_rgba(168,85,247,0.15)]"
                        : ""
                    }`}
                  >
                    <Link to={`/post/${item.id}`}>
                      {/* Private badge overlay */}
                      {item.isPrivate && (
                        <span className="absolute top-2 right-2 z-10 bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                          Private
                        </span>
                      )}
                      {item.media ? (
                        <img
                          src={item.media}
                          alt={item.caption || "Post"}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center bg-purple-50 p-3 text-center text-sm text-gray-800">
                          {item.caption || "Text-only post"}
                        </div>
                      )}
                      <VibeBadge
                        vibeType={item.vibeType}
                        className="absolute left-2 top-2 z-10 px-2 py-1 text-[10px]"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-lg font-bold">
                          {item.likeCount || "0"} Reactions
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : postsLoading ? (
                <div className="col-span-3 flex h-36 items-center justify-center">
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
              ) : postsError ? (
                <div className="col-span-3 flex h-36 flex-col items-center justify-center gap-2">
                  <span role="alert">{postsError}</span>
                  <button className="underline" onClick={retryLoadingPosts}>
                    Retry
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full flex-col col-span-3 h-36">
                  <span className="">
                    <CiCamera />
                  </span>
                  No posts yet...
                </div>
              )}
              {posts.posts.length > 0 && postsError && (
                <div className="col-span-3 flex items-center justify-center gap-2">
                  <span role="alert">{postsError}</span>
                  <button className="underline" onClick={retryLoadingPosts}>
                    Retry
                  </button>
                </div>
              )}
              {postsFinish && posts.posts.length >= 9 && (
                <div className="">
                  <button
                    className=" rounded-sm p-2 underline"
                    onClick={handleLoadMore}
                    disabled={postsLoading}
                  >
                    {postsLoading ? "Loading..." : "Load more.."}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
export default ProfilePage;
