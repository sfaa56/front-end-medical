import { z } from "zod";

export interface User {
  _id?: string;
  firstName: string;
  lastName:string;
  email: string;
  role?: string;
  token?: string;
  phone?: string;
  image: { url: string; publicId: string };
}

const clinicSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  ClinicLocation: z.object({
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    postalCode: z.string().min(1, "Postal code is required"),
  }),
  timeFrom: z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
  timeTo: z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
  day: 
    z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]
  ), // ✅ array of weekdays
  clinicPhoto: z.object({
    url: z.string().url("Invalid photo URL"),
    publicId: z.string().min(1, "publicId is required"),
  }),
});

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
  image: z.any().optional(),
});

const doctorSchema = baseSchema.extend({
  isVerified: z.boolean().optional(),

    specialties: z.array(
    z.object({
      specialty: z.string().nonempty("Select a specialty"),
      subspecialty: z.string().nonempty("Select a subspecialty"),
      hasService:z.any()
    })
  ),
  experienceYears: z.number().int().nonnegative(),
  licenseNumber: z.string().min(3),
  licenseFile: z.object({
    url: z.string().url(),
    publicId: z.string().min(1),
  }),

  clinics: z.array(clinicSchema).optional(),

  availability: z.record(
    z.string(),
    z.object({
      from: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
      to: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    })
  ),
});

// ✅ This creates a discriminated union based on "role"
export const registerSchema = z.discriminatedUnion("role", [
  doctorSchema.extend({ role: z.literal("provider") }),
  baseSchema.extend({
    role: z.enum(["client"]),
  }),
]);

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  message: string;
}

export type UserRegisterResponse = ErrorResponse | SuccessResponse;

// Detaild user update

type FileType = {
  publicId: string;
  url: string;
};

type CityType = {
  _id: string;
  name: string;
  active: boolean;
  __v: number;
  id: string;
};

type DistrictType = {
  _id: string;
  name: string;
  active: boolean;
  city: CityType;
  __v: number;
  id: string;
};

type PostalCodeType = {
  _id: string;
  code: string;
  active: boolean;
  district: DistrictType;
  __v: number;
};

type SubspecialtyType = {
  _id: string;
  name: string;
};

type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type ClinicType = {
  clinicPhoto: FileType;
  _id: string;
  name: string;
  postalCode: PostalCodeType;
  timeFrom: string;
  timeTo: string;
  day: DayOfWeek[];
  __v: number;
};

type AvailabilityType = {
  [day: string]: {
    from: string;
    to: string;
  };
};

type DateOfBirth = {
  day: number;
  month: string;
  year: number;
};

export type UserType = {
  licenseFile: FileType;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "Male" | "Female";
  role: "provider" | "client";
  dateOfBirth: DateOfBirth;

  isActive: boolean;
  isVerified: boolean;

  phone: string;
  postalCode: PostalCodeType;
  subspecialty: SubspecialtyType;
  image: FileType;
  experienceYears: number;
  licenseNumber: string;

  clinics: ClinicType[];

  day: string[];
  availability: AvailabilityType;
};
