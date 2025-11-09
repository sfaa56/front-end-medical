import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

type ImageUploadProps = {
  value?: { url: string; publicId: string };
  onChange: (file: { url: string; publicId: string }) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
  onUploadingChange?:(isUploading:boolean)=>void;
};

export default function ImageUpload({
  value,
  onChange,
  disabled,
  label = "Upload Image",
  error,
  onUploadingChange
}: ImageUploadProps) {
  
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);


    React.useEffect(() => {
    if (onUploadingChange) {
      onUploadingChange(progress > 0 && progress < 100);
    }
  }, [progress, onUploadingChange]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG or PNG allowed.");
      return;
    }

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    // Show temporary preview
    const previewUrl = URL.createObjectURL(file);
    onChange({ url: previewUrl, publicId: "" });
    setProgress(10);

    try {
      // Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(file, setProgress);
      onChange({ url, publicId });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file.");
      onChange({ url: "", publicId: "" });
    } finally {
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      {/* {label && <label className="block text-sm mb-1">{label}</label>} */}
      <div className="relative w-40 h-40 group">
        {value?.url ? (
          <img
            src={value.url}
            alt="Preview"
            className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-200"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
            onClick={() => inputRef.current?.click()}
          >
            <p className="text-sm text-gray-500 text-center px-2">
              Click or drop an image
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG (max 5MB)
            </p>
          </div>
        )}

        {/* Progress overlay */}
        {progress > 0 && progress < 100 && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-2xl transition-all">
            <div className="text-white text-sm font-medium mb-2 animate-pulse">
              Uploading {progress}%
            </div>
            <div className="w-3/4 bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Hover overlay for replacing image */}
        {progress === 0 && value?.url && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1 text-xs bg-white/90 rounded-md hover:bg-white text-gray-700 font-medium"
              disabled={disabled}
            >
              Change
            </button>
          </div>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          disabled={disabled}
          onChange={handlePhotoUpload}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}