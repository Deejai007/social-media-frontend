import React, { useState } from "react";
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
    <main className="xl:ml-4  border  2md:max-w-xl mx-auto p-4 rounded-lg  ">
      <h1 className="text-xl font-bold  mb-4">Create New Post</h1>

      <form onSubmit={handleSubmit}>
        {/* Image Upload Section */}
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
            <label
              htmlFor="upload-image"
              className="flex flex-col items-center justify-center w-full h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="text-2xl" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </div>
              <input
                id="upload-image"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Caption Section */}
        <div className="mb-4">
          <label
            htmlFor="caption-input"
            className="block text-gray-700 font-medium mb-2"
          >
            Caption
          </label>
          <TextareaAutosize
            id="caption-input"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="text-right text-gray-400 text-sm">
            {caption.length} / 250
          </div>
          <BsEmojiSmile
            onClick={() => setEmojiDialogOpen(!emojiDialogOpen)}
            className="text-2xl cursor-pointer mt-2"
          />
          {emojiDialogOpen && (
            <div className="mt-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="mb-4">
          <label
            htmlFor="location-input"
            className="block text-gray-700 font-medium mb-2"
          >
            Location
          </label>
          <input
            id="location-input"
            type="text"
            value={location}
            placeholder="Add Location"
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 w-20 flex items-center justify-center rounded text-white ${
              !image ? "bg-gray-500 cursor-not-allowed" : "bg-primary"
            }`}
            disabled={!image || loading}
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
              "Post"
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreatePostPage;
