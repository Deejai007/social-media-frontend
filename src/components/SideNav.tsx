import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RiMenuFill } from "react-icons/ri";

import { RootState } from "redux/store/store";
import { Link } from "react-router-dom";
// import CreatePost from "./CreatePost";

const SideNav: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  // const [createOpen, setCreateOpen] = useState(false);
  const [isSelected, setIsSelected] = useState("");

  // const handleCreateOpen = () => {
  //   console.log("hi");
  //   setCreateOpen(!createOpen);
  // };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (item: string) => {
    setIsSelected(item);
    if (isOpen) {
      setIsOpen(false);
    }
  };
  // console.log(user);

  return (
    <div>
      {/* <CreatePost createOpen={createOpen} setCreateOpen={setCreateOpen} /> */}
      Trwi
      <aside className="z-10 ">
        {/* blur window */}
        <div
          className={` ${
            isOpen ? "" : "hidden"
          } w-full h-full backdrop-blur-md bg-blue/50 opacity-80 absolute z-80 md:hidden`}
          onClick={toggleSidebar}
        ></div>
        {/* sidenav toggle button */}
        <button
          onClick={toggleSidebar}
          aria-controls="default-sidebar"
          type="button"
          className="fixed  right-4 md:hidden text-3xl z-[25]"
        >
          <RiMenuFill />
        </button>

        <div
          id="default-sidebar"
          className={`fixed top-0 left-0 w-64 h-screen transition-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 `}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-mainbg border-r-2 border-slate-300 flex flex-col justify-between">
            <ul className="space-y-2 font-medium pt-16 flex flex-col gap-2">
              <li>
                <Link
                  to="/home"
                  className={`flex items-center p-2  text-gray-900 rounded-lg ${
                    isSelected === "home" ? "bg-primary" : "bg-gray-300"
                  } hover:bg-primary group`}
                  onClick={() => handleSelection("home")}
                >
                  <span className="ms-3">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/profile/${user.user.username}`}
                  className={`flex items-center p-2 text-gray-900 rounded-lg ${
                    isSelected === "myprofile" ? "bg-primary" : "bg-gray-300"
                  } hover:bg-primary group`}
                  onClick={() => handleSelection("myprofile")}
                >
                  <span className="ms-3">My Profile</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className={`flex items-center p-2 text-gray-900 rounded-lg ${
                    isSelected == "messages" ? "bg-primary" : "bg-gray-300"
                  } hover:bg-primary group`}
                  onClick={() => handleSelection("")}
                >
                  <span className="ms-3">Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className={`flex items-center p-2 text-gray-900 rounded-lg ${
                    isSelected === "noti" ? "bg-primary" : "bg-gray-300"
                  } hover:bg-primary group`}
                  onClick={() => handleSelection("notifications")}
                >
                  <span className="ms-3">Notifications</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center p-2 text-gray-900 rounded-lg ${
                    isSelected === "settings" ? "bg-primary" : "bg-gray-300"
                  } hover:bg-primary group`}
                  onClick={() => handleSelection("settings")}
                >
                  <span className="ms-3">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className={`flex items-center p-2 text-gray-900 rounded-lg ${
                    isSelected === "create" ? "bg-primary" : "bg-gray-300"
                  } hover:bg-primary group`}
                  onClick={() => handleSelection("create")}
                >
                  <span className="ms-3">Create</span>
                </Link>
              </li>
              {/* <button 
                onClick={handleCreateOpen}
                className={`flex items-center p-2 text-gray-900 rounded-lg ${
                  isSelected === "create" ? "bg-primary" : "bg-gray-300"
                } hover:bg-primary group`}
              >
                <span className="ms-3">Create</span>
              </button> */}
            </ul>
            {/* Move the logout button to the bottom
            <button className=" p-2 mx-8 text-gray-900 rounded-lg hover:bg-red-400">
              Logout
            </button> */}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideNav;
