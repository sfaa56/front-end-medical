import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { picture } from "@/features/auth/authSlice";

const CLOUDINARY_UPLOAD_PRESET = "userPic"; 
const CLOUDINARY_CLOUD_NAME = "dxhgmrvi0"; 

function Picture() {

    const { user, error, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();


  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avater, setAvater] = useState(user?.image?.url);
  const fileInputRef = useRef<HTMLInputElement>(null);

useEffect(()=>{
    setAvater(user?.image?.url)
},[user])

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? 0;
            if (total > 0) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / total
              );
              setUploadProgress(percent);
            } else {
              setUploadProgress(0);
            }
          },
        }
      );
      const imageUrl = res.data.secure_url;
      const publicId =res.data.public_id

      const resultAction = await dispatch(picture({imageUrl,publicId}));

            if (picture.fulfilled.match(resultAction)) {
              const userupdated = resultAction.payload;
              console.log(" successful!");
              console.log("User data:", userupdated);
              toast.success("Image uploaded!");

 
            } else {
              console.log("error", error);
              //  Get error directly from resultAction
              if (resultAction.payload) {
                console.log("updated failed:", resultAction.payload); // e.g. { error: "Invalid credentials" }
                toast.error("Failed to upload image");
              }
            }
   
       //  const result = await apiClient.put('users/userPicture',{imageUrl,publicId})

      setAvater(imageUrl);
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div
      className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400 mb-2 cursor-pointer hover:ring-2 hover:ring-secondary transition"
      title="Click to change avatar"
      onClick={handleAvatarClick}
    >
      {avater ? (
        <img
          src={avater}
          alt="avatar"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        "A"
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
      {uploadingAvatar && (
        <div className="absolute w-24 h-24 bg-black/40 flex items-center justify-center rounded-full">
          <span className="text-white font-bold">{uploadProgress}%</span>
        </div>
      )}
    </div>
  );
}

export default Picture;