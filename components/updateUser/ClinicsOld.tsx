"use client";
import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ClinicInfoFormProps = {
  form: any;
  index: number;
  cities: any[];
  licenseFileProgress: number;
  handleLicenseFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void,
    fieldName: string
  ) => void;
};

const ClinicInfoForm = ({
  form,
  index,
  cities,
  licenseFileProgress,
  handleLicenseFileUpload,
}: ClinicInfoFormProps) => {
  const { watch } = form;

  // Watch city & district for this clinic
  const clinicCity = watch(`clinics.${index}.ClinicLocation.city`);
  const clinicDistrict = watch(`clinics.${index}.ClinicLocation.district`);

  // Compute districts based on selected city
  const districts = useMemo(() => {
    return cities.find((c) => c._id === clinicCity)?.districts || [];
  }, [clinicCity, cities]);

  // Compute postal codes based on selected district
  const postalCodes = useMemo(() => {
    return districts.find((d) => d._id === clinicDistrict)?.postalCodes || [];
  }, [clinicDistrict, districts]);

  return (
    <div className="col-span-2 bg-white rounded-lg p-6 mb-6 shadow-sm space-y-6">
      <h2 className="font-semibold text-lg mb-4">Clinic Information</h2>

      {/* Clinic Name */}
      <FormField
        control={form.control}
        name={`clinics.${index}.clinicName` as const}
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

      {/* Location */}
      <div className="grid grid-cols-3 gap-6 mt-4 items-end">
        {/* City */}
        <FormField
          control={form.control}
          name={`clinics.${index}.ClinicLocation.city` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="gap-4">
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
          name={`clinics.${index}.ClinicLocation.district` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="gap-4">
                    <SelectValue placeholder="Select District" />
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
          name={`clinics.${index}.ClinicLocation.postalCode` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="gap-4">
                    <SelectValue placeholder="Select Postal Code" />
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
      {/* File Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Clinic Photo
        </label>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
          onClick={() => {
            const input = document.getElementById(`clinicPhoto-${index}`);
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
          name={`clinics.${index}.clinicPhoto` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <Controller
                name={`clinics.${index}.clinicPhoto` as const}
                control={form.control}
                render={({ field }) => (
                  <input
                    id={`clinicPhoto-${index}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) =>
                      handleLicenseFileUpload(e, field.onChange, field.name)
                    }
                  />
                )}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Progress Bar */}
        {licenseFileProgress > 0 && licenseFileProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${licenseFileProgress}%` }}
            />
          </div>
        )}

        {/* Preview */}
        {watch(`clinics.${index}.clinicPhoto`) && (
          <div className="mt-2 text-sm text-gray-600">
            {watch(`clinics.${index}.clinicPhoto`)?.url ? (
              <div className="flex flex-col items-start space-y-2">
                <img
                  src={watch(`clinics.${index}.clinicPhoto`).url}
                  alt="Clinic"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
export default ClinicInfoForm;
