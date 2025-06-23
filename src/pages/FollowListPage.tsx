import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store/store";
import { getFollowList } from "redux/actions/FollowActions";
import { ThreeDots } from "react-loader-spinner";

const FollowListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userId, mode } = useParams<{
    userId: string;
    mode: "followers" | "followings";
  }>();
  const user = useSelector((state: RootState) => state.user);
  const followList = user.followList || [];
  const loading = user.loading;
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    if (userId && mode) {
      dispatch(getFollowList({ userId, mode }));
    }
  }, [userId, mode, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDots
          visible={true}
          height="48"
          width="72"
          color="dark"
          radius="48"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  return (
    <div className="max-w-screen h-[calc(100vh-65px)] rounded shadow-md max-w-4xl">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={() => window.history.back()}
          aria-label="Back"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          <img
            src={user.user.profileImage || "/default-profile.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-lg text-gray-800">
            {user.user.username || "User"}
          </span>
        </div>
        <div className="w-6" /> {/* Spacer to balance the back button */}
      </div>
      <div className="flex justify-around p-4 bord  er-b">
        <button
          className={`w-full py-2 text-sm font-semibold text-center rounded-t-lg ${
            activeTab === "general"
              ? "text-secondary border-blue-500 border-b-2 bg-gray-200"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("general")}
        >
          Followers
        </button>
        <button
          className={`w-full py-2 text-sm font-semibold text-center rounded-t-lg ${
            activeTab === "requests"
              ? "text-secondary border-blue-500 border-b-2 bg-gray-200"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Following
        </button>
      </div>
      <div className="p-4">
        {activeTab === "general" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <ThreeDots
                  visible={true}
                  height="48"
                  width="72"
                  color="dark"
                  radius="48"
                  ariaLabel="three-dots-loading"
                />
              </div>
            ) : (
              <div>f</div>
            )}
          </div>
        )}
        {activeTab === "requests" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <ThreeDots
                  visible={true}
                  height="48"
                  width="72"
                  color="dark"
                  radius="48"
                  ariaLabel="three-dots-loading"
                />
              </div>
            ) : (
              <div>d</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowListPage;
