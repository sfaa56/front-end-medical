import { z } from "zod";

export const clinicSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string("Clinic name is required")
    .min(2, " must be at least 2 characters"),
  ClinicLocation: z.object(
    {
      city: z.string("Day is required").min(1, "City is required"),
      district: z.string("District is required").min(1, "District is required"),
      postalCode: z
        .string("Postal code is required")
        .min(1, "Postal code is required"),
    },
    "Location is required"
  ),
  timeFrom: z
    .string("Time from is required")
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:mm)"),
  timeTo: z
    .string("Time to is required")
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:mm)"),
  day: z.enum(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    "Must select day"
  ),
  clinicPhoto: z
    .object({
      url: z.string().url("Invalid image URL"),
      publicId: z.string().min(1, "Public ID is required"),
    })
    .optional()
    .refine((val) => !!val, { message: "Image is required" }),
});

export type ClinicFormType = z.infer<typeof clinicSchema>;
