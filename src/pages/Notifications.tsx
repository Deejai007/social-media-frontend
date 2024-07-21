import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FiUpload } from "react-icons/fi";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { RxCross2 } from "react-icons/rx";
import { BsEmojiSmile } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";

import { AppDispatch, RootState } from "redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/actions/PostActions";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import FollowRequests from "components/FollowRequests";

const Notifications: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.user.id);

  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="max-w-screen h-[calc(100vh-65px)]  rounded shadow-md max-w-4xl ">
      <div className="flex justify-around p-4 border-b">
        <button
          className={`w-full py-2 text-sm font-semibold text-center rounded-t-lg ${
            activeTab === "general"
              ? "text-secondary border-blue-500 border-b-2 bg-gray-200"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Notifications
        </button>
        <button
          className={`w-full py-2 text-sm font-semibold text-center rounded-t-lg ${
            activeTab === "requests"
              ? "text-secondary border-blue-500 border-b-2 bg-gray-200"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Follow Requests
        </button>
      </div>
      <div className="p-4">
        {activeTab === "general" && <div>g</div>}
        {activeTab === "requests" && (
          <div>
            <FollowRequests userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
