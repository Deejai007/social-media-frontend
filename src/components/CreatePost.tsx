// import React, { useState } from "react";
// import TextareaAutosize from "react-textarea-autosize";
// import { FiUpload } from "react-icons/fi";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import { RxCross2 } from "react-icons/rx";
// import { BsEmojiSmile } from "react-icons/bs";
// import { SiTicktick } from "react-icons/si";

// import { AppDispatch, RootState } from "redux/store/store";
// import { useDispatch, useSelector } from "react-redux";
// import { createPost } from "../redux/actions/PostActions";
// import { toast } from "react-toastify";
// import { ThreeDots } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   createOpen: boolean;
//   setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const CreatePost: React.FC<Props> = ({ createOpen, setCreateOpen }) => {
//   const dispatch: AppDispatch = useDispatch();
//   const navigate = useNavigate();
//   const loading = useSelector((state: RootState) => state.post.loading);

//   const [image, setImage] = useState<File | null>(null);
//   const [caption, setCaption] = useState<string>("");
//   const [location, setLocation] = useState<string>("");
//   const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
//   const [postSuccess, setPostSuccess] = useState(false);
//   const [postPath, setPostPath] = useState();
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//     }
//   };

//   const handleEmojiClick = (emoji: EmojiClickData) => {
//     setCaption((prevCaption) => prevCaption + emoji.emoji);
//   };

//   const handleDeleteImage = () => {
//     setImage(null);
//     setImagePreview(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (image) {
//       const formData = new FormData();
//       formData.append("image", image, image.name);
//       formData.append("caption", caption);
//       formData.append("location", location);

//       try {
//         const result = await dispatch(createPost(formData));
//         if (result.payload.success) {
//           setPostSuccess(true);
//           setPostPath(result.payload.postId);

//           setImage(null);
//           setCaption("");
//           setLocation("");
//           setImagePreview(null);
//         } else {
//           toast.info(result.payload.message, {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   const handleNavPost = () => {
//     setPostSuccess(false);
//     setCreateOpen(false);
//     navigate(`/post/${postPath}`);
//   };

//   return (
//     <div
//       className={`${
//         createOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
//       } fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-transform duration-300 ${
//         createOpen ? "" : "hidden"
//       }`}
//     >
//       {postSuccess ? (
//         <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
//           <div className="text-green-500 text-5xl mb-4">
//             <SiTicktick />
//           </div>
//           <h1 className="text-lg font-bold">Posted Successfully!</h1>
//           <button
//             onClick={handleNavPost}
//             className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
//           >
//             View Post
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-xl font-semibold text-center mb-4">
//             Create New Post
//           </h2>
//           <form onSubmit={handleSubmit}>
//             {/* Image Upload Section */}
//             <div className="mb-4">
//               {imagePreview ? (
//                 <div className="relative">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full rounded-lg object-cover h-64"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleDeleteImage}
//                     className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
//                     aria-label="Delete Image"
//                   >
//                     <RxCross2 />
//                   </button>
//                 </div>
//               ) : (
//                 <label
//                   htmlFor="image-upload"
//                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-gray-50 cursor-pointer hover:border-primary transition"
//                 >
//                   <FiUpload className="text-4xl text-gray-500" />
//                   <p className="text-sm text-gray-500 mt-2">
//                     Click to upload or drag and drop
//                   </p>
//                   <input
//                     id="image-upload"
//                     type="file"
//                     className="hidden"
//                     onChange={handleImageChange}
//                     required
//                   />
//                 </label>
//               )}
//             </div>

//             {/* Caption Input */}
//             <div className="mb-4">
//               <label
//                 htmlFor="caption-input"
//                 className="block text-gray-700 font-medium mb-2"
//               >
//                 Caption
//               </label>
//               <TextareaAutosize
//                 placeholder="Write a caption..."
//                 value={caption}
//                 onChange={(e) => setCaption(e.target.value)}
//                 className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//               <div className="text-right text-gray-400 text-sm">
//                 {caption.length} / 250
//               </div>
//             </div>

//             {/* Emoji Picker */}
//             <div className="mb-4">
//               <button
//                 type="button"
//                 onClick={() => setEmojiDialogOpen(!emojiDialogOpen)}
//                 className="text-xl text-gray-500 hover:text-primary transition"
//                 aria-label="Add Emoji"
//               >
//                 <BsEmojiSmile />
//               </button>
//               {emojiDialogOpen && (
//                 <EmojiPicker onEmojiClick={handleEmojiClick} />
//               )}
//             </div>

//             {/* Location Input */}
//             <label
//               htmlFor="caption-input"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Add Location
//             </label>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Add Location"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>

//             {/* Form Buttons */}
//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 onClick={() => setCreateOpen(false)}
//                 className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className={`px-4 py-2 bg-primary text-white rounded ${
//                   loading
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-primary-dark transition"
//                 }`}
//                 disabled={!image || loading}
//               >
//                 {loading ? (
//                   <ThreeDots visible height="24" width="24" color="white" />
//                 ) : (
//                   "Post"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreatePost;
