import React, { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { createPost } from "../../redux/actions/PostActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { ThreeDots } from "react-loader-spinner";

const CreatePostPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.post.loading);

  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false); // Add state for private post

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setEmojiDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImagePreview(reader.result as string);
    }
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setCaption((prev) => prev + emoji.emoji);
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image, image.name);
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("isPrivate", JSON.stringify(isPrivate)); // send as string

    try {
      const result = await dispatch(createPost(formData));
      if (result.payload.success) {
        toast.success("Post uploaded successfully!");
        navigate(`/post/${result.payload.postId}`);
      } else {
        toast.error(result.payload.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the post.");
    }
  };

  return (
    <main className="xl:ml-4 border rounded-lg bg-white shadow-lg max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Image Upload */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="bg-gray-50 rounded-lg overflow-hidden my-4 py-4 md:h-[500px] flex items-center justify-center">
            {imagePreview ? (
              <div className="relative w-full h-full ">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="  w-full object-contain"
                />
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-[400px] object-contain"
                  style={{ maxHeight: 400 }}
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <RxCross2 className="text-xl" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="upload-image"
                className="w-full h-[50%] md:h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary bg-accent transition-colors duration-200"
              >
                <FiUpload className="text-4xl text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-primary ">Upload</span> or
                  drag and drop
                </p>
                <input
                  id="upload-image"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            )}
          </div>
        </div>

        {/* Right Side - Post Details */}
        <div className="lg:w-1/2 flex flex-col gap-6 z-1">
          {/* Caption Section */}
          <div className="space-y-2 ">
            <label
              htmlFor="caption-input"
              className="text-gray-700 font-medium block"
            >
              Caption
            </label>
            <TextareaAutosize
              id="caption-input"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              maxLength={250}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{caption.length}/250</div>
              <button
                type="button"
                ref={emojiButtonRef}
                onClick={() => setEmojiDialogOpen(!emojiDialogOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <BsEmojiSmile className="text-xl text-gray-600" />
              </button>
            </div>
            {emojiDialogOpen && (
              <div
                ref={emojiPickerRef}
                className="absolute right-0 z-50"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  marginTop: "8px",
                }}
              >
                <div className="bg-white rounded-lg p-2">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    lazyLoadEmojis={true}
                    searchDisabled={false}
                    skinTonesDisabled={true}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label
              htmlFor="location-input"
              className="text-gray-700 font-medium block"
            >
              Location
            </label>
            <input
              id="location-input"
              type="text"
              value={location}
              placeholder="Add location"
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Private Post Toggle - New Switch UI */}
          <div className="space-y-2 -z-1">
            <label className="text-gray-700 font-medium block">
              Post Privacy
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={isPrivate}
                onClick={() => setIsPrivate(!isPrivate)}
                className={` inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                  isPrivate ? "bg-purple-600" : "bg-gray-200"
                } focus:outline-none  focus:ring-offset-2`}
              >
                <span
                  className={`inline-block h-5 w-5  transform rounded-full bg-white transition-transform duration-300 ${
                    isPrivate ? "translate-x-8" : "translate-x-1"
                  } shadow-lg`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  isPrivate ? "text-purple-600" : "text-gray-500"
                }`}
              >
                {isPrivate ? "Private" : "Public"}
              </span>
            </div>
            {isPrivate ? (
              <p className="text-sm text-purple-500 animate-fade-in mt-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17V11M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.0498 8V8.1L11.9502 8.1V8H12.0498Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Only your followers will be able to see this post
              </p>
            ) : (
              <p className="text-sm text-gray-500  animate-fade-in mt-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17V11M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.0498 8V8.1L11.9502 8.1V8H12.0498Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Everyone will be able to see this post
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-auto ">
            <button
              type="submit"
              disabled={!image || loading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300  hover:scale-[1.02] ${
                !image
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isPrivate
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              {loading ? (
                <ThreeDots
                  visible={true}
                  height="24"
                  width="36"
                  color="white"
                  radius="8"
                />
              ) : (
                "Share Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default CreatePostPage;
// the image previw here, when user upload very tall image, it show full and cover whole page, so i want to limit it to max 500 px hieght and also show whole image, not cut it off in preview
