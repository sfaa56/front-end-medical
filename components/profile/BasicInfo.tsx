"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { updateAdmin } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Picture from "./picture";

function BasicInfo() {
  const { user, error, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  // Dummy admin data
  const [profile, setProfile] = useState({
    id: user?._id,
    name: user?.name,
    email: user?.email,
    role: "Administrator",
    phoneNumber: user?.phoneNumber,
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        ...user,
      }));
      setForm((prev) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user]);

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});





  const validateProfile = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name || form.name.trim().length < 3) {
      errs.name = "Name is required and must be at least 3 characters.";
    }
    if (
      !form.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.email.endsWith(".com")
    ) {
      errs.email = "A valid email is required.";
    }
    if (form.phoneNumber && !/^\+?\d{7,15}$/.test(form.phoneNumber)) {
      errs.phoneNumber = "Phone number is invalid.";
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const resultAction = await dispatch(updateAdmin(form));

      if (updateAdmin.fulfilled.match(resultAction)) {
        const userupdated = resultAction.payload;
        console.log(" successful!");
        console.log("User data:", userupdated);
        setEdit(false);
      } else {
        console.log("error", error);
        //  Get error directly from resultAction
        if (resultAction.payload) {
          console.log("updated failed:", resultAction.payload); // e.g. { error: "Invalid credentials" }
          toast("something went wrong");
        }
      }
    } catch (error) {
      console.log("Unexpected error during login:", error);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center mb-6 gap-6">

<Picture />

        <div className="flex flex-col">
          {" "}
          <div className="text-lg font-semibold">{profile.name}</div>
          <div className="text-gray-500">{profile.role}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Info Section */}
        <section>
          <h2 className="font-semibold mb-2 text-secondary">Basic Info</h2>
          {edit ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium ">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">{errors.name}</span>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-xs">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size={18} color="#fff" /> : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 ">
              <div className="flex">
                <span className="font-medium w-[115px]">Name</span>{" "}
                {profile.name}
              </div>
              <div className="flex">
                <span className="font-medium w-[115px]">Email</span>{" "}
                {profile.email}
              </div>
              <div className="flex">
                <span className="font-medium w-[115px]">Phone</span>{" "}
                {profile.phoneNumber}
              </div>
              <div className="flex">
                <span className="font-medium w-[115px]">Role</span>{" "}
                {profile.role}
              </div>

              <div className="flex ">
                <Button
                  className="bg-secondary text-white  hover:bg-secondary/90 mt-5"
                  onClick={() => setEdit(true)}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default BasicInfo;
