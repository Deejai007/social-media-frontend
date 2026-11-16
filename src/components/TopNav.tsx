import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "redux/store/store";
import { IoSearchSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const TopNav: React.FC = () => {
  const pendingRequestCount = useSelector(
    (state: RootState) => state.follow.pendingRequests?.length ?? 0,
  );

  return (
    <nav className="bg-gray-50 border-b-2 border-gray-300 border-bottom z-20 fixed h-16 w-full">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-3">
        <Link
          to="/home"
          className="flex items-center space-x-3 rtl:space-x-reverse -ml-8 md:-ml-4"
        >
          <img src="public/assets/logo.png" className="h-8 -mr-2" alt="Logo" />
          <span className="font-sevillana text-4xl font-semibold ">treiwo</span>
        </Link>
        <div className="relative mx-auto text-gray-600 md:block hidden">
          <input
            className="border-2 border-gray-300 w-72 bg-white h-10 pl-2 pr-8 rounded-xl text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search for people, posts, hashtags"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 mt-2 mr-2 text-2xl"
          >
            <IoSearchSharp />
          </button>
        </div>
        <Link
          to="/notifications"
          aria-label={`Follow requests${
            pendingRequestCount ? `, ${pendingRequestCount} pending` : ""
          }`}
          className="relative mr-3 inline-flex size-10 items-center justify-center rounded-full text-2xl text-gray-700 hover:bg-gray-200"
        >
          <FaUser aria-hidden="true" />
          {pendingRequestCount > 0 && (
            <span
              className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white"
              aria-hidden="true"
            >
              {pendingRequestCount > 99 ? "99+" : pendingRequestCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};
export default TopNav;
// home
// followers
// setting
// notification
// messagees
// create post
// profile
