import FollowRequests from "components/FollowRequests";
import GeneralNotifications from "components/GeneralNotifications";
import React, { useState } from "react";

const Notifications: React.FC = () => {
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
        {activeTab === "general" && <GeneralNotifications />}
        {activeTab === "requests" && (
          <div>
            <FollowRequests />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
