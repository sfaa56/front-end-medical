import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { picture } from "@/features/user/useSlice";
import { toast } from "sonner";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function Picture({url,id}) {

  const dispatch = useDispatch<AppDispatch>();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [avatar, setAvatar] = useState(url);
  const [oldAvatar, setOldAvatar] = useState(url);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(url);
  }, [url]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // حفظ الصورة القديمة للرجوع إليها لو حصل فشل
    setOldAvatar(avatar);

    // عرض الصورة الجديدة فورًا كمؤقت (preview)
    const previewURL = URL.createObjectURL(file);
    setAvatar(previewURL);

    setUploadingAvatar(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    if (CLOUDINARY_UPLOAD_PRESET)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      // رفع الصورة إلى Cloudinary
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? 0;
            if (total > 0) {
              const percent = Math.round((progressEvent.loaded * 100) / total);
              setUploadProgress(percent);
            } else {
              setUploadProgress(0);
            }
          },
        }
      );

      const imageUrl = res.data.secure_url;
      const publicId = res.data.public_id;

      // إرسال الصورة الجديدة للسيرفر لتحديث المستخدم
      const resultAction = await dispatch(picture({ imageUrl, publicId, id }));

      if (picture.fulfilled.match(resultAction)) {
        const userUpdated = resultAction.payload;
        console.log("✅ Upload successful!", userUpdated);
        toast.success("Profile picture updated!");
        setAvatar(imageUrl);
      } else {
        console.log("❌ Upload failed:", resultAction.payload );
        setAvatar(oldAvatar); // 🔁 رجع للصورة القديمة
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setAvatar(oldAvatar); // 🔁 رجع للصورة القديمة
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400 mb-2 cursor-pointer hover:ring-2 hover:ring-secondary transition"
        title="Click to change avatar"
        onClick={handleAvatarClick}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border">
         <p className="text-sm"> Upload <br /> Image </p>  
          </div>
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

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-medium">Profile Photo</h3>
          <p className="text-sm text-gray-600">
            You can upload a .jpg, .png, or .gif photo (max 5MB)
          </p>
        </div>
        <div className="flex gap-4">
          <button  className="text-primary underline">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Picture;
