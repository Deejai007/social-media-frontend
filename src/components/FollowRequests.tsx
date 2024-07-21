import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { AppDispatch, RootState } from "../redux/store/store";
import {
  acceptFollowRequest,
  getPendingRequests,
} from "redux/actions/FollowActions";

interface Props {
  userId: string | "";
}
interface Requests {
  followerId: string | null;
  followerProfileImage: string | null;
  followerUsername: string | null;
}

const FollowRequests: React.FC<Props> = ({ userId }) => {
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const followLoading = useSelector((state: RootState) => state.follow.loading);
  const [requests, setRequests] = useState<Requests[]>([]);

  const getData = async () => {
    try {
      if (userId) {
        const result = await dispatch(getPendingRequests());
        console.log(result);

        if (result.payload.success) {
          console.log(result.payload.data);
          setRequests(result.payload.data);
        } else {
          console.log(result.payload.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = async (id: string) => {
    console.log("accept");
    try {
      const result = await dispatch(acceptFollowRequest(id));
      console.log(result);

      if (result.payload.success) {
        console.log(result.payload.data);
        setRequests(result.payload.data);
      } else {
        console.log(result.payload.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleReject = () => {
    console.log("accept");
  };
  useEffect(() => {
    getData();
  }, []);

  if (followLoading) {
    return (
      <div className=" -my-32 flex items-center justify-center h-screen">
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
    <div>
      {requests.length ? (
        requests.map((item) => {
          return (
            <div
              key={item.followerId}
              className="h-12 w-80% max-w-96 border-b-2 border-gray-600 flex flex-row items-center ml-4"
            >
              <span className="">
                <img
                  className="w-10 h-10 rounded-full "
                  src={
                    item.followerProfileImage ||
                    "https://cdn.vectorstock.com/i/500p/04/09/user-icon-vector-5770409.jpg"
                  }
                  alt="profile"
                />
              </span>
              <span className="grow m-4">{item.followerUsername}</span>
              <button
                onClick={() => item.followerId && handleAccept(item.followerId)}
                className="px-2 py-1 rounded bg-primary text-sm m-4"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-2 py-1 rounded bg-gray-400 text-sm m-4"
              >
                Delete
              </button>
            </div>
          );
        })
      ) : (
        <div className="">
          <span className="flex items-center justify-center w-full h-48">
            No pending requests
          </span>
        </div>
      )}
    </div>
  );
};
export default FollowRequests;
