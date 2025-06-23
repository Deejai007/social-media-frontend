import {
  sendFollowRequest,
  unfollowUser,
  getFollowList,
} from "redux/actions/FollowActions";
import { getUserProfile } from "../redux/actions/userActions";
import { AppDispatch, RootState } from "../redux/store/store";
import { getUserPosts } from "redux/actions/PostActions";
import { useNavigate } from "react-router-dom";
import FollowPopOver from "../components/FollowPopOver";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import { IoMdGrid } from "react-icons/io";

interface ProfileData {
  username: string;
  postCount?: number;
  followerCount?: number;
  isFollowing?: string;
  followingCount?: number;
  bio?: string;
  profileImage?: string;
  id?: string;
}
interface Posts {
  posts: any[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const postLoading = useSelector((state: RootState) => state.post.loading);
  const followLoading = useSelector((state: RootState) => state.follow.loading);

  const { username } = useParams<{ username: string }>();
  const [offset, setOffset] = useState(0);
  const [isFollowerListOpen, setIsFollowerListOpen] = useState(false);
  const [isFollowingListOpen, setIsFollowingListOpen] = useState(false);
  const [followState, setFollowState] = useState(null);
  const [postsFinish, setPostsFinish] = useState(true); //to check if all posts are fetched then hide the load more button
  const [posts, setPosts] = useState<Posts>({ posts: [] });
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
    isFollowing: undefined,
    bio: "",
    profileImage: "",
    id: "",
  });

  const openFollowerDialog = async () => {
    if (profileData.followerCount && profileData.id) {
      navigate(`/follow-list/${profileData.id}/followers`);
    }
  };
  const openFollowingDialog = async () => {
    if (profileData.followingCount && profileData.id) {
      navigate(`/follow-list/${profileData.id}/followings`);
    }
  };

  const getProfileData = async () => {
    try {
      if (username) {
        const result = await dispatch(getUserProfile(username));

        if (result.payload.success) {
          console.log(result.payload.data);
          setProfileData(result.payload.data.user);
        } else {
          console.log(result.payload.message);
          // navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async (id: string) => {
    try {
      if (profileData) {
        const result = await dispatch(
          getUserPosts({
            userId: id,
            limit: 9,
            offset: offset,
          }),
        );
        if (result.payload.success) {
          console.log("Posts fetched: ", result.payload.data);
          if (result.payload.data.length < 9) setPostsFinish(false);
          setPosts((prevState) => ({
            posts: [...prevState.posts, ...result.payload.data],
          }));
          // console.log(posts);
        } else {
          console.log(result.payload.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    try {
      if (profileData.id) {
        const result = await dispatch(sendFollowRequest(profileData.id));
        if (result.payload.success) {
          // Update follow state and follower count
          setProfileData((prev) => ({
            ...prev,
            isFollowing: "pending",
          }));
          console.log(result.payload.data);
        } else {
          console.log(result.payload.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnfollow = async (mode: string) => {
    try {
      if (profileData.id) {
        const result = await dispatch(
          unfollowUser({ followingId: profileData.id, mode: mode }),
        );
        if (result.payload.success) {
          // Update follow state and follower count
          setProfileData((prev) => ({
            ...prev,
            isFollowing: undefined,
            followerCount: (prev.followerCount || 1) - 1,
          }));
        } else {
          console.log(result.payload.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMore = () => {
    let temp = offset + 9;
    setOffset(temp);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getProfileData();
    };
    fetchData();
  }, [username]);
  // useEffect(() => {
  //   // console.log("After==", followState.isFollowing);
  // }, [followState]);

  useEffect(() => {
    // console.log(User);
    if (profileData.id) {
      getPosts(profileData.id);
    }
  }, [profileData.id, offset]);

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
              {followLoading ? (
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
              ) : User.user.username == username ? (
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
                  className="bg-primary px-2 py-1 text-white font-semibold text-sm rounded text-center sm:inline-block"
                >
                  Follow
                </button>
              ) : profileData.isFollowing == "pending" ? (
                <button
                  onClick={() => handleUnfollow("reqCancel")}
                  className="bg-gray-700 px-2 py-1 
            text-white font-semibold text-sm rounded block text-center 
            sm:inline-block block"
                >
                  Follow request pending
                </button>
              ) : (
                <button
                  onClick={() => handleUnfollow("reqUnfollow")}
                  className="bg-primary px-2 py-1 
            text-white font-semibold text-sm rounded block text-center 
            sm:inline-block block"
                >
                  Unfollow
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
                onClick={() => openFollowerDialog()}
              >
                <span className="font-semibold text-lg">
                  {" "}
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

        <div className="px-px md:px-3 px-8">
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
            <li onClick={() => openFollowerDialog()}>
              <span className="font-semibold text-gray-800 block text-xl">
                {" "}
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
                    className=" relative grid-span-1 border-2 border-gray-300 "
                  >
                    <Link to={`/post/${item.id}`}>
                      {/* <div className="absolute w-full  hover:bg-black">hi</div> */}
                      <img
                        src={item.media}
                        alt="i"
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-lg font-bold">
                          {item.likeCount || "0"} Reactions
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full flex-col col-span-3 h-36">
                  <span className="">
                    <CiCamera />
                  </span>
                  No posts yet...
                </div>
              )}
              {postsFinish && (
                <div className="">
                  <button
                    className=" rounded-sm p-2 underline"
                    onClick={handleLoadMore}
                  >
                    {postLoading ? (
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
                    ) : (
                      "Load more.."
                    )}
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
