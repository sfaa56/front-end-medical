"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiClient } from "@/lib/api";
import Picture from "../Picture";
import Loading from "../Loading";
import LoadingSpinner from "../LoadingSpinner";

const baseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.string().min(1, "Must select gender"),
  role: z.enum(["client", "provider"]),
  location: z.object({
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  dateOfBirth: z.object({
    day: z.number().min(1).max(31),
    month: z.string().min(2),
    year: z.number().min(1900).max(new Date().getFullYear()),
  }),
  isVerified: z.boolean().optional(),
});

type FormValues = z.infer<typeof baseSchema>;

export default function UserFormSection() {
  const { id } = useParams();
  const [cities, setCities] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [sending,setSending]=useState(false)

  console.log("userData",userData)

  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      
      location: { city: "", district: "", postalCode: "" },
      dateOfBirth: { day: 1, month: "", year: 2000 },
      isVerified: false,
    },
  });

  // ---------------- Fetch cities + user ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, userRes] = await Promise.all([
          apiClient("/cities"),
          apiClient(`/users/${id}`),
        ]);
        setCities(citiesRes.data);
        setUserData(userRes.data);
        form.reset({
          firstName: userRes.data.firstName,
          lastName: userRes.data.lastName,
          email: userRes.data.email,
          phone: userRes.data.phone,
          gender: userRes.data.gender,
          role: userRes.data.role,
          location: {
            city: userRes.data.postalCode?.district?.city?._id || "",
            district: userRes.data.postalCode?.district?._id || "",
            postalCode: userRes.data.postalCode?._id || "",
          },
          dateOfBirth: userRes.data.dateOfBirth || {
            day: 1,
            month: "",
            year: 2000,
          },
          isVerified: userRes.data.isVerified ?? false,
        });
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, form]);

  const role = form.watch("role");

  // ---------------- Derived dropdowns ----------------
  const city = form.watch("location.city");
  const district = form.watch("location.district");

  const districts = useMemo(() => {
    return cities.find((c) => c._id === city)?.districts || [];
  }, [city, cities]);

  const postalCodes = useMemo(() => {
    return districts.find((d) => d._id === district)?.postalCodes || [];
  }, [district, districts]);

  // ---------------- Submit handler ----------------
  const onSubmit = async (data: FormValues) => {
    const cleanData = {
      ...data,
      postalCode: data.location.postalCode,
    };
    setSending(true)

    try {
      const response = await apiClient.put(`/users/${id}`, cleanData);
      if (response.data.message === "Email already exists") {
        return toast.error("Email already exists");
      }
      toast.success("User updated successfully!");
    } catch {
      toast.error("Failed to update user.");
    }
    finally{
    setSending(false)
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 p-10">Loading user...</div>
    );

  return (
    <Form  {...form}>    
    <div className="bg-white rounded-md space-y-6 p-8">
      <Picture id={id as string} url={userData?.image?.url} />
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className=" grid grid-cols-2 gap-x-6 space-y-6"
    >


      {/* --- First Name --- */}
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

      {/* --- Last Name --- */}
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

      {/* --- Phone --- */}
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

      {/* --- Email --- */}
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

      {/* --- Gender --- */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
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

      {/* --- Location --- */}
      <div className="col-span-2 w-full grid grid-cols-3 gap-6 items-end">
        {/* City */}
        <FormField
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
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
              <FormLabel>District</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={districts.length === 0}
                >
                  <SelectTrigger>
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
          name="location.postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={postalCodes.length === 0}
                >
                  <SelectTrigger>
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

      {/* --- Verify (provider only) --- */}
      {role === "provider" && (
        <FormField
          control={form.control}
          name="isVerified"
          render={({ field }) => (
            <FormItem className="col-span-2 flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Approve provider account immediately</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <button
        type="submit"
        disabled={sending}
        className="col-span-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 "
      >
        { sending ? <LoadingSpinner /> : "Save Changes"}
      </button>
    </form>
    </div>
    </Form>
  );
}
