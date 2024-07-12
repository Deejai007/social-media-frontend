import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { AppDispatch, RootState } from "../redux/store/store";
import { FaUserEdit } from "react-icons/fa";
import { Post } from "redux/types/post";
import { CiLocationOn } from "react-icons/ci";

import {
  IoHeartOutline,
  IoPaperPlaneOutline,
  IoBookmarkOutline,
  IoEllipsisHorizontalSharp,
  IoChatbubbleOutline,
  IoHappyOutline,
  IoHeart,
} from "react-icons/io5";
import { getSinglePost } from "./../redux/actions/PostAcitons";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  console.log(postId);
  const [postData, setPostData] = useState<Post | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.post.loading);

  const getData = async () => {
    try {
      if (postId) {
        console.log("hi");

        const result = await dispatch(getSinglePost(postId));
        if (result.payload.success) {
          console.log(result.payload.data);

          setPostData(result.payload.data);
        } else {
          console.log(result.payload.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [postId]);

  if (loading) {
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

  if (!postData) {
    return <div>No post data available.</div>;
  }

  return (
    <main className="bg-white  xl:ml-36 lg:ml-16  border bg-white 2md:max-w-xl">
      <div className="flex items-center justify-between p-2.5">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-neutral-200 rounded-full">
            <img src={postData.profileImage ?? ""} className="rounded-full" />
          </div>
          <div className="ml-2.5">
            <p className="font-medium text-md">{postData.username}</p>
            <p className="text-sm flex flex-row justify-center items-center">
              <span>
                <CiLocationOn />
              </span>
              &nbsp;
              {postData.location}
            </p>
          </div>
        </div>
        <IoEllipsisHorizontalSharp className="text-lg mr-2 cursor-pointer" />
      </div>
      {/* <div className="w-full h-full bg-neutral-200 min-h-80 flex items-center justify-center max-h-xl">
        <img
          src={postData.media ?? ""}
          alt=""
          className="w-full  h-full max-h-xl max-w-xl  object-contain"
        />
      </div> */}
      <div className=" w-full  h-128 flex items-center justify-center bg-neutral-200">
        <img
          src={postData.media ?? ""}
          alt=""
          className="h-full object-contain"
        />
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-2xl">
          <div className="flex items-center space-x-4">
            {postData.isLikedByCurrentUser ? (
              <IoHeart className="cursor-pointer text-red-500 transition-all active:scale-75" />
            ) : (
              <IoHeartOutline className="cursor-pointer transition-all hover:opacity-50 active:scale-75" />
            )}
            <IoChatbubbleOutline className="cursor-pointer hover:opacity-50" />
            <IoPaperPlaneOutline className="cursor-pointer hover:opacity-50" />
          </div>
          <IoBookmarkOutline className="cursor-pointer hover:opacity-50" />
        </div>
        <div className="text-sm my-2">
          <pre>{postData.caption}</pre>
        </div>
        <p
          className="my-2 text-neutral-400 text-sm uppercase"
          style={{ fontSize: 12 }}
        >
          {new Date(postData.createdAt!).toLocaleString()}
        </p>
      </div>
      {/* <div className="border-t p-3 text-sm flex items-center justify-between space-x-3">
        <IoHappyOutline className="text-2xl" />
        <input
          type="text"
          className="outline-none block flex-1"
          placeholder="Add a comment"
        />
        <div className="text-blue-400 font-bold mr-1 cursor-pointer">Post</div>
      </div> */}
      {/* </div> */}
    </main>
  );
};

export default PostPage;
