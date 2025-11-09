"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePicker, TimePicker, Select } from "antd";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Controller, useForm } from "react-hook-form";
import { ClinicFormType, clinicSchema } from "@/validation/clinic";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import CustomSelect from "@/components/ui/CustomSelect";
import { useLocationData } from "@/hooks/useLocationData";
import {
  addClinic,
  deleteClinic,
  fetchUser,
  updateClinic,
} from "@/features/clinic/clinicSlice";
import Loading from "../Loading";
import FormError from "../FormError";
import ImageUpload from "../ImageUploadd";
import { useParams } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";

export default function ClinicForm() {
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();

  const { user, adding, updating, deleting } = useSelector(
    (state: RootState) => state.clinics
  );


  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    setValue,
    getValues,
    watch,
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClinicFormType>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
      ClinicLocation: {
        city: "",
        district: "",
        postalCode: "",
      },
      timeFrom: undefined,
      timeTo: undefined,
      day: "Sunday",
      clinicPhoto: {
        url: "",
        publicId: "",
      },
    },
  });

  useEffect(() => {

    
    dispatch(fetchUser(id));

 

  }, [id]);

  console.log("erorr", errors);

  /////////////////////////////

  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // upload pic
  const [progress, setProgress] = useState<number>(0);

  const { cities } = useLocationData();

  const selectedCity = watch("ClinicLocation.city");
  const selectedDistrict = watch("ClinicLocation.district");

  const availableDistricts = useMemo(() => {
    return cities.find((c) => c._id === selectedCity)?.districts || [];
  }, [selectedCity, cities]);

  const availablePostalcodes = useMemo(() => {
    return (
      availableDistricts.find((d) => d._id === selectedDistrict)?.postalCodes ||
      []
    );
  }, [availableDistricts, selectedDistrict]);

  console.log("edingIndx", editingIndex); ///////////////////////////////////////////

  const onSubmit = useCallback(
    async (data: ClinicFormType) => {
      const { ClinicLocation, ...rest } = data;

      const claenData = {
        ...rest,
        postalCode: ClinicLocation.postalCode,
      };

      try {
        if (editingIndex !== null) {
          await dispatch(
            updateClinic({ id: data._id!, data: claenData })
          ).unwrap();
          setEditingIndex(null);
        } else {
          await dispatch(
            addClinic({ userId: id, data: claenData })
          ).unwrap();
        }
        reset();
        setShowForm(false);
      } catch (err) {
        console.error("Clinic save failed:", err);
      }
    },
    [dispatch, editingIndex, reset, id]
  );

  const handleEdit = useCallback(
    (index: number) => {
      const clinic = user?.clinics?.[index];
      if (!clinic) return;

      reset({
        ...clinic,
        ClinicLocation: {
          city: clinic.postalCode.district.city._id,
          district: clinic.postalCode.district._id,
          postalCode: clinic.postalCode._id,
        },
        clinicPhoto: clinic.clinicPhoto || {
          url: "",
          publicId: "",
        },
        day: clinic.day[0],
      });

      setEditingIndex(index);
      setShowForm(true);
    },
    [reset, user?.clinics]
  );

  const handleDelete = useCallback(
    async (index: number, clinicId: string) => {
      console.log("hiii");
      await dispatch(deleteClinic({ id: clinicId })).unwrap();
    },
    [dispatch, id]
  );

  const handelForm = () => {
    if (showForm && editingIndex !== null) {
      setEditingIndex(null);
    }

    if (showForm) {
      // closing
      setShowForm(false);
    } else {
      // opening for a new clinic — reset form to empty
      reset({
        name: "",
        ClinicLocation: { city: "", district: "", postalCode: "" },
        timeFrom: undefined,
        timeTo: undefined,
        day: "Sunday",
        clinicPhoto: { url: "", publicId: "" },
      });
      setShowForm(true);
    }
  };


  console.log("user",user)

  return (
    <div className="p-4 card bg-white space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">Clinics</h2>
        <button
          onClick={() => handelForm()}
          className={`px-2 py-2 rounded-md transition ${
            showForm
              ? "bg-gray-50 text-secondary hover:text-secondary/90 border"
              : "bg-primary hover:bg-[#2aa0a7] text-white"
          }`}
        >
          {showForm ? "Cancel" : "Add Clinic"}
        </button>
      </div>

      {/* Slide Down Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg shadow-md">
              <div>
                <input
                  type="text"
                  placeholder="Clinic Name"
                  {...register("name")}
                  className="w-full border rounded-md px-3 py-2"
                />
                <FormError message={errors.name?.message} />
              </div>

              <div className="grid grid-cols-3 gap-6 mt-4 items-start">
                <div>
                  {/* City */}
                  <Controller
                    control={control}
                    name={`ClinicLocation.city` as const}
                    render={({ field }) => (
                      <CustomSelect
                        options={cities.map((l) => ({
                          label: l.name,
                          value: l._id,
                        }))}
                        value={field.value}
                        placeholder="Select City"
                        onChange={(val:string) => {
                          setValue("ClinicLocation.city", val);
                        }}
                      />
                    )}
                  />

                  <FormError message={errors.ClinicLocation?.city?.message} />
                </div>

                {/* District */}
                <div>
                  <Controller
                    control={control}
                    name={`ClinicLocation.district` as const}
                    render={({ field }) => (
                      <CustomSelect
                        options={availableDistricts.map((l) => ({
                          label: l.name,
                          value: l._id,
                        }))}
                        value={field.value}
                        placeholder="Select District"
                        onChange={(val) => {
                          setValue("ClinicLocation.district", val);
                        }}
                      />
                    )}
                  />

                  <FormError
                    message={errors.ClinicLocation?.district?.message}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <Controller
                    control={control}
                    name={`ClinicLocation.postalCode` as const}
                    render={({ field }) => (
                      <CustomSelect
                        options={availablePostalcodes.map((l) => ({
                          label: l.code,
                          value: l._id,
                        }))}
                        value={field.value}
                        placeholder="Select Postalcode"
                        onChange={(val) => {
                          setValue("ClinicLocation.postalCode", val);
                        }}
                      />
                    )}
                  />

                  <FormError
                    message={errors.ClinicLocation?.postalCode?.message}
                  />
                </div>
              </div>
              <div>
                <Controller
                  control={control}
                  name="day"
                  render={({ field }) => (
                    <Select {...field} className="w-full">
                      {daysOfWeek.map((d) => (
                        <Select.Option key={d} value={d}>
                          {d}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.day && (
                  <p className="text-red-500 text-sm">{errors.day.message}</p>
                )}
              </div>
              <div>
                <div className="flex gap-3">
                  <Controller
                    control={control}
                    name="timeFrom"
                    render={({ field }) => (
                      <TimePicker
                        format="HH:mm"
                        className="w-full"
                        value={field.value ? dayjs(field.value, "HH:mm") : null}
                        onChange={(time) =>
                          field.onChange(time ? time.format("HH:mm") : "")
                        }
                        placeholder="From"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="timeTo"
                    render={({ field }) => (
                      <TimePicker
                        format="HH:mm"
                        className="w-full"
                        value={field.value ? dayjs(field.value, "HH:mm") : null}
                        onChange={(time) =>
                          field.onChange(time ? time.format("HH:mm") : "")
                        }
                        placeholder="To"
                      />
                    )}
                  />
                </div>

                {(errors.timeFrom || errors.timeTo) && (
                  <p className="text-red-500 text-sm">
                    {errors.timeFrom?.message || errors.timeTo?.message}
                  </p>
                )}
              </div>

              <Controller
                name="clinicPhoto"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={adding || updating}
                    label="Clinic Photo"
                    error={errors.clinicPhoto?.message}
                  />
                )}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={progress !== 0 || adding || updating}
                  className={`px-3 py-2 btn bg-primary text-white rounded-md ${
                    progress !== 0 || adding || updating
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {adding || updating ? (
                    <LoadingSpinner />
                  ) : editingIndex !== null ? (
                    "Update Clinic"
                  ) : (
                    "Save Clinic"
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List of Clinics */}
      <div className="space-y-3">
        {(!user?.clinics || user?.clinics.length === 0) && (
          <p className="text-gray-400 text-sm">No clinics added yet.</p>
        )}

        {user?.clinics.map((c: any, index: number) => (
          <div
            key={c._id}
            className="p-3 border rounded-lg shadow-sm bg-white flex justify-between items-start"
          >
            <div className="flex gap-3">
              {c?.clinicPhoto && (
                <img
                  src={c.clinicPhoto?.url}
                  alt={c.name}
                  className="w-20 h-20 object-cover rounded-md border"
                />
              )}
              <div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-lg">{c.name}</h3>
                  <div>
                    <span className="text-sm text-gray-600">
                      {c.postalCode.code} - {c.postalCode.district.name} -{" "}
                      {c.postalCode.district.city.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {c.day} | {c.timeFrom} - {c.timeTo}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="p-1 text-secondary hover:text-secondary"
              >
                <MdEdit size={18} />
              </button>

              <button
                onClick={() => handleDelete(index, c._id)}
                className="p-1 text-secondary hover:text-secondary"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
