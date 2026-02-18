import React, { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "redux/store/store";
import Nav from "../components/SideNav";
import { addUserData } from "redux/actions/userActions";

const CreateProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  const [usernameError, setUsernameError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "S ",
    username: "FF",
    location: "FF",
    bio: "KJKSD",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "bio" && value.length > 300) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "username") {
      setUsernameError(""); // clear error on typing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submit");
    const result = await dispatch(addUserData(formData));
    console.log(result);
    if (result.payload.success) {
      setUsernameError("");
      toast.success(result.payload.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/home");
    } else {
      if (result.payload.target === "username") {
        setUsernameError("Username is already taken");
        usernameRef.current?.focus();
      }

      toast.info(result.payload.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user.user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!user.user.verified) {
      console.log("not verified");
      navigate("/verify", { replace: true });
      return;
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div className="flex items-center p-4 justify-center -ml-8">
          <img src="public/assets/logo.png" alt="logo" className="h-8 pr-2" />
          <span className="font-sevillana text-4xl font-semibold">treiwo</span>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-lg p-4 px-4 md:p-8 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-2xl">Create profile</p>
                  <p>Complete your profile by adding details about you.</p>
                </div>

                <div className="md:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-2">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.firstName}
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        ref={usernameRef}
                        className={`h-10 border mt-1 rounded px-4 w-full bg-gray-50 ${
                          usernameError ? "border-red-500" : ""
                        }`}
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {usernameError && (
                        <p className="text-red-500 text-xs mt-1">
                          {usernameError}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        name="location"
                        required
                        id="location"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-3 col-span-full">
                      <label htmlFor="bio">Your Bio</label>
                      <br />
                      <span className="text-slate-500 text-xs">
                        {formData.bio.length}/300 characters
                      </span>
                      <TextareaAutosize
                        name="bio"
                        id="bio"
                        className="h-20 border mt-1 rounded px-4 w-full bg-gray-50 p-1"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          {loading ? (
                            <ThreeDots
                              visible={true}
                              height="24"
                              width="36"
                              color="white"
                              radius="8"
                              ariaLabel="three-dots-loading"
                            />
                          ) : (
                            <span>Submit</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
