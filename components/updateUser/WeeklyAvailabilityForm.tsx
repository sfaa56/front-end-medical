"use client";
import React from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type AvailabilityType = {
  [day: string]: {
    from: string;
    to: string;
  };
};

type WeeklyAvailabilityFormProps = {
  form: any;
};

const WeeklyAvailabilityForm = ({ form }: WeeklyAvailabilityFormProps) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="col-span-2 bg-white rounded-lg p-6 mb-6 shadow-sm space-y-6">
      <h2 className="font-semibold text-lg mb-4">Weekly Availability</h2>

      {/* Global error for availability if exists */}
      {form.formState.errors?.availability?.message && (
        <p className="text-red-500 text-sm">
          {(form.formState.errors as any)?.availability?.message}
        </p>
      )}

      <div className="space-y-4">
        {days.map((day) => {
          const isSelected = !!form.watch(`availability.${day}`);

          const toggleDay = () => {
            if (isSelected) {
              form.unregister(`availability.${day}`);
            } else {
              form.setValue(`availability.${day}`, { from: "", to: "" });
            }
          };

          return (
            <div
              key={day}
              className={`flex items-center gap-4 border rounded-lg p-3 hover:shadow-sm transition cursor-pointer ${
                isSelected ? "border-primary bg-blue-50" : "border-gray-200"
              }`}
              onClick={toggleDay}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleDay();
              }}
            >
              {/* Checkbox and label */}
              <span className="flex items-center gap-2 w-32 select-none">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  tabIndex={-1}
                  className="cursor-pointer accent-primary"
                />
                <span className="font-medium">{day}</span>
              </span>

              {/* If checked, show time pickers */}
              {isSelected && (
                <div className="flex items-center justify-between w-full gap-2">
                  {/* From */}
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name={`availability.${day}.from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <span className="text-gray-500">to</span>

                  {/* To */}
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name={`availability.${day}.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full"
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
  );
};

export default WeeklyAvailabilityForm;
