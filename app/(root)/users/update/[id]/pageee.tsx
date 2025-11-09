"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { FiChevronRight, FiUpload } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiClient } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { registerSchema, UserType } from "@/types/user";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import BasicInfoForm from "@/components/updateUser/BasicInfoForm";
import ProfessionalInfoForm from "@/components/updateUser/ProfessionalInfoForm";
import ClinicInfoForm from "@/components/updateUser/ClinicsOld";
import WeeklyAvailabilityForm from "@/components/updateUser/WeeklyAvailabilityForm";
import UserFormSection from "@/components/updateUser/BasicInfoForm";
import { useSpecialties } from "@/hooks/useSpecialties";

// --- Types ---
type subspecialty = { _id: string; name: string };
type Specialty = { _id: string; name: string; subSpecialties: subspecialty[] };
type PostalCode = {
  _id: string;
  code: string;
  active: boolean;
  district: string;
};
type District = { _id: string; name: string; postalCodes: PostalCode[] };
type City = { _id: string; name: string; districts: District[] };

function Page() {
  const CLOUDINARY_UPLOAD_PRESET = "userPic";
  const CLOUDINARY_CLOUD_NAME = "dxhgmrvi0";

  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);

  // --- State flags for stepwise prefill ---
  const [initialized, setInitialized] = useState(false);
  const [cityPrefilled, setCityPrefilled] = useState(false);

  const [specialtyPrefilled, setSpecialtyPrefilled] = useState(false);
  const [subSpecialtyPrefilled, setSubSpecialtyPrefilled] = useState(false);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");
  const [clinicPhotoProgress, setClinicPhotoProgress] = useState<number>(0);
  const [licenseFileProgress, setLicenseFileProgress] = useState<number>(0);
  const { id } = useParams();

  const [cities, setCities] = useState<City[]>([]);

  // const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const { specialties, getsubSpecialties, loading } = useSpecialties();

  const [userData, setUserData] = useState<UserType>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // For per-clinic district & postal options
  const [clinicLocationData, setClinicLocationData] = useState<{
    [key: number]: { districts: District[]; postalCodes: PostalCode[] };
  }>({});

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: userData?.role ?? "client",
      specialties: [],
    },
  });

  // Load all required data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [citiesRes, userRes] = await Promise.all([
          apiClient("/cities"),

          apiClient(`/users/${id}`),
        ]);
        setCities(citiesRes.data);

        setUserData(userRes.data);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) fetchAll();
  }, [id]);

  // --- Prefill user data ---

  console.log("specialties", specialties);
  console.log("userData", userData);

  console.log("values", form.getValues());

  useEffect(() => {
    if (
      !initialized &&
      userData &&
      cities.length > 0 &&
      specialties.length > 0
    ) {
      const cityId = userData?.postalCode?.district?.city?._id ?? "";

      // console.log("day date",userData.dateOfBirth.month)

      if (userData?.role === "provider") {
        const prefilled = (userData as any)?.formattedSubspecialties.flatMap(
          (fs: any) =>
            fs.subSpecialties.map((sub: any) => ({
              specialty: fs.specialtyId,
              subspecialty: sub.value,
              hasService: fs.hasService,
            }))
        );

        form.reset({
          specialties: prefilled,
          role: "provider",
          image: userData?.image?.url,
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          email: userData.email ?? "",
          phone: userData.phone ?? "",

          location: {
            city: cityId,
            district: "",
            postalCode: "",
          },
          dateOfBirth: {
            day: userData.dateOfBirth?.day,
            month: userData.dateOfBirth?.month,
            year: userData.dateOfBirth?.year,
          },
          gender: userData.gender ?? "",
          isVerified: userData.isVerified,

          experienceYears: userData.experienceYears,
          licenseNumber: userData.licenseNumber,
          licenseFile: userData.licenseFile,

          clinics:
            userData.clinics?.map((clinic) => ({
              clinicName: clinic.name,
              ClinicLocation: {
                city: clinic.postalCode.district.city._id ?? "",
                district: clinic.postalCode.district._id ?? "",
                postalCode: clinic.postalCode._id ?? "",
              },
              timeFrom: clinic.timeFrom ?? "",
              timeTo: clinic.timeTo ?? "",
              // 👇 convert any string to one of the valid enums
              day: clinic.day[0],

              clinicPhoto: {
                url: clinic.clinicPhoto?.url ?? null,
                publicId: clinic.clinicPhoto?.publicId ?? null,
              },
            })) ?? [],
          availability: userData.availability,
        });
      } else {
        form.reset({
          role: "client",
          image: userData?.image?.url,
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          email: userData.email ?? "",
          phone: userData.phone ?? "",

          location: {
            city: cityId,
            district: "",
            postalCode: "",
          },
          dateOfBirth: {
            day: userData.dateOfBirth?.day,
            month: userData.dateOfBirth?.month,
            year: userData.dateOfBirth?.year,
          },
          gender: userData.gender ?? "",
        });
      }

      setInitialized(true);
      setCityPrefilled(Boolean(cityId));
      setSpecialtyPrefilled(true);
    }
  }, [initialized, userData, cities, specialties, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  // --- Prefill subSpecialty ---
  // useEffect(() => {
  //   if (userData && subSpecialties.length > 0) {
  //     const subId = userData.subspecialty._id;
  //     if (subSpecialties.some((s) => s._id === subId)) {
  //       form.setValue("subspecialty", subId, {
  //         shouldValidate: false,
  //         shouldTouch: false,
  //         shouldDirty: false,
  //       });
  //     }
  //   }
  // }, [subSpecialties, userData, form]);

  // --- Per-clinic location handler ---
  const clinics = form.watch("clinics") || [];

  useEffect(() => {
    clinics.forEach((clinic: any, index: number) => {
      const cityId = clinic?.ClinicLocation?.city;
      const districtId = clinic?.ClinicLocation?.district;

      if (cityId) {
        const cityObj = cities.find((c) => c._id === cityId);
        const districtList = cityObj?.districts || [];

        const postalList =
          districtList.find((d) => d._id === districtId)?.postalCodes || [];

        setClinicLocationData((prev) => ({
          ...prev,
          [index]: {
            districts: districtList,
            postalCodes: postalList,
          },
        }));
      }
    });
  }, [clinics, cities]);

  // Basic file handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target?.files?.[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null); // handle cancel or null case
    }
  };

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

  const role = form.watch("role");

  // --- Submit logic ---
  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      let image = userData?.image;

      console.log("image", image);

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

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

        image = {
          url: res.data.secure_url,
          publicId: res.data.public_id,
        };
      }

      const { location, ...userPayload } = values;

      const cleanData = {
        ...userPayload,
        postalCode: location.postalCode,
      };

      cleanData.image = image;

      if (role === "provider") {
        const { specialties, ...rest } = cleanData;

        // Remove duplicates (based on _id or the raw value)
        const uniqueSubSpecialties = [
          ...new Set(
            specialties.map((s) => s.subspecialty?._id || s.subspecialty)
          ),
        ];

        // ✅ Rename the key from "specialties" → "specialty"
        cleanData.subspecialty = uniqueSubSpecialties;

        // Optional: delete the old property if it exists
        delete cleanData.specialties;
      }

      console.log("cleanData", cleanData);

      const response = await apiClient.put(`/users/${id}`, cleanData);

      console.log("res", response);

      if (response.data.message === "Email already exists") {
        return toast.error("Email already exists");
      }

      if (response.status !== 200) {
        throw new Error("Failed to update user");
      }
      toast("User updated successfully!");
    } catch (error) {
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  //   if (initialLoading) {
  //   return (
  //     <div className="w-full flex justify-center items-center min-h-[200px]">
  //       <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-secondary rounded-full" />
  //       <span className="ml-2 text-secondary">Loading...</span>
  //     </div>
  //   );
  // }

  console.log("errors", form.formState.errors);
  return (
    <Form {...form}>
      <div className="mx-[20px]">
        {/* Breadcrumb */}
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
          <span className="font-semibold text-gray-700">Update</span>
        </nav>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-7">
          <UserFormSection
           

          />

          {role === "provider" && (
            <>
              <ProfessionalInfoForm
 
              />

              {/* Clinic Information Card */}
              {form.watch("clinics")?.map((_, index) => (
                <ClinicInfoForm
                  key={index}
                  index={index}
                  form={form}
                  cities={cities}
                  licenseFileProgress={licenseFileProgress}
                  handleLicenseFileUpload={handleLicenseFileUpload}
                />
              ))}

              <WeeklyAvailabilityForm form={form} />
            </>
          )}
          <Button
            size="sm"
            className="bg-secondary text-white rounded-sm hover:bg-secondary/80 justify-start  "
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
              "Upadte User"
            )}
          </Button>
        </form>
      </div>
    </Form>
  );
}

export default Page;
