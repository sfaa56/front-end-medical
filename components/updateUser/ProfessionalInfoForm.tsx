"use client";

import React, { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useSpecialties } from "@/hooks/useSpecialties";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api";
import { useParams } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";

interface SubSpecialty {
  _id: string;
  name: string;
}
interface Specialty {
  _id: string;
  name: string;
  subSpecialties: SubSpecialty[];
}
interface FileType {
  url: string;
  publicId: string;
}

// ✅ Validation schema
const professionalSchema = z.object({
  specialties: z.array(
    z.object({
      specialty: z.string().nonempty("Select a specialty"),
      subspecialty: z.string().nonempty("Select a subspecialty"),
      hasService: z.any().optional(),
    })
  ),
  experienceYears: z
    .number()
    .int()
    .nonnegative("Experience years must be positive"),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseFile: z
    .object({
      url: z.string().url("Invalid file URL"),
      publicId: z.string().optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof professionalSchema>;

export default function ProfessionalInfoForm() {
  const { specialties, getsubSpecialties } = useSpecialties();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const { id } = useParams();

  const [clinicPhotoProgress, setClinicPhotoProgress] = useState<number>(0);

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

  const form = useForm<FormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      specialties: [{ specialty: "", subspecialty: "", hasService: false }],
      experienceYears: 0,
      licenseNumber: "",
      licenseFile: undefined,
    },
  });

  // ✅ Fetch and prefill user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient(`/users/${id}`);
        const user = res.data;

        // 🔹 Prefill specialties
        const specialties =
          user.formattedSubspecialties?.map((item: any) => ({
            specialty: item.specialtyId,
            subspecialty: item.subSpecialties?.[0]?.value || "",
            hasService: item.hasService ?? false,
          })) || [];

        // 🔹 Prefill experience, license, etc.
        form.reset({
          specialties,
          experienceYears: user.experienceYears || 0,
          licenseNumber: user.licenseNumber || "",
          licenseFile: user.licenseFile
            ? {
                url: user.licenseFile.url,
                publicId: user.licenseFile.publicId,
              }
            : undefined,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load professional info.");
      }
    };

    if (id) fetchUser();
  }, [id, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setSending(true);

      const { specialties, ...rest } = data;

      // Remove duplicates (based on _id or the raw value)
      const uniqueSubSpecialties = [
        ...new Set(
          specialties.map((s) => (s as any).subspecialty?._id || s.subspecialty)
        ),
      ];

      const cleanData = {
        ...rest,
        subspecialty: uniqueSubSpecialties,
      };

      console.log("clean", cleanData);

      const response = await apiClient.put(`/users/${id}`, cleanData);

      toast.success("Professional info updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update professional info.");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 p-10">
        Loading professional info...
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-md space-y-6 p-8 grid grid-cols-2 gap-x-6">
          <h2 className="col-span-2 font-semibold text-lg mb-4">
            Professional Info
          </h2>

          <div className="col-span-2 ">
            <h3 className="text-lg font-semibold mb-3">Provider Specialties</h3>

            {fields.map((field, index) => {
              const selectedSpecialty = form.watch(
                `specialties.${index}.specialty`
              );
              const hasService = form.watch(`specialties.${index}.hasService`);
              const subSpecialties = getsubSpecialties(selectedSpecialty);

              console.log("subSpecialties", subSpecialties);

              return (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row gap-4 items-end  pb-4 mb-3"
                >
                  {/* Specialty */}
                  <FormField
                    control={form.control}
                    name={`specialties.${index}.specialty`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            disabled={hasService}
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.setValue(
                                `specialties.${index}.subspecialty`,
                                ""
                              ); // reset sub
                            }}
                          >
                            <SelectTrigger className="gap-4">
                              <SelectValue placeholder="Select Specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              {specialties.map((s) => (
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

                  {/* Subspecialty */}
                  <FormField
                    control={form.control}
                    name={`specialties.${index}.subspecialty`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Sub-Specialty</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedSpecialty || hasService}
                          >
                            <SelectTrigger className="gap-4">
                              <SelectValue placeholder="Select Sub-Specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              {subSpecialties.map((s: any) => (
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

                  {!hasService && (
                    <button
                      type="button"
                      className="self-center mt-1"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => append({ specialty: "", subspecialty: "" })}
              >
                + Add Another
              </button>
            </div>
          </div>

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
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
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

          {/* Upload Medical License */}
          <div className="mt-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Medical License
            </label>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
              onClick={() => document.getElementById("licenseFile")?.click()}
            >
              <p className="text-sm text-gray-500">
                Drag and drop your file here, or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: PDF, JPG, PNG (max 5MB)
              </p>
            </div>

            {/* Hidden file input */}
            <FormField
              control={form.control}
              name="licenseFile"
              render={() => (
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
                          handleClinicPhotoUpload(e, field.onChange, field.name)
                        }
                      />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Progress */}
            {clinicPhotoProgress > 0 && clinicPhotoProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${clinicPhotoProgress}%` }}
                />
              </div>
            )}

            {/* File Preview */}
            {form.watch("licenseFile") && (
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p className="font-medium">Uploaded License File:</p>

                {(() => {
                  const file = form.watch("licenseFile");
                  if (!file?.url) return null;

                  const isImage = file.url.match(/\.(jpg|jpeg|png|gif)$/i);
                  const isPDF = file.url.match(/\.pdf$/i);

                  return (
                    <div className="flex flex-col space-y-2">
                      {isImage && (
                        <img
                          src={file.url}
                          alt="License Preview"
                          className="w-40 h-40 object-cover rounded-lg border shadow-sm"
                        />
                      )}

                      {isPDF && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Uploaded PDF
                        </a>
                      )}

                      {!isImage && !isPDF && (
                        <p className="text-gray-500">
                          File uploaded: {file.url}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="col-span-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 "
          >
            {sending ? <LoadingSpinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </Form>
  );
}
