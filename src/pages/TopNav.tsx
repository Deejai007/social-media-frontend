import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "redux/store/store";
import { IoSearchSharp } from "react-icons/io5";

const TopNav: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <nav className="bg-gray-50 border-b-2 border-gray-300 border-bottom z-20 fixed h-16 w-full">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between  p-3">
        <Link
          to="/home"
          className="flex items-center space-x-3 rtl:space-x-reverse -ml-8 md:-ml-4"
        >
          <img src="public/assets/logo.png" className="h-8 -mr-2" alt="Logo" />
          <span className="font-sevillana text-4xl font-semibold ">treiwo</span>
        </Link>
        <div className="relative mx-auto text-gray-600 lg:block hidden">
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
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  ">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 "
                aria-current="page"
              >
                Hello
              </a>
            </li>
          </ul>
        </div>
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
