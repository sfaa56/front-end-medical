import { z } from "zod";

export const availabilitySchema = z.object({
  availability: z.record(
    z.string(),
    z
      .object({
        from: z
          .string()
          .optional()
          .nullable()
          .refine(
            (val) =>
              !val || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(val),
            "Invalid time format (HH:mm)"
          ),
        to: z
          .string()
          .optional()
          .nullable()
          .refine(
            (val) =>
              !val || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(val),
            "Invalid time format (HH:mm)"
          ),
      })
      // ✅ Add refinement to require both or none
      .refine(
        (data) =>
          (!data.from && !data.to) || (data.from && data.to),
        {
          message: "Both 'from' and 'to' must be filled or both empty",
          path: ["to"], // show error under 'to' field
        }
      )
  ),
});

export type AvailabilityFormType = z.infer<typeof availabilitySchema>;
