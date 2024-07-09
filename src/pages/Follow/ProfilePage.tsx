import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { getUserProfile } from "../../redux/actions/userActions";
import { AppDispatch, RootState } from "../../redux/store/store";

interface ProfileData {
  username: string;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
  bio?: string;
}
const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  console.log(username);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.user.loading);

  const getData = async () => {
    if (username) {
      const result = await dispatch(getUserProfile(username));

      if (result.payload.success) {
        console.log(result.payload.data.user);
        setProfileData(result.payload.data.user);
      } else {
        console.log(result.payload.message);
      }
    }
  };

  useEffect(() => {
    getData();
    console.log(User);
  }, []);

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
    <main className="bg-gray-100 bg-opacity-25">
      <div className="lg:w-8/12 lg:mx-auto mb-8">
        <header className="flex flex-wrap items-center p-4 md:py-8">
          <div className="md:w-3/12 md:ml-16">
            {/* profile image */}
            <img
              className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full aspect-square
               border-2  p-1"
              src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
              alt="profile"
            />
          </div>
          {/* profile meta */}
          <div className="w-8/12 md:w-7/12 ml-4">
            <div className="md:flex md:flex-wrap md:items-center mb-4">
              <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                {profileData.username}
              </h2>
              {/* badge */}
              <span
                className="inline-block fas fa-certificate fa-lg text-blue-500 
                         relative mr-6 text-xl transform -translate-y-2"
                aria-hidden="true"
              >
                <i
                  className="fas fa-check text-white text-xs absolute inset-x-0
                         ml-1 mt-px"
                />
              </span>
              {/* follow button */}
              <a
                href="#"
                className="bg-primary px-2 py-1 
                  text-white font-semibold text-sm rounded block text-center 
                  sm:inline-block block"
              >
                Follow
              </a>
            </div>
            {/* post, following, followers list for medium screens */}
            <ul className="hidden md:flex space-x-8 mb-4">
              <li>
                <span className="font-semibold text-lg">
                  {profileData.postCount || 0}
                </span>
                &nbsp; posts
              </li>
              <li>
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
            {/* user meta form medium screens */}
            <div className="hidden md:block">{profileData.bio}</div>
          </div>
          {/* user meta form small screens */}
          <div className="md:hidden text-sm my-2">{profileData.bio}</div>
        </header>
        {/* posts */}
        <div className="px-px md:px-3">
          {/* user following for mobile only */}
          <ul
            className="flex md:hidden justify-around space-x-8 
          text-center p-2 text-gray-600 leading-snug text-sm"
          >
            <li>
              <span className="font-semibold text-gray-800 block text-lg">
                {profileData.postCount || 0}
              </span>
              posts
            </li>
            <li>
              <span className="font-semibold text-gray-800 block text-lg">
                {" "}
                {profileData.followerCount}
              </span>
              followers
            </li>
            <li>
              <span className="font-semibold text-gray-800 block text-lg">
                {" "}
                {profileData.followingCount}
              </span>
              following
            </li>
          </ul>
          <hr className="h-2px my-8 bg-gray-200 border-0 g-gray-700"></hr>
          {/* insta freatures */}
          <h2>Posts</h2>
          {/* flexbox grid */}
          <div className="flex flex-wrap -mx-px md:-mx-3">
            {/* column */}
            <div className="w-1/3 p-px md:px-3">
              {/* post 1*/}
              <a href="#">
                <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                  {/* post image*/}
                  <img
                    className="w-full h-full absolute left-0 top-0 object-cover"
                    src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />
                  <i className="fas fa-square absolute right-0 top-0 m-1" />
                  {/* overlay*/}
                  <div
                    className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute 
                          left-0 top-0 hidden"
                  >
                    <div
                      className="flex justify-center items-center 
                              space-x-4 h-full"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart" />
                        412K
                      </span>
                      <span className="p-2">
                        <i className="fas fa-comment" />
                        2,909
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>
            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                {/* post 2 */}
                <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                  <img
                    className="w-full h-full absolute left-0 top-0 object-cover"
                    src="https://images.unsplash.com/photo-1498409570040-05bf6d3dd5b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />
                  {/* overlay*/}
                  <div
                    className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute 
                          left-0 top-0 hidden"
                  >
                    <div
                      className="flex justify-center items-center 
                              space-x-4 h-full"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart" />
                        412K
                      </span>
                      <span className="p-2">
                        <i className="fas fa-comment" />
                        1,993
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>
            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                <article className="post bg-gray-100 text-white relative pb-full  md:mb-6">
                  <img
                    className="w-full h-full absolute left-0 top-0 object-cover"
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />
                  {/* overlay*/}
                  <div
                    className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute 
                          left-0 top-0 hidden"
                  >
                    <div
                      className="flex justify-center items-center 
                              space-x-4 h-full"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart" />
                        112K
                      </span>
                      <span className="p-2">
                        <i className="fas fa-comment" />
                        2,090
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>
            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                  <img
                    className="w-full h-full absolute left-0 top-0 object-cover"
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />
                  <i className="fas fa-video absolute right-0 top-0 m-1" />
                  {/* overlay*/}
                  <div
                    className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute 
                          left-0 top-0 hidden"
                  >
                    <div
                      className="flex justify-center items-center 
                              space-x-4 h-full"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart" />
                        841K
                      </span>
                      <span className="p-2">
                        <i className="fas fa-comment" />
                        909
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>
            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                  <img
                    className="w-full h-full absolute left-0 top-0 object-cover"
                    src="https://images.unsplash.com/photo-1475688621402-4257c812d6db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"
                    alt="image"
                  />
                  {/* overlay*/}
                  <div
                    className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute 
                          left-0 top-0 hidden"
                  >
                    <div
                      className="flex justify-center items-center 
                              space-x-4 h-full"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart" />
                        120K
                      </span>
                      <span className="p-2">
                        <i className="fas fa-comment" />
                        3,909
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ProfilePage;
