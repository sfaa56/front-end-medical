import { z } from "zod";

export const clinicSchema = z.object({
  _id: z.string().optional(),

  name: z
    .string({ required_error: "Clinic name is required" })
    .min(2, { message: "Clinic name must be at least 2 characters" }),

  ClinicLocation: z.object({
    city: z.string({ required_error: "City is required" }),
    district: z.string({ required_error: "District is required" }),
    postalCode: z.string({ required_error: "Postal code is required" }),
  }),

  timeFrom: z
    .string({ required_error: "Time from is required" })
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, { message: "Invalid time format (HH:mm)" }),

  timeTo: z
    .string({ required_error: "Time to is required" })
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, { message: "Invalid time format (HH:mm)" }),

  day: z.enum(
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    { required_error: "Must select day" }
  ),

  clinicPhoto: z.object({
    url: z.string().url("Invalid image URL"),
    publicId: z.string({ required_error: "Public ID is required" }),
  }),
});

export type ClinicFormType = z.infer<typeof clinicSchema>;
