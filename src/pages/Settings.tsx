import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { AppDispatch, RootState } from "redux/store/store";
import { createPost } from "../redux/actions/PostActions";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import FollowRequests from "components/FollowRequests";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { SiTicktick } from "react-icons/si";
import { FiUpload } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { logout } from "redux/actions/userActions";

const Settings: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  // const userId = useSelector((state: RootState) => state.user.user.id);

  // const [activeTab, setActiveTab] = useState("requests");
  const [activeTab, setActiveTab] = useState("general");
  const handleLogout = async () => {
    await dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="max-w-screen h-[calc(100vh-65px)]  ">
      <div className="container mx-auto p-4">
        <div className="border-b border-gray-200 flex flex-row justify-between">
          <nav className="flex space-x-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "general"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </nav>
          <button
            className="md:mr-[24%] flex flex-row items-center gap-2 bg-red-200 px-3 rounded-xl mb-1"
            onClick={handleLogout}
          >
            logout
            <span className="text-red-700 text-lg">
              <IoIosLogOut />
            </span>
          </button>
        </div>
        <div className="mt-6">
          {activeTab === "general" && (
            <div>
              <h2 className="text-xl font-semibold">General Settings</h2>
              <p className="mt-4">general settings content.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold">Profile Settings</h2>

              <p className="mt-4"> profile settings content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
