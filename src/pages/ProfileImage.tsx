// const [image, setImage] = useState<File | null>(null);
// const [imagePreview, setImagePreview] = useState<string | null>(null);

// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     setImage(file);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   }
// };
// const handleImageSubmit = (e: React.FormEvent) => {
//   e.preventDefault();
//   const formData = new FormData();
//   if (image) formData.append("profileImage", image);
// };
// <form onSubmit={handleImageSubmit} className="flex flex-col items-center">
//   {imagePreview && (
//     <img
//       src={imagePreview}
//       alt="Preview"
//       className="w-32 h-32 rounded-full object-cover mb-4"
//     />
//   )}
//   <input
//     type="file"
//     accept="image/*"
//     onChange={handleImageChange}
//     className="mb-4"
//   />
//   <button
//     type="submit"
//     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//   >
//     Upload
//   </button>
// </form>;
