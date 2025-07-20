"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { FiChevronRight, FiUpload } from "react-icons/fi";
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

// Mocked region/city data
const regionCityData = [
  { region: "Cairo", cities: ["Nasr City", "Heliopolis", "Maadi"] },
  { region: "Alexandria", cities: ["Smouha", "Stanley", "Gleem"] },
  { region: "Giza", cities: ["Dokki", "Mohandessin", "Haram"] },
];

const ROLES = ["admin", "provider", "client"] as const;

const formSchema = z
  .object({
    name: z.string().min(2, "First Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email."),
    phoneNumber: z
      .string()
      .regex(
        /^\d{10,15}$/,
        "Please enter a valid phone number (10-15 digits)."
      ),
  
    specialty: z.string().min(1, "Please select a specialty"),
    SubSpecialty: z.string().min(1, "Please select a sub-specialtie"),
    image: z.any().optional(),
    file: z.string().optional(),

    city: z.string().min(1, "Please select a city."),
    role: z.enum(ROLES),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
    isVerified: z.boolean().optional(),

 
    district: z.string().min(1, "Please select a district."),
    postalCode: z.string().min(1, "Please select a postal code."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role !== "provider") {
        return data.isVerified === undefined;
      }
      return true;
    },
    {
      message: "Provider approval is only for Providers.",
      path: ["providerApproved"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function AddUserPage() {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const CLOUDINARY_UPLOAD_PRESET = "userPic";
  const CLOUDINARY_CLOUD_NAME = "dxhgmrvi0";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "client",
    
      city: "",
    },
  });

  const city = form.watch("city");
  const district = form.watch("district");

  const Specialty = form.watch("specialty");

  // for filter specialties
  const specialtyObject = specialties.find((c) => c.name === Specialty);
  const subSpecialties = specialtyObject?.subSpecialties || [];

  // for filter cities
  const cityObj = cities.find((c) => c.name === city);
  const districts = cityObj?.districts || [];
  const districtObj = districts.find((d) => d.name === district);
  const postalCodes = districtObj?.postalCodes || [];

  const role = form.watch("role");
  const cityOptions = cities.find((r) => r.region === city)?.cities || [];

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await apiClient("/cities");
        if (response.status === 200) {
          setCities(response.data);
          // Set defaults if available
          // if (response.data.length > 0) {
          //   form.setValue("region", response.data[0].name);
          //   if (response.data[0].districts.length > 0) {
          //     form.setValue("district", response.data[0].districts[0].name);
          //     if (response.data[0].districts[0].postalCodes.length > 0) {
          //       form.setValue(
          //         "postalCode",
          //         response.data[0].districts[0].postalCodes[0]
          //       );
          //     }
          //   }
          // }
        }
      } catch {
        toast.error("Error fetching cities");
      }
    };
    fetchCities();
  }, []);

  // fetch specialty
  useEffect(() => {
    const fetchSpecialty = async () => {
      try {
        const response = await apiClient("/specialties");
        if (response.status === 200) {
          setSpecialties(response.data);
          // Assuming you want to set the specialty options in the form
          // form.setValue("specialty", response.data[0]?.name || "");
        }
      } catch {
        toast.error("Error fetching specialties");
      }
    };
    fetchSpecialty();
  }, []);



  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("file", imageFile);
      }
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

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

      const url = res.data.secure_url;
      const publicId = res.data.public_id;

    const image ={
        url,
        publicId,
    }

      const { specialty, confirmPassword , district , ...userData } = {
        ...values,
            image
      };



      const response = await apiClient.post("/auth/register", userData);

      if (response.status !== 201) {
        throw new Error("Failed to add user");
      }

      // Reset form after successful submission
     form.reset({
        image: null,
        file: "",
        role: "client",
        city: "",
        district: "",
        postalCode: "",
        specialty: "",
        SubSpecialty: "",
        email:"",
        phoneNumber:"",
        name: "",
        password:"",
        confirmPassword: "",
        isVerified: undefined,
      });

      setImageFile(null)

      // API request here
      toast("User added successfully!");
    } catch (e) {
      toast("Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  console.log("reRender", form.watch());
 

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
                          <div className="flex text-md flex-col items-center justify-center space-y-2">
                            {imageFile ? (
                              <>
                                <img
                                  src={URL.createObjectURL(imageFile)}
                                  alt="Preview"
                                  className="w-40 h-20 object-cover rounde mb-2"
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
              {/* name */}
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
              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
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
              {/* Role selector */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
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
                    <FormLabel>Specialty</FormLabel>
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
              {/* Region */}
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
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={districts.length === 0}
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
              className="bg-secondary text-white rounded-sm hover:bg-secondary/80 justify-start w-[81px]"
              type="submit"
              disabled={loading}
            >
              Add User
            </Button>
          </form>
        </div>
      
    </Form>
  );
}
