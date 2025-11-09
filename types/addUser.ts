import { z } from "zod";

const baseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  gender: z.string().min(1, "Must select gender"),
  role: z.enum(["admin", "client", "provider", "patient"]),
  location: z.object({
    city: z
      .string({ required_error: "City is required" })
      .min(1, "City is required"),
    district: z
      .string({ required_error: "District is required" })
      .min(1, "District is required"),
    postalCode: z
      .string({ required_error: "Postal code is required" })
      .min(1, "Postal code is required"),
  }),
  dateOfBirth: z.object({
    day: z.number().min(1).max(31),
    month: z.string().min(2),
    year: z.number().min(1900).max(new Date().getFullYear()),
  }),

  

  image: z.any().optional(), // profile image
})

const doctorSchema = baseSchema.extend({
    isVerified: z.boolean().optional(),
  specialty: z.string().min(1, "Specialty is required"),
  subspecialty: z.string().min(1, "Subspecialty is required"),
  experienceYears: z.number().int().nonnegative(),
  licenseNumber: z.string().min(3),
  licenseFile: z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
  }),

  clinicName: z.string().min(2),
  ClinicLocation: z.object({
    city: z.string().min(1),
    district: z.string().min(1),
    postalCode: z.string().min(1),
  }),
  timeFrom: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  timeTo: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  clinicPhoto: z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
  }),
  availability: z.record(
    z.string(),
    z.object({
      from: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
      to: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    })
  ),
}).refine( (data) => { if (data.role !== "provider") { return data.isVerified === undefined; } return true; }, { message: "Provider approval is only for Providers.", path: ["providerApproved"], } );;;

export const registerSchema = z.union([doctorSchema, baseSchema]);
