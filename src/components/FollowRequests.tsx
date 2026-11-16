import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { AppDispatch, RootState } from "../redux/store/store";
import {
  acceptFollowRequest,
  RejectFollowRequest,
} from "redux/actions/FollowActions";
import { toast } from "react-toastify";

const FollowRequests: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const requests = useSelector(
    (state: RootState) => state.follow.pendingRequests ?? [],
  );
  const followLoading = useSelector(
    (state: RootState) => state.follow.pendingRequestsLoading,
  );
  const followError = useSelector(
    (state: RootState) => state.follow.pendingRequestsError,
  );

  const handleAccept = async (id: string) => {
    const result = await dispatch(acceptFollowRequest(id));
    if (
      !acceptFollowRequest.fulfilled.match(result) ||
      !result.payload.success
    ) {
      toast.error("Unable to accept follow request. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    const result = await dispatch(RejectFollowRequest(id));
    if (
      !RejectFollowRequest.fulfilled.match(result) ||
      !result.payload.success
    ) {
      toast.error("Unable to remove follow request. Please try again.");
    }
  };

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
      {followError && (
        <p className="p-3 text-sm text-red-600" role="alert">
          {followError}
        </p>
      )}
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
                onClick={() =>
                  item.followerId && handleAccept(String(item.followerId))
                }
                className="px-2 py-1 rounded bg-primary text-sm m-4"
              >
                Accept
              </button>
              <button
                onClick={() =>
                  item.followerId && handleReject(String(item.followerId))
                }
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
