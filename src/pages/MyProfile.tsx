import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { getUserPosts } from "../redux/actions/PostActions";
import { getUserProfile } from "../redux/actions/userActions";
import { ThreeDots } from "react-loader-spinner";
import { IoMdGrid } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";
import FollowPopOver from "../components/FollowPopOver";

const MyProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const postLoading = useSelector((state: RootState) => state.post.loading);
  const [posts, setPosts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    username: "",
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
    bio: "",
    profileImage: "",
    id: "",
  });
  const [isFollowerListOpen, setIsFollowerListOpen] = useState(false);

  const openFollowerDialog = () => {
    if (profileData.followerCount) setIsFollowerListOpen(true);
  };

  const getProfileData = async () => {
    try {
      const result = await dispatch(getUserProfile(User.user.username));
      if (result.payload.success) {
        setProfileData(result.payload.data.user);
      } else {
        console.log(result.payload.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      const result = await dispatch(
        getUserPosts({ userId: profileData.id, limit: 9, offset: 0 }),
      );
      if (result.payload.success) {
        setPosts(result.payload.data);
      } else {
        console.log(result.payload.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    if (profileData.id) {
      getPosts();
    }
  }, [profileData]);

  return (
    <main className="bg-gray-100 max-w-4xl">
      <FollowPopOver
        isOpen={isFollowerListOpen}
        setIsOpen={setIsFollowerListOpen}
      />
      <div className="mb-8 py-8 2md:px-12">
        <div className="flex flex-wrap items-center px-8 md:py-8">
          <div>
            <img
              className="md:w-44 md:h-44 w-24 h-24 rounded-full"
              src={
                profileData.profileImage ||
                "https://cdn.vectorstock.com/i/500p/04/09/user-icon-vector-5770409.jpg"
              }
              alt="profile"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-3xl inline-block font-light md:mr-2 mb-2">
              {profileData.username}
            </h2>
            <button className="bg-secondary px-2 py-1 text-white font-semibold text-sm rounded flex justify-center items-center">
              <FaUserEdit /> &nbsp; Edit Profile
            </button>
          </div>
        </div>
        <section className="posts">
          <h1 className="text-lg font-semibold py-2 flex items-center">
            <IoMdGrid /> Recent Activity
          </h1>
          <div className="grid grid-cols-3">
            {posts.length ? (
              posts.map((item) => (
                <div
                  key={item.id}
                  className="relative grid-span-1 border-2 border-gray-300"
                >
                  <img
                    src={item.media}
                    alt="post"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              ))
            ) : (
              <div>No posts yet...</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyProfile;
