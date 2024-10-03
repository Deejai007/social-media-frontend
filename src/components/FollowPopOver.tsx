import { AppDispatch, RootState } from "../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

import { ThreeDots } from "react-loader-spinner";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import React from "react";

interface PopoverProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popover: React.FC<PopoverProps> = ({ isOpen, setIsOpen }) => {
  const dispatch: AppDispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const postLoading = useSelector((state: RootState) => state.post.loading);
  const followLoading = useSelector((state: RootState) => state.follow.loading);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute z-20 ">
      {/* Button to open popover */}
      {/* <button
        onClick={togglePopover}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Open Popover
      </button> */}

      {/* Background overlay with blur */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      )}

      {/* Sliding popover dialog */}
      <div className="">
        <Transition
          show={isOpen}
          // show={true}
          enter="transition-transform duration-500"
          enterFrom="translate-y-96"
          enterTo="translate-y-0"
          leave="transition-transform duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-96"
          // className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg"
          // style={{ height: "50vh" }}
        >
          <div className="absolute h-full p-4 ml-[50vw]  transform  -translate-x-1/2 translate-y-1/2 md:ml-96">
            {/* Popover content */}
            <div className="text-center mt-8 w-40 bg-white p-8 min-w-96  rounded-3xl min-h-96">
              <div className="flex justify-between items-center flex-row pb-2 border-b-2 ">
                <h2 className="text-lg font-bold pl-4">Followerss</h2>
                <button
                  onClick={togglePopover}
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  <IoMdClose />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default Popover;
