import { z } from "zod";

export const CreateBookingSchema = z.object({
  photographerId: z
    .string({
      required_error: "Photographer ID is required",
      invalid_type_error: "Photographer ID must be a string",
    })
    .min(1, "Photographer ID cannot be empty"),
  eventDate: z
    .string({
      required_error: "Event date is required",
      invalid_type_error: "Event date must be a string",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Event date must be in the future",
    }),
  message: z.string().optional(),
});

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "completed"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be 'accepted', 'rejected', or 'completed'",
  }),
});

export const UpdateBookingSchema = z
  .object({
    eventDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .refine((date) => new Date(date) > new Date(), {
        message: "Event date must be in the future",
      })
      .optional(),
    message: z.string().optional(),
  })
  .strict();

export type CreateBookingType = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusType = z.infer<typeof UpdateBookingStatusSchema>;
export type UpdateBookingType = z.infer<typeof UpdateBookingSchema>;
