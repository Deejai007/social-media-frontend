import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FiUpload } from "react-icons/fi";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { RxCross2 } from "react-icons/rx";
import { BsEmojiSmile } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";

import { AppDispatch, RootState } from "redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/actions/PostAcitons";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

interface Props {
  createOpen: boolean;
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<Props> = ({ createOpen, setCreateOpen }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector((state: RootState) => state.user);
  // const post = useSelector((state: RootState) => state.post);
  const loading = useSelector((state: RootState) => state.post.loading);

  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postPath, setPostPath] = useState();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
    }
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setCaption((prevCaption) => prevCaption + emoji.emoji);
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hi");

    if (image) {
      const formData = new FormData();
      formData.append("image", image, image.name);
      formData.append("caption", caption);
      formData.append("location", location);

      try {
        const result = await dispatch(createPost(formData));
        // if (response.payload.success) {
        if (result.payload.success) {
          setPostSuccess(true);

          setPostPath(result.payload.postId);
          console.log(result.payload.message);
        } else {
          console.log(result.payload.message);
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
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleNavPost = () => {
    navigate(`/post/${postPath}`);
  };
  return (
    <div
      className={`${
        createOpen ? "" : "hidden"
      } w-full h-full backdrop-blur-sm bg-black/40 absolute z-20 flex justify-center items-center`}
    >
      {postSuccess ? (
        <div className="bg-white m-3 px-4 pt-1 pb-3 max-w-96 rounded-xl  border-4 border-green-400 shadow-lg  max-w-md w-full flex items-center justify-center flex-col">
          <span className="text-5xl p-4">
            <SiTicktick />
          </span>
          <h1 className="py-1">Posted successfully!</h1>
          <button
            className="bg-primary m-2 px-2 py-1 rounded "
            onClick={handleNavPost}
          >
            View Post
          </button>
        </div>
      ) : (
        <div className="bg-white m-3 px-4 pt-1 pb-3 rounded-3xl shadow-lg max-w-md w-full">
          <div className="text-xl font-bold text-center border-b-2 p-2 border-gray-400">
            Create new post
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {imagePreview ? (
                <div className="relative flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-contain mb-4 min-h-64 max-h-64"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute top-0 right-0 bg-red-500 text-white text-lg p-1 rounded-full m-2"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      required
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="mb-4">
              <TextareaAutosize
                name="bio"
                placeholder="Write a caption..."
                onChange={(e) => {
                  setCaption(e.target.value);
                  console.log(caption);
                }}
                value={caption}
                id="bio"
                className="h-20 border mt-1 rounded px-4 w-full bg-gray-50 p-1"
              />
              <div className="px-4 text-xl mb-2">
                <span>
                  <BsEmojiSmile
                    onClick={() => setEmojiDialogOpen(!emojiDialogOpen)}
                  />
                </span>
              </div>

              <hr />
              <div>
                <input
                  type="text"
                  className="bg-gray-100 m-2 py-2  rounded-sm px-4"
                  value={location}
                  placeholder="Add Location"
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </div>
            </div>
            {emojiDialogOpen && <EmojiPicker onEmojiClick={handleEmojiClick} />}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="text-red-900 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 w-20 flex items-center justify-center rounded"
              >
                {loading ? (
                  <ThreeDots
                    visible={true}
                    height="24"
                    width="36"
                    color="white"
                    radius="8"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
