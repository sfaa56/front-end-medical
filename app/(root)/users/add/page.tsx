"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FiChevronRight, FiShield, FiUpload } from "react-icons/fi";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import axios from "axios";
import { useLocationData } from "@/hooks/useLocationData";
import { useSpecialties } from "@/hooks/useSpecialties";
import { registerSchema } from "@/types/addUser";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser, reset } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

// Mocked region/city data
const regionCityData = [
  { region: "Cairo", cities: ["Nasr City", "Heliopolis", "Maadi"] },
  { region: "Alexandria", cities: ["Smouha", "Stanley", "Gleem"] },
  { region: "Giza", cities: ["Dokki", "Mohandessin", "Haram"] },
];
const ROLES = ["admin", "provider", "client"] as const;

type FormValues = z.infer<typeof registerSchema>;

export default function AddUserPage() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [userType, setUserType] = useState<"provider" | "client">("client");

  const dispatch = useDispatch<AppDispatch>();
  const {  isError, isSuccess, message,isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();

  // upload pic
  const [clinicPhotoProgress, setClinicPhotoProgress] = useState<number>(0);
  const [licenseFileProgress, setLicenseFileProgress] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "client",
    },
  });

  // cities
  const { cities, loadingLocation, getDistricts, getPostalCodes } =
    useLocationData();
  const city = form.watch("location.city");
  const district = form.watch("location.district");

  const districts = getDistricts(city);
  const postalCodes = getPostalCodes(city, district);

  // clinic location
  const clinicCity = form.watch("ClinicLocation.city");
  const clinicDistrict = form.watch("ClinicLocation.district");

  const clinicDistricts = getDistricts(clinicCity);
  const clinicPostalCodes = getPostalCodes(clinicCity, clinicDistrict);

  // for filter specialties
  const {
    specialties,
    loading: loadingSpecialties,
    getSubSpecialties,
  } = useSpecialties();
  const Specialty = form.watch("specialty");
  const subSpecialties = getSubSpecialties(Specialty);

  const role = form.watch("role");

  const handleClinicPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: any) => void,
    name: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // ✅ Validate type
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only PDF, JPG, or PNG are allowed.");
        return;
      }

      // ✅ Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      // ✅ Optional: If image, validate dimensions
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            if (img.width < 200 || img.height < 200) {
              toast.error("Image is too small. Minimum size is 200x200px.");
              reject();
            } else {
              resolve();
            }
          };
          img.onerror = () => {
            toast.error("Failed to read the image file.");
            reject();
          };
        });
      }

      // ✅ Optimistic: store raw file for preview
      fieldOnChange(file);

      // ✅ Upload to Cloudinary with progress bar
      const { url, publicId } = await uploadToCloudinary(file, (progress) => {
        setClinicPhotoProgress(progress);
      });

      // ✅ Replace with uploaded file info
      fieldOnChange({ url, publicId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleLicenseFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: any) => void,
    name: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // ✅ Validate type
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only PDF, JPG, or PNG are allowed.");
        return;
      }

      // ✅ Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      // ✅ Optional: If image, validate dimensions
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            if (img.width < 200 || img.height < 200) {
              toast.error("Image is too small. Minimum size is 200x200px.");
              reject();
            } else {
              resolve();
            }
          };
          img.onerror = () => {
            toast.error("Failed to read the image file.");
            reject();
          };
        });
      }

      // ✅ Optimistic: store raw file for preview
      fieldOnChange(file);

      // ✅ Upload to Cloudinary with progress bar
      const { url, publicId } = await uploadToCloudinary(file, (progress) => {
        setLicenseFileProgress(progress);
      });

      // ✅ Replace with uploaded file info
      fieldOnChange({ url, publicId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: any) => void
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          if (img.width < 200 || img.height < 200) {
            toast.error("Image is too small. Minimum size is 200x200px.");
            reject();
          } else {
            resolve();
          }
        };
        img.onerror = () => {
          toast.error("Failed to read the image file.");
          reject();
        };
      });

      // ✅ Optimistic: store raw file for preview
      fieldOnChange(file);

      // Upload immediately
      const { url, publicId } = await uploadToCloudinary(file, (progress) =>
        setUploadProgress(progress)
      );
      form.setValue("image", { url, publicId });
      fieldOnChange({ url, publicId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed");
    }

    if (isSuccess) {
      toast.success("User added sucessfuly");
    }
    // cleanup
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, dispatch]);

  const validatePasssword = () => {
    if (form.getValues("password") !== form.getValues("confirmPassword")) {
      form.setError("confirmPassword", { message: "Passwords do not match" });
      return false;
    }

    return true;
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!validatePasssword()) return;

    const { ...userData } = {
      ...values,
    };

    const resultAction = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(resultAction)) {
      router.push("/users")
    }
  };

  // Use react-hook-form's watch function from the form instance
  const watch = form.watch;

  console.log("errors", form.formState.errors);

  return (
    <Form {...form}>
      <div className="mx-[20px]">
        <nav
          className="flex items-center text-sm text-gray-500 mb-6"
          aria-label="Breadcrumb"
        >
          <Link href={"/users"}>
            <span className="hover:underline cursor-pointer text-secondary">
              Users List
            </span>
          </Link>
          <FiChevronRight className="mx-2" />
          <span className="font-semibold text-gray-700">Add User</span>
        </nav>

        {/* Toggle between User and client */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={userType === "client" ? "secondary" : "outline"}
            onClick={() => {
              setUserType("client");
              form.setValue("role", "client");
            }}
            type="button"
          >
            Add client
          </Button>
          <Button
            variant={userType === "provider" ? "secondary" : "outline"}
            onClick={() => {
              setUserType("provider");
              form.setValue("role", "provider");
            }}
            type="button"
          >
            Add Provider
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-7">
          <div className="bg-white rounded-md space-y-6  p-8 grid grid-cols-2 gap-x-6">
            {/* Image upload */}
            <div className="col-span-2 w-40">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            handleImageChange(e, field.onChange);
                          }}
                        />
                        <label
                          htmlFor="imageUpload"
                          className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-2xl p-5 w-full hover:shadow-md cursor-pointer text-center"
                        >
                          <div className="flex text-md flex-col items-center justify-center space-y-2">
                            {form.watch("image")?.url ? (
                              <>
                                <img
                                  src={form.watch("image").url}
                                  alt="Preview"
                                  className="w-40 h-20 object-cover rounded mb-2"
                                />
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                  <span className="text-xs text-gray-500">
                                    {uploadProgress}%
                                  </span>
                                )}
                                {uploadProgress === 100 && (
                                  <span className="text-xs text-green-600">
                                    Uploaded!
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                <FiUpload className="text-gray-600 text-xl" />
                                <p className="text-gray-600 font-medium">
                                  Upload <br /> Image
                                </p>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form fields */}
            <div className="col-span-2 grid gap-6 lg:grid-cols-2">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password and Confirm Password */}
              <div className="col-span-2 grid gap-6 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="gap-4">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* location */}
              <div className="col-span-2 w-full grid grid-cols-3 gap-6 items-end">
                {/* City */}
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loation</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          disabled={loadingLocation}
                        >
                          <SelectTrigger className="gap-4">
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((c) => (
                              <SelectItem key={c._id} value={c.name}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* District */}
                <FormField
                  control={form.control}
                  name="location.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          disabled={districts.length === 0}
                        >
                          <SelectTrigger className="gap-4">
                            <SelectValue placeholder="District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((d) => (
                              <SelectItem key={d._id} value={d.name}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Postal Code */}
                <FormField
                  control={form.control}
                  name="location.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          disabled={postalCodes.length === 0}
                        >
                          <SelectTrigger className="gap-4">
                            <SelectValue placeholder="Postal Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {postalCodes.map((p) => (
                              <SelectItem key={p._id} value={p._id}>
                                {p.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* date */}
              <div className="col-span-2 w-full grid grid-cols-3 gap-6 items-end">
                {/* Day */}
                <FormField
                  control={form.control}
                  name="dateOfBirth.day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>

                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="gap-4">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {[...Array(31)].map((_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Month */}
                <FormField
                  control={form.control}
                  name="dateOfBirth.month"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="gap-4">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {[
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ].map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Year */}
                <FormField
                  control={form.control}
                  name="dateOfBirth.year"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="gap-4">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent className="bg-whtie">
                            {Array.from({ length: 100 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {userType === "provider" && (
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center space-x-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        id="isVerified"
                      />
                    </FormControl>
                    <FormLabel htmlFor="isVerified">
                      Approve provider account immediately
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {userType === "provider" && (
            <div className="bg-white rounded-md space-y-6 p-8 grid grid-cols-2 gap-x-6">
              <h2 className="col-span-2 font-semibold text-lg mb-4">
                Professional Info
              </h2>
              {/* Specialty */}
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={loadingSpecialties}
                      >
                        <SelectTrigger className="gap-4">
                          <SelectValue placeholder="Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((s) => (
                            <SelectItem key={s._id} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sub-Specialty */}
              <FormField
                control={form.control}
                name="subspecialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Specialty</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={subSpecialties.length === 0}
                      >
                        <SelectTrigger className="gap-4">
                          <SelectValue placeholder="Sub-Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {subSpecialties.map((s) => (
                            <SelectItem key={s._id} value={s._id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Experience Years */}
              <FormField
                control={form.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Years</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Experience Years"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? "" : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* License Number */}
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="License Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* File Upload */}
              <div className="mt-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Medical License
                </label>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
                  onClick={() => {
                    const input = document.getElementById("licenseFile");
                    if (input) input.click();
                  }}
                >
                  <p className="text-sm text-gray-500">
                    Drag and drop your file here, or{" "}
                    <span className="text-primary font-medium">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: PDF, JPG, PNG (max 5MB)
                  </p>
                </div>

                <div className="w-fu">
                  <FormField
                    control={form.control}
                    name="licenseFile"
                    render={({ field }) => (
                      <FormItem>
                        <Controller
                          name="licenseFile"
                          control={form.control}
                          render={({ field }) => (
                            <input
                              id="licenseFile"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) =>
                                handleClinicPhotoUpload(
                                  e,
                                  field.onChange,
                                  field.name
                                )
                              }
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Show progress bar */}
                  {clinicPhotoProgress > 0 && clinicPhotoProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${clinicPhotoProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Preview selected file */}
                {watch("licenseFile") && (
                  <div className="mt-2 text-sm text-gray-600">
                    {watch("licenseFile")?.url ? (
                      <div className="flex flex-col items-start space-y-2">
                        {watch("licenseFile")?.url.match(
                          /\.(jpg|jpeg|png)$/i
                        ) && (
                          <img
                            src={watch("licenseFile").url}
                            alt="Clinic"
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    ) : (
                      <p>
                        Selected file:
                        <span className="font-medium">
                          {watch("licenseFile").url}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {userType === "provider" && (
            <>
              {/* Clinic Information Card */}
              <div className="col-span-2 bg-white rounded-lg p-6 mb-6 shadow-sm space-y-6">
                <h2 className="font-semibold text-lg mb-4">
                  Clinic Information
                </h2>
                {/* Clinic Name */}
                <FormField
                  control={form.control}
                  name="clinicName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinic/Hospital Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Clinic/Hospital Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Clinic Location */}
                <div className="grid grid-cols-3 gap-6 mt-4 items-end">
                  {/* Clinic City */}
                  <FormField
                    control={form.control}
                    name="ClinicLocation.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            disabled={loadingLocation}
                          >
                            <SelectTrigger className="gap-4">
                              <SelectValue placeholder="City" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((c) => (
                                <SelectItem key={c._id} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Clinic District */}
                  <FormField
                    control={form.control}
                    name="ClinicLocation.district"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            disabled={clinicDistricts.length === 0}
                          >
                            <SelectTrigger className="gap-4">
                              <SelectValue placeholder="District" />
                            </SelectTrigger>
                            <SelectContent>
                              {clinicDistricts.map((d) => (
                                <SelectItem key={d._id} value={d.name}>
                                  {d.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Clinic Postal Code */}
                  <FormField
                    control={form.control}
                    name="ClinicLocation.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            disabled={clinicPostalCodes.length === 0}
                          >
                            <SelectTrigger className="gap-4">
                              <SelectValue placeholder="Postal Code" />
                            </SelectTrigger>
                            <SelectContent>
                              {clinicPostalCodes.map((p) => (
                                <SelectItem key={p._id} value={p._id}>
                                  {p.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Day of Week */}
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full ">
                            <SelectValue placeholder="Select Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Pickers */}
                <div className="flex gap-3 mt-3">
                  <FormField
                    control={form.control}
                    name="timeFrom"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Time From</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="From"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeTo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Time To</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="To"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Clinic Photo
                  </label>

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
                    onClick={() => {
                      const input = document.getElementById("clinicPhoto");
                      if (input) input.click();
                    }}
                  >
                    <p className="text-sm text-gray-500">
                      Drag and drop your file here, or{" "}
                      <span className="text-primary font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats: PDF, JPG, PNG (max 5MB)
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="clinicPhoto"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Controller
                          name="clinicPhoto"
                          control={form.control}
                          render={({ field }) => (
                            <input
                              id="clinicPhoto"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) =>
                                handleLicenseFileUpload(
                                  e,
                                  field.onChange,
                                  field.name
                                )
                              }
                            />
                          )}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Show progress bar */}
                  {licenseFileProgress > 0 && licenseFileProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${licenseFileProgress}%` }}
                      />
                    </div>
                  )}

                  {watch("clinicPhoto") && (
                    <div className="mt-2 text-sm text-gray-600">
                      {watch("clinicPhoto")?.url ? (
                        <div className="flex flex-col items-start space-y-2">
                          {watch("clinicPhoto")?.url.match(
                            /\.(jpg|jpeg|png)$/i
                          ) && (
                            <img
                              src={watch("clinicPhoto").url}
                              alt="Clinic"
                              className="w-32 h-32 object-cover rounded-lg shadow-md"
                            />
                          )}
                        </div>
                      ) : (
                        <p>
                          Selected file:
                          <span className="font-medium">
                            {watch("clinicPhoto").url}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {userType === "provider" && (
            <div className="col-span-2 bg-white rounded-lg p-6 mb-6 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg mb-4">
                Weekly Availability
              </h2>
              {/* Show global error for availability if exists */}
              <FormMessage>
                {(form.formState.errors as any)?.availability?.message}
              </FormMessage>
              <div className="space-y-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const isSelected = !!form.watch(`availability.${day}`);
                  return (
                    <div
                      key={day}
                      className={`flex items-center gap-4 border rounded-lg p-3 hover:shadow-sm transition cursor-pointer ${
                        isSelected ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          form.unregister(`availability.${day}`);
                        } else {
                          form.setValue(`availability.${day}`, {
                            from: "",
                            to: "",
                          });
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (isSelected) {
                            form.unregister(`availability.${day}`);
                          } else {
                            form.setValue(`availability.${day}`, {
                              from: "",
                              to: "",
                            });
                          }
                        }
                      }}
                    >
                      {/* Checkbox and label */}
                      <span className="flex items-center gap-2 w-32 select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          tabIndex={-1}
                          className="cursor-pointer"
                        />
                        <span className="font-medium">{day}</span>
                      </span>
                      {/* If checked, show time pickers */}
                      {isSelected && (
                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name={`availability.${day}.from`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      placeholder="From"
                                      value={field.value ?? ""}
                                      onChange={field.onChange}
                                      className="w-full"
                                      onClick={(e) => e.stopPropagation()} // Prevent parent click
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <span className="text-gray-500">to</span>
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name={`availability.${day}.to`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      placeholder="To"
                                      value={field.value ?? ""}
                                      onChange={field.onChange}
                                      className="w-full"
                                      onClick={(e) => e.stopPropagation()} // Prevent parent click
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            size="sm"
            className="bg-secondary text-white rounded-sm hover:bg-secondary/80 justify-start "
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Add User
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </>
            ) : (
              "Add User"
            )}
          </Button>
        </form>
      </div>
    </Form>
  );
}
