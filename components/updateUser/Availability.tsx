"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  availabilitySchema,
  AvailabilityFormType,
} from "@/validation/availbility";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/store/store";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { fetchUser } from "@/features/clinic/clinicSlice";
import { toast } from "sonner";

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function Availability() {
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();

  const { user } = useSelector((state: RootState) => state.clinics);

  console.log("user", user);

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setValue, watch } =
    useForm<AvailabilityFormType>({
      resolver: zodResolver(availabilitySchema),
      defaultValues: {
        availability: user?.availability || {},
      },
    });

    console.log()

  useEffect(() => {
    dispatch(fetchUser(id));
  }, [id]);

  // Set default values when user data loads
  useEffect(() => {
    if (user?.availability) {
      setValue("availability", user.availability);
    }
  }, [user, setValue]);

const onSubmit = async (data: AvailabilityFormType) => {
  try {
    setLoading(true);

    // ✅ Clean out empty days (where both from & to are empty)
    const cleanedAvailability = Object.fromEntries(
      Object.entries(data.availability).filter(
        ([, value]) => value.from || value.to
      )
    );

    // ✅ Prepare clean payload
    const cleanedData = { availability: cleanedAvailability };

    // Send to backend
    await apiClient.put(`/users/${id}`, cleanedData);

    toast.success("Availability updated successfully!");
  } catch (err) {
    console.error("Failed to update availability:", err);
    toast.error("Failed to update availability.");
  } finally {
    setLoading(false);
  }
};

  const availability = watch("availability");



  // if (isUpdating)
  //   return (
  //     <div className="flex items-center justify-center h-40">
  //       <LoadingSpinner size={35} color="#2aa0a7" />
  //     </div>
  //   );

  return (
    <div className="card p-4">
      <h2 className="text-lg font-medium mb-4">Availability</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="flex items-center justify-between border-b pb-3"
          >
            <span className="font-medium w-24">{day}</span>

            <div className="flex gap-3 items-center">
              <Controller
                name={`availability.${day}.from`}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    format="HH:mm"
                    value={field.value ? dayjs(field.value, "HH:mm") : null}
                    onChange={(time) =>
                      field.onChange(time ? time.format("HH:mm") : "")
                    }
                    placeholder="From"
                  />
                )}
              />

              <Controller
                name={`availability.${day}.to`}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    format="HH:mm"
                    value={field.value ? dayjs(field.value, "HH:mm") : null}
                    onChange={(time) =>
                      field.onChange(time ? time.format("HH:mm") : "")
                    }
                    placeholder="To"
                  />
                )}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            disabled={loading}
            type="submit"
            className="flex gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-[#2aa0a7]"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Saveing Availability...{" "}
              </>
            ) : (
              "Save Availability"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
