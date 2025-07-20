"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

const ROLES = ["provider", "client"] as const;

// --- Types ---
type SubSpecialty = { _id: string; name: string };
type Specialty = { _id: string; name: string; subSpecialties: SubSpecialty[] };
type PostalCode = {
  _id: string;
  code: string;
  active: boolean;
  district: string;
};
type District = { _id: string; name: string; postalCodes: PostalCode[] };
type City = { _id: string; name: string; districts: District[] };
type UserData = {
  name: string;
  email: string;
  phoneNumber: string;
  image: { url: string; publicId?: string };
  role: (typeof ROLES)[number];
  isVerified?: boolean;
  specialty: string;
  SubSpecialty: { _id: string; name: string };
  city: string;
  district: string;
  postalCode: string;
  password?: string;
};

const formSchema = z
  .object({
    specialty: z.string().min(1, "Please select a specialty"),
    SubSpecialty: z.string().min(1, "Please select a sub-specialty"),
    name: z.string().min(2, "First Name must be at least 2 characters."),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phoneNumber: z.string().regex(/^\d{10,15}$/, {
      message: "Please enter a valid phone number (10-15 digits)",
    }),
    image: z.any().optional(),
    city: z.string().min(1, "Please select a city."),
    district: z.string().min(1, "Please select a district."),
    postalCode: z.string().min(1, "Please select a postal code."),
    role: z.enum(ROLES),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .optional()
      .or(z.literal("")),
    confirmPassword: z
      .string()
      .min(6, "Please confirm your password.")
      .optional()
      .or(z.literal("")),
    isVerified: z.boolean().optional(),
    file: z.string().optional(),
  })
  .refine(
    (data) =>
      (!data.password && !data.confirmPassword) ||
      (data.password &&
        data.confirmPassword &&
        data.password === data.confirmPassword),
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

function Page() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [cities, setCities] = useState<City[]>([]);
  const [UserPostalCodes, setPostalCodes] = useState<PostalCode[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  const CLOUDINARY_UPLOAD_PRESET = "userPic";
  const CLOUDINARY_CLOUD_NAME = "dxhgmrvi0";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: "",
      SubSpecialty: "",
      role: undefined,
      isVerified: undefined,
      name: "",
      email: "",
      phoneNumber: "",
      image: "",
      city: "",
      district: "",
      postalCode: "",
      password: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // --- Load all data ---
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [citiesRes, specialtiesRes, userRes] = await Promise.all([
          apiClient("/cities"),
          apiClient("/specialties"),
          apiClient(`/users/${id}`),
        ]);
        setCities(citiesRes.data);
        setSpecialties(specialtiesRes.data);
        setUserData(userRes.data);
      } catch (err) {
        toast.error("Failed to load data");
      }
    };
    if (id) fetchAll();
  }, [id]);

  // Hydrate UserPostalCodes on initial userData load only
  useEffect(() => {
    if (userData && cities.length > 0) {
      const cityObject = cities.find((c) =>
        c.districts.some((d) =>
          d.postalCodes.some((x) => x._id === userData?.postalCode)
        )
      );
      const districtObj = cityObject?.districts.find((d) =>
        d.postalCodes.some((p) => p._id === userData?.postalCode)
      );
      setPostalCodes(districtObj?.postalCodes || []);
    }
    // eslint-disable-next-line
  }, [userData, cities]);

  // --- Dynamic dropdown logic ---
  const specialty = form.watch("specialty");
  const specialtyObj = specialties.find((s) => s.name === specialty);
  let subSpecialties = specialtyObj?.subSpecialties || [];

  const city = form.watch("city");
  const district = form.watch("district");

  const cityObj = cities.find((c) => c.name === city);
  const districts = cityObj?.districts || [];
  let districtObj = districts.find((d) => d._id  === district);

  // Update postal codes when district changes (and not just on initial userData load)
  useEffect(() => {
    if (districtObj) {
      setPostalCodes(districtObj.postalCodes || []);
      // If current postalCode does not belong to the new district, reset postalCode field
      if (
        form.getValues("postalCode") &&
        !districtObj.postalCodes.some(
          (p) => p._id === form.getValues("postalCode")
        )
      ) {
        form.setValue("postalCode", "");
      }
    }
    // eslint-disable-next-line
  }, [district, cities]);

  const districtValue = form.watch("district");
  useEffect(() => {
    console.log("district value changed:", districtValue);
  }, [districtValue]);

  const role = form.watch("role");

  // --- Hydrate form after all data loaded ---
  useEffect(() => {
    if (userData && specialties.length > 0 && cities.length > 0) {
      // Find specialty/subspecialty
      const specialtyObj = specialties.find((s) =>
        s.subSpecialties.some((sub) => sub._id === userData.SubSpecialty._id)
      );
      const subSpecialtyObj = specialtyObj?.subSpecialties.find(
        (sub) => sub._id === userData.SubSpecialty._id
      );
      subSpecialties = specialtyObj?.subSpecialties || [];
      // Find city/district/postalCode
      const cityObj = cities.find((c) =>
        c.districts.some((d) =>
          d.postalCodes.some((p) => p._id === userData.postalCode)
        )
      );

      console.log("cityObj", cityObj);

      districtObj = cityObj?.districts.find((d) =>
        d.postalCodes.some((p) => p._id === userData.postalCode)
      );

      const validDistrict = districts.find((d) => d._id === districtObj?._id)
  ? districtObj?._id
  : "";




      console.log("validDistrict", validDistrict);

      form.reset({
        specialty: specialtyObj?.name ?? "",
        SubSpecialty: subSpecialtyObj?._id ?? "",
        role: userData.role ?? undefined,
        name: userData.name ?? "",
        email: userData.email ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        image: userData.image?.url ?? "",
        city: cityObj?.name ?? "",
        district: districtObj?._id,
        postalCode: userData.postalCode ?? "",
        password: "",
        isVerified: userData.isVerified ?? undefined,
      });

      // Now log!
      console.log("getValue of the district", districtObj?._id ?? "");
      // Or better: log after reset, perhaps in another useEffect
      console.log(
        "getValue of the district after reset",
        form.getValues("district")
      );
    }
    // Do NOT add form as dep, this should only run on data load
    // eslint-disable-next-line
  }, [userData, specialties, cities]);

  // console.log("getVale of the district", form.getValues("district"));

  // console.log("getVale of the district", form.getValues("city"));

  // --- Submit logic ---
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      let image = userData?.image

      console.log("image",image)

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

      const { specialty, confirmPassword, district, password, ...userPayload } =
        {
          ...values,
        };


      if (values.password && values.password.trim() !== "") {
        (userPayload as any).password = values.password;
      }


        userPayload.image = image;
      

      console.log("userPayload",userPayload)

      const response = await apiClient.put(`/users/${id}`, userPayload);

      if (response.status !== 201) {
        throw new Error("Failed to update user");
      }
      toast("User updated successfully!");
    } catch (error) {
      toast("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-8 grid grid-cols-2 gap-x-6 rounded-md"
        >
          {/* Image upload */}
          <div className="col-span-2 w-40">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-2xl p-5 w-full hover:shadow-md cursor-pointer text-center"
                      >
                        <div className="flex text-md flex-col items-start justify-center space-y-2">
                          {imageFile ? (
                            <>
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="w-40 h-20 object-cover rounded"
                              />
                              <div className="text-red-600 text-xs">Cancel</div>
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
                          ) : form.getValues("image") ? (
                            <img
                              src={form.getValues("image")}
                              alt="Preview"
                              className="w-40 h-20 object-cover rounded mb-2"
                            />
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
          <div className="col-span-2 grid gap-6 lg:grid-cols-2">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter PhoneNumber"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Role selector */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "provider")
                          form.setValue("isVerified", undefined);
                      }}
                    >
                      <SelectTrigger className="gap-4">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem value={role} key={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {/* sub-Specialties */}
            <FormField
              control={form.control}
              name="SubSpecialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>subSpecialty</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={subSpecialties.length === 0}
                    >
                      <SelectTrigger className="gap-4">
                        <SelectValue placeholder="sub-Specialty" />
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
            {/* email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50"
                      readOnly
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
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
                          <SelectItem key={d._id} value={d._id}>
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
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={UserPostalCodes.length === 0}
                    >
                      <SelectTrigger className="gap-4">
                        <SelectValue placeholder="Postal Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {UserPostalCodes.map((p) => (
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
          {/* Password and Confirm Password */}
          <div className="col-span-2 grid gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
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
          {/* Provider approval (only if Provider) */}
          {role === "provider" && (
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-row items-center space-x-3">
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
          <Button
            size="sm"
            className="bg-secondary text-white rounded-sm hover:bg-secondary/80 justify-start w-[103px]"
            type="submit"
            disabled={loading}
          >
            Update User
          </Button>
        </form>
      </div>
    </Form>
  );
}

export default Page;
